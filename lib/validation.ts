/**
 * Validación compartida: la usan el formulario (cliente) y la API (servidor),
 * así las reglas son exactamente las mismas en ambos lados.
 */
import { services } from "@/data/services";

export type LeadInput = {
  name: string;
  email: string;
  company: string;
  message: string;
  serviceInterest: string;
};

export type LeadField = keyof LeadInput;
export type FieldErrors = Partial<Record<LeadField, string>>;

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  companyMax: 120,
  messageMin: 10,
  messageMax: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const serviceIds = new Set(services.map((s) => s.id));

export function validateField(field: LeadField, rawValue: string): string | undefined {
  const value = rawValue.trim();
  switch (field) {
    case "name":
      if (value.length < LIMITS.nameMin) return `Escribe tu nombre (mínimo ${LIMITS.nameMin} caracteres).`;
      if (value.length > LIMITS.nameMax) return `El nombre admite hasta ${LIMITS.nameMax} caracteres.`;
      return;
    case "email":
      if (!value) return "Escribe tu correo electrónico.";
      if (value.length > LIMITS.emailMax || !EMAIL_RE.test(value))
        return "Revisa el correo: debe tener el formato nombre@empresa.com.";
      return;
    case "company":
      if (value.length > LIMITS.companyMax) return `El nombre de la empresa admite hasta ${LIMITS.companyMax} caracteres.`;
      return;
    case "message":
      if (value.length < LIMITS.messageMin)
        return `Cuéntanos un poco más (mínimo ${LIMITS.messageMin} caracteres).`;
      if (value.length > LIMITS.messageMax) return `El mensaje admite hasta ${LIMITS.messageMax} caracteres.`;
      return;
    case "serviceInterest":
      if (value && !serviceIds.has(value)) return "Elige un servicio de la lista.";
      return;
  }
}

const FIELDS: LeadField[] = ["name", "email", "company", "message", "serviceInterest"];

export function validateLead(
  raw: unknown,
): { ok: true; data: LeadInput } | { ok: false; errors: FieldErrors } {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data = {} as LeadInput;
  const errors: FieldErrors = {};

  for (const field of FIELDS) {
    const value = typeof source[field] === "string" ? (source[field] as string) : "";
    const error = validateField(field, value);
    if (error) errors[field] = error;
    data[field] = value.trim();
  }
  data.email = data.email.toLowerCase();

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
