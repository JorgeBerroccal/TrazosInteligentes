import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { site, whatsappUrl } from "@/lib/site";

export function Contact() {
  const items = [
    { Icon: Mail, label: "Correo", value: site.email, href: `mailto:${site.email}` },
    { Icon: Phone, label: "Teléfono", value: site.phone, href: site.phoneHref },
    { Icon: MessageCircle, label: "WhatsApp", value: "Escríbenos directamente", href: whatsappUrl },
    { Icon: MapPin, label: "Oficina", value: site.address },
    { Icon: Clock, label: "Horario de atención", value: site.hours },
  ];

  return (
    <section id="contacto" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-[40rem]">
          <h2 className="heading text-[clamp(2rem,4vw,2.9rem)]">Solicita una cotización</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Cuéntanos qué necesitas y te respondemos con una propuesta inicial o una fecha para conversar.{" "}
            {site.responseTime}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <div className="relative rounded-2xl border border-line bg-paper p-6 sm:p-9">
            <ContactForm />
          </div>

          <aside aria-label="Otros medios de contacto">
            <h3 className="heading text-xl">Otros medios de contacto</h3>
            <dl className="mt-6 grid gap-6">
              {items.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-cobalt">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-sm text-ink-soft">{label}</dt>
                    <dd className="mt-0.5 font-medium">
                      {href ? (
                        <a
                          href={href}
                          className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-cobalt"
                          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
