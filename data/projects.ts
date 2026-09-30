export type Project = {
  id: string;
  title: string;
  description: string;
  summary: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
  featured: boolean;
};

/**
 * Contenido de ejemplo: proyectos ficticios.
 * Las imágenes viven en /public/images (WebP, menos de 500 KB cada una).
 */
const allProjects: Project[] = [
  {
    id: "inventario-distribuidora",
    title: "Control de inventario para una distribuidora",
    summary: "Stock en tiempo real para 3 almacenes y 40 vendedores.",
    description:
      "La distribuidora llevaba su inventario en hojas de cálculo separadas por almacén. Construimos un sistema web que centraliza el stock, registra entradas y salidas con lector de código de barras y alerta cuando un producto baja del mínimo. Los pedidos sin stock bajaron de forma notable durante el primer trimestre.",
    image: "/images/proyecto-inventario.webp",
    category: "Software a medida",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Docker"],
    link: "https://example.com",
    featured: true,
  },
  {
    id: "app-pedidos",
    title: "App de pedidos para una cadena de restaurantes",
    summary: "Pedidos para recoger y seguimiento en vivo desde el celular.",
    description:
      "Una app para iOS y Android en la que los clientes arman su pedido, pagan en caja al recoger y ven en qué etapa está su orden. Cocina recibe los pedidos en una pantalla dedicada.",
    image: "/images/proyecto-pedidos.webp",
    category: "Web y móvil",
    technologies: ["React Native", "Node.js", "Firebase"],
    featured: true,
  },
  {
    id: "migracion-erp",
    title: "Migración a la nube de un ERP",
    summary: "De un servidor local a una nube con copias automáticas.",
    description:
      "Trasladamos el ERP de una empresa de manufactura de un servidor físico en su oficina a la nube. Configuramos despliegues automáticos, copias de seguridad diarias y monitoreo con alertas, sin detener la operación.",
    image: "/images/proyecto-nube.webp",
    category: "Cloud y DevOps",
    technologies: ["AWS", "Terraform", "Docker", "GitHub Actions"],
    featured: true,
  },
  {
    id: "portal-clientes",
    title: "Portal de clientes para una aseguradora",
    summary: "Pólizas, pagos y trámites en un solo lugar.",
    description:
      "Un portal donde los asegurados consultan sus pólizas, descargan documentos y abren trámites sin llamar a la central. Incluye inicio de sesión seguro y un panel para el equipo de atención.",
    image: "/images/proyecto-portal.webp",
    category: "Web y móvil",
    technologies: ["React", "NestJS", "PostgreSQL", "Keycloak"],
    featured: true,
  },
  {
    id: "auditoria-fintech",
    title: "Auditoría de seguridad para una fintech",
    summary: "Pruebas de intrusión y plan de corrección priorizado.",
    description:
      "Revisamos la aplicación web y la API de una fintech antes de su lanzamiento. Entregamos un informe con cada hallazgo clasificado por riesgo y acompañamos al equipo mientras corregía los puntos críticos.",
    image: "/images/proyecto-seguridad.webp",
    category: "Ciberseguridad",
    technologies: ["OWASP ZAP", "Burp Suite", "Nmap"],
    featured: true,
  },
];

/** Regla de negocio: el portafolio muestra como máximo 5 proyectos destacados. */
export const MAX_PROJECTS = 5;

export const projects: Project[] = allProjects.filter((p) => p.featured).slice(0, MAX_PROJECTS);

export const projectCategories: string[] = Array.from(new Set(projects.map((p) => p.category)));
