"use client";

import { useState } from "react";
import Image from "next/image";
import { projects, projectCategories, type Project } from "@/data/projects";
import { ProjectModal } from "@/components/ProjectModal";

const ALL = "Todos";

export function Portfolio() {
  const [filter, setFilter] = useState(ALL);
  const [selected, setSelected] = useState<Project | null>(null);

  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portafolio" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
          <h2 className="heading text-[clamp(2rem,4vw,2.9rem)]">Portafolio</h2>
          <p className="max-w-[56ch] text-lg leading-relaxed text-ink-soft">
            Algunos proyectos recientes. Abre cualquiera para ver qué problema resolvimos y con qué tecnologías.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar proyectos por categoría">
          {[ALL, ...projectCategories].map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category)}
                className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => {
            const wide = filter === ALL && index === 0;
            return (
              <li key={project.id} className={wide ? "lg:col-span-2" : undefined}>
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  aria-haspopup="dialog"
                  aria-label={`${project.title}. ${project.category}. Ver detalles`}
                  className="group block w-full rounded-xl text-left"
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-line bg-white lg:aspect-auto lg:h-72">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes={wide ? "(min-width: 1024px) 740px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Overlay: solo en pantallas medianas o grandes con mouse (hover) */}
                    <div className="absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:pointer-fine:flex">
                      <span className="text-sm font-medium text-white/80">{project.category}</span>
                      <span className="heading mt-1 text-xl text-white">{project.title}</span>
                      <span className="mt-2 text-[0.95rem] text-white/85">{project.summary}</span>
                      <span className="mt-4 text-sm font-semibold text-white underline underline-offset-4">Ver detalles</span>
                    </div>
                  </div>

                  {/* En móvil y pantallas táctiles la información siempre está visible */}
                  <div className="pt-4 md:pointer-fine:hidden">
                    <span className="text-sm font-semibold text-cobalt">{project.category}</span>
                    <span className="heading mt-1 block text-lg">{project.title}</span>
                    <span className="mt-1 block text-ink-soft">{project.summary}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
