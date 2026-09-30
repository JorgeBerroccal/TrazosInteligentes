/**
 * Aviso opcional por email de cada nuevo lead usando la API de Resend.
 * Solo se activa si existen RESEND_API_KEY y LEADS_NOTIFY_TO.
 * Si falla, no bloquea el formulario: el lead ya quedó guardado.
 */
import type { Lead } from "@/lib/storage";
import { services } from "@/data/services";

export async function notifyNewLead(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_TO;
  if (!apiKey || !to) return;

  const service = services.find((s) => s.id === lead.serviceInterest)?.title ?? "No indicado";
  const text = [
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    `Empresa: ${lead.company || "No indicada"}`,
    `Servicio de interés: ${service}`,
    "",
    lead.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_NOTIFY_FROM || "onboarding@resend.dev",
        to: [to],
        reply_to: lead.email,
        subject: `Nueva solicitud de ${lead.name}`,
        text,
      }),
    });
    if (!res.ok) console.error("[notify] Resend respondió", res.status, await res.text());
  } catch (error) {
    console.error("[notify] No se pudo enviar el aviso por email", error);
  }
}
