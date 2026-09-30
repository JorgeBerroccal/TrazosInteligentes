import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

/** Botón flotante de contacto inmediato, visible en todas las secciones. */
export function FloatingContact() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#128c52] pr-5 pl-4 font-semibold text-white shadow-[0_6px_20px_rgb(15_26_51/0.3)] transition-colors hover:bg-[#0e7443] sm:right-6 sm:bottom-6"
      aria-label="Escribir por WhatsApp (se abre en otra pestaña)"
    >
      <MessageCircle size={24} strokeWidth={2} aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
