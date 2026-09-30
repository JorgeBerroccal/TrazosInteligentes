import { HeroDiagram } from "@/components/HeroDiagram";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="inicio" className="blueprint relative overflow-hidden pt-16">
      {/* Overlay para que el texto se lea bien sobre la cuadrícula */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_45%,var(--color-paper)_25%,transparent_75%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-28">
        <div>
          <h1 className="display max-w-[15ch] text-[clamp(2.3rem,5.6vw,4.1rem)] text-ink">
            Software que se adapta a cómo trabaja tu empresa
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
            Diseñamos, construimos y mantenemos sistemas a medida, aplicaciones web y móviles e infraestructura en la
            nube. Un mismo equipo te acompaña desde la primera reunión hasta el soporte.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contacto" className="btn btn-primary">
              Solicitar cotización
            </a>
            <a href="#portafolio" className="btn btn-secondary">
              Ver portafolio
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
            {site.responseTime}
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <HeroDiagram />
        </div>
      </div>
    </section>
  );
}
