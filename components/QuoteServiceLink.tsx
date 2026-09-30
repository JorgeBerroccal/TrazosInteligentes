"use client";

import { SELECT_SERVICE_EVENT } from "@/lib/events";

export function QuoteServiceLink({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  return (
    <a
      href="#contacto"
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: serviceId }))}
      className="mt-auto inline-flex min-h-11 items-center pt-5 text-[0.95rem] font-semibold text-cobalt underline decoration-cobalt/30 decoration-2 underline-offset-4 hover:decoration-cobalt"
      aria-label={`Cotizar ${serviceTitle}`}
    >
      Cotizar este servicio
    </a>
  );
}
