import { services } from "@/data/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { QuoteServiceLink } from "@/components/QuoteServiceLink";

export function Services() {
  return (
    <section id="servicios" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
          <h2 className="heading text-[clamp(2rem,4vw,2.9rem)]">Servicios</h2>
          <p className="max-w-[56ch] text-lg leading-relaxed text-ink-soft">
            Puedes contratarnos para un proyecto puntual o para acompañar a tu equipo de forma continua. Todos los
            servicios empiezan con una reunión sin costo para entender qué necesitas.
          </p>
        </div>

        {/* Rejilla tipo ficha técnica: celdas con bordes compartidos */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="flex flex-col bg-white p-7 md:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-cobalt-tint text-cobalt">
                <ServiceIcon name={service.icon} />
              </span>
              <h3 className="heading mt-5 text-xl">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{service.description}</p>
              <QuoteServiceLink serviceId={service.id} serviceTitle={service.title} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
