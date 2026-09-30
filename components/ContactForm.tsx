"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";
import { services } from "@/data/services";
import { SELECT_SERVICE_EVENT } from "@/lib/events";
import { LIMITS, validateField, validateLead, type FieldErrors, type LeadField, type LeadInput } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "notice" | "error";

const EMPTY: LeadInput = { name: "", email: "", company: "", message: "", serviceInterest: "" };
const FIELD_ORDER: LeadField[] = ["name", "email", "company", "serviceInterest", "message"];

export function ContactForm() {
  const [values, setValues] = useState<LeadInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Preselecciona el servicio cuando el usuario hace clic en "Cotizar este servicio"
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, serviceInterest: id }));
      setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("#name")?.focus({ preventScroll: true }), 500);
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const update = (field: LeadField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    if (status === "success" || status === "notice") setStatus("idle");
  };

  const blur = (field: LeadField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const result = validateLead(values);
    if (!result.ok) {
      setErrors(result.errors);
      setTouched({ name: true, email: true, company: true, message: true, serviceInterest: true });
      setStatus("idle");
      focusFirstError(result.errors);
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypotRef.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: FieldErrors };

      if (res.ok) {
        setValues(EMPTY);
        setErrors({});
        setTouched({});
        setStatus("success");
        setFeedback("Gracias, te contactaremos pronto.");
        return;
      }
      if (res.status === 409) {
        setStatus("notice");
        setFeedback(data.error ?? "Ya recibimos tu solicitud. Te responderemos pronto.");
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }
      setStatus("error");
      setFeedback(data.error ?? "No pudimos enviar tu mensaje. Vuelve a intentarlo en unos minutos.");
    } catch {
      setStatus("error");
      setFeedback("No pudimos conectar con el servidor. Revisa tu conexión y vuelve a intentarlo.");
    }
  }

  const submitting = status === "submitting";
  const fieldProps = (field: LeadField) => ({
    id: field,
    name: field,
    value: values[field],
    onBlur: () => blur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : field === "message" ? "message-hint" : undefined,
    className: "field mt-2",
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Nombre</Label>
          <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={LIMITS.nameMax} required onChange={(e) => update("name", e.target.value)} />
          <FieldError field="name" message={errors.name} />
        </div>
        <div>
          <Label htmlFor="email" required>Correo electrónico</Label>
          <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.emailMax} required onChange={(e) => update("email", e.target.value)} />
          <FieldError field="email" message={errors.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Empresa</Label>
          <input {...fieldProps("company")} type="text" autoComplete="organization" maxLength={LIMITS.companyMax} onChange={(e) => update("company", e.target.value)} />
          <FieldError field="company" message={errors.company} />
        </div>
        <div>
          <Label htmlFor="serviceInterest">Servicio de interés</Label>
          <select {...fieldProps("serviceInterest")} onChange={(e) => update("serviceInterest", e.target.value)}>
            <option value="">Aún no lo sé</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <FieldError field="serviceInterest" message={errors.serviceInterest} />
        </div>
      </div>

      <div>
        <Label htmlFor="message" required>Mensaje</Label>
        <textarea {...fieldProps("message")} rows={5} maxLength={LIMITS.messageMax} required onChange={(e) => update("message", e.target.value)} placeholder="Cuéntanos qué necesitas, para cuándo y cualquier detalle que nos ayude a cotizar." />
        {errors.message ? (
          <FieldError field="message" message={errors.message} />
        ) : (
          <p id="message-hint" className="mt-1.5 text-sm text-ink-soft">
            Mínimo {LIMITS.messageMin} caracteres.
          </p>
        )}
      </div>

      {/* Honeypot: invisible para personas; si un bot lo llena, el envío se descarta */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">No llenes este campo</label>
        <input ref={honeypotRef} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {feedback && status !== "idle" && status !== "submitting" && <StatusMessage status={status} text={feedback} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary sm:min-w-52" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            "Enviar solicitud"
          )}
        </button>
        <p className="text-sm text-ink-soft">
          Usamos tus datos solo para responder esta solicitud.{" "}
          <a href="#privacidad" className="underline underline-offset-2 hover:text-ink">
            Aviso de privacidad
          </a>
        </p>
      </div>
    </form>
  );
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block font-medium text-ink">
      {children}
      {required ? (
        <span className="text-danger" aria-hidden="true"> *</span>
      ) : (
        <span className="font-normal text-ink-soft"> (opcional)</span>
      )}
    </label>
  );
}

function FieldError({ field, message }: { field: LeadField; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
      <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function StatusMessage({ status, text }: { status: Status; text: string }) {
  const styles = {
    success: { box: "border-signal/40 bg-signal-tint text-[#0a6b55]", Icon: CircleCheck, role: "status" as const },
    notice: { box: "border-cobalt/30 bg-cobalt-tint text-cobalt-dark", Icon: Info, role: "status" as const },
    error: { box: "border-danger/40 bg-danger-tint text-danger", Icon: CircleAlert, role: "alert" as const },
  };
  const s = styles[status as "success" | "notice" | "error"];
  if (!s) return null;
  return (
    <div role={s.role} className={`flex items-start gap-3 rounded-lg border px-4 py-3 font-medium ${s.box}`}>
      <s.Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
