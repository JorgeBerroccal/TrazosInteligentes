export type ServiceIcon = "code" | "compass" | "devices" | "cloud" | "shield" | "support";

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  order: number;
};

/** Contenido de ejemplo: edítalo libremente. */
const allServices: Service[] = [
  {
    id: "software-a-medida",
    title: "Desarrollo de software a medida",
    description:
      "Sistemas internos, ERP ligeros y automatizaciones construidos sobre los procesos reales de tu empresa, no al revés.",
    icon: "code",
    order: 1,
  },
  {
    id: "consultoria",
    title: "Consultoría tecnológica",
    description:
      "Evaluamos tu infraestructura y tus sistemas actuales y te entregamos un plan priorizado, con costos y plazos claros.",
    icon: "compass",
    order: 2,
  },
  {
    id: "web-movil",
    title: "Desarrollo web y móvil",
    description:
      "Sitios, portales de clientes y apps para iOS y Android, rápidos, accesibles y fáciles de mantener.",
    icon: "devices",
    order: 3,
  },
  {
    id: "cloud-devops",
    title: "Cloud y DevOps",
    description:
      "Migramos tus aplicaciones a la nube y automatizamos despliegues, copias de seguridad y monitoreo.",
    icon: "cloud",
    order: 4,
  },
  {
    id: "ciberseguridad",
    title: "Ciberseguridad",
    description:
      "Auditorías, pruebas de intrusión y políticas de acceso para proteger los datos de tu empresa y de tus clientes.",
    icon: "shield",
    order: 5,
  },
  {
    id: "soporte",
    title: "Soporte técnico",
    description:
      "Mesa de ayuda y mantenimiento preventivo para que tu equipo siga trabajando cuando algo falla.",
    icon: "support",
    order: 6,
  },
];

/** Regla de negocio: se muestran como máximo 6 servicios, ordenados por `order`. */
export const MAX_SERVICES = 6;

export const services: Service[] = [...allServices]
  .sort((a, b) => a.order - b.order)
  .slice(0, MAX_SERVICES);
