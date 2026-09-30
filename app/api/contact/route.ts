import { NextResponse, type NextRequest } from "next/server";
import { validateLead } from "@/lib/validation";
import { checkRateLimit, createLead, storageMode } from "@/lib/storage";
import { notifyNewLead } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10_000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "desconocida";
}

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  // 1. Leer el cuerpo con un tamaño máximo
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "El mensaje es demasiado largo." }, 413);
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object") throw new Error();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  // 2. Honeypot: los humanos no ven este campo. Si viene lleno, es un bot.
  //    Respondemos "éxito" para no darle pistas, pero no guardamos nada.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true }, 200);
  }

  try {
    // 3. Límite de peticiones por IP
    const allowed = await checkRateLimit(getClientIp(req));
    if (!allowed) {
      return json(
        { ok: false, error: "Recibimos demasiados envíos desde tu conexión. Espera unos minutos y vuelve a intentarlo." },
        429,
      );
    }

    // 4. Validación en servidor (mismas reglas que en el cliente)
    const result = validateLead(body);
    if (!result.ok) {
      return json({ ok: false, error: "Revisa los campos marcados.", errors: result.errors }, 422);
    }

    // 5. Guardar (con control de duplicados de 24 h)
    const saved = await createLead(result.data);
    if (!saved.ok) {
      return json(
        {
          ok: false,
          error: "Ya recibimos una solicitud con este correo en las últimas 24 horas. Te responderemos pronto.",
        },
        409,
      );
    }

    console.info(`[contact] Nuevo lead ${saved.lead.id} guardado (modo ${storageMode})`);
    await notifyNewLead(saved.lead);

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[contact] Error al procesar la solicitud", error);
    return json({ ok: false, error: "No pudimos enviar tu mensaje. Vuelve a intentarlo en unos minutos." }, 500);
  }
}
