"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#inicio");

  // Sombra del header al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta el enlace de la sección visible
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((s): s is HTMLElement => Boolean(s));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Cerrar el menú móvil con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-white/90 backdrop-blur transition-shadow ${
        scrolled || open ? "border-line shadow-[0_1px_12px_rgb(15_26_51/0.08)]" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5" aria-label="Principal">
        <a href="#inicio" onClick={() => setOpen(false)} aria-label="Ir al inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-[0.95rem] font-medium transition-colors hover:text-cobalt ${
                  active === link.href ? "text-cobalt" : "text-ink-soft"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-3">
            <a href="#contacto" className="btn btn-primary min-h-10 px-4 text-sm">
              Solicitar cotización
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div id="menu-movil" hidden={!open} className="border-t border-line bg-white md:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md py-3 text-lg font-medium text-ink hover:text-cobalt"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2 pb-1">
            <a href="#contacto" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Solicitar cotización
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
