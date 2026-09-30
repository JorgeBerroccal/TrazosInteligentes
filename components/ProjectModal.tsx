"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/data/projects";

type Props = { project: Project | null; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // Abrir / cerrar el <dialog> nativo (maneja foco y tecla Escape)
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  // Evitar que la página de fondo se desplace mientras el modal está abierto
  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [project]);

  const goToContact = () => {
    ref.current?.close();
    setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby="modal-proyecto-titulo"
      className="project-modal m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100%-2rem))] overflow-y-auto rounded-2xl bg-white p-0 text-ink shadow-2xl"
    >
      {project && (
        <div>
          <div className="relative aspect-[3/2] w-full bg-paper sm:aspect-[16/9]">
            <Image src={project.image} alt="" fill sizes="(max-width: 860px) 100vw, 832px" className="object-cover" />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-md hover:bg-paper"
              aria-label="Cerrar detalle del proyecto"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 sm:p-9">
            <p className="text-sm font-semibold text-cobalt">{project.category}</p>
            <h3 id="modal-proyecto-titulo" className="heading mt-2 text-[clamp(1.5rem,3vw,2rem)]">
              {project.title}
            </h3>
            <p className="mt-4 max-w-[65ch] leading-relaxed text-ink-soft">{project.description}</p>

            <h4 className="mt-7 font-semibold">Tecnologías utilizadas</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium">
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goToContact} className="btn btn-primary">
                Solicitar un proyecto similar
              </button>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Ver proyecto
                  <ExternalLink size={18} aria-hidden="true" />
                  <span className="sr-only">(se abre en otra pestaña)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
