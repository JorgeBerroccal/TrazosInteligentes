/**
 * Datos de contacto de la empresa.
 * Es la ÚNICA fuente de verdad: el header, el formulario, el footer y el botón
 * flotante leen de aquí, así los datos siempre son consistentes.
 * Reemplázalos por los datos reales antes de publicar.
 */
export const site = {
  name: "Trazos Inteligentes",
  tagline: "Desarrollo de software, nube y soporte para empresas.",
  email: "contacto@trazointeligentes.com",
  phone: "+51 967743345",
  phoneHref: "tel:+51967743345",
  // Número de WhatsApp en formato internacional, solo dígitos (sin +, espacios ni guiones)
  whatsapp: "51967743345",
  whatsappMessage: "Hola, me gustaría solicitar una cotización.",
  address: "Av. Cusco 123, Oficina 402",
  hours: "Lunes a viernes, 9:00 a 18:00",
  responseTime: "Respondemos en menos de 24 horas hábiles.",
} as const;

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`;
