import { Logo } from "@/components/Logo";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-[34ch] leading-relaxed">{site.tagline}</p>
        </div>

        <div>
          <h2 className="font-semibold text-white">Contacto</h2>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="hover:text-white hover:underline">
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>

        <nav aria-label="Enlaces rápidos">
          <h2 className="font-semibold text-white">Secciones</h2>
          <ul className="mt-4 grid gap-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 text-sm md:grid-cols-[1fr_auto] md:gap-10">
          <p id="privacidad" className="max-w-[80ch] leading-relaxed">
            <strong className="font-semibold text-white">Aviso de privacidad.</strong> Los datos que envías por el
            formulario de contacto se usan únicamente para responder tu solicitud. No los compartimos con terceros ni
            los usamos para publicidad. Puedes pedir que los eliminemos escribiendo a {site.email}.
          </p>
          <p className="text-white/60">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
