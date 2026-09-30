/**
 * Diagrama de arquitectura del hero. Se dibuja una sola vez al cargar
 * (y no se anima si el usuario prefiere movimiento reducido).
 * Tiene dos disposiciones: horizontal (tablet/escritorio) y vertical (móvil).
 */
type NodeId = "equipo" | "web" | "movil" | "api" | "nube" | "datos";
type Point = { x: number; y: number; w: number };
type Layout = {
  viewBox: string;
  nodes: Record<NodeId, Point>;
  lines: { d: string; delay: number }[];
  zone: { x: number; y: number; w: number; h: number; labelX: number; labelY: number };
};

const H = 46;

const nodeMeta: Record<NodeId, { label: string; delay: number; tone?: "cobalt" | "signal" }> = {
  equipo: { label: "Tu equipo", delay: 0.1 },
  web: { label: "App web", delay: 0.8 },
  movil: { label: "App móvil", delay: 0.85 },
  api: { label: "API", delay: 1.4, tone: "cobalt" },
  nube: { label: "Nube", delay: 2.0 },
  datos: { label: "Base de datos", delay: 2.05, tone: "signal" },
};

const horizontal: Layout = {
  viewBox: "0 0 600 420",
  nodes: {
    equipo: { x: 66, y: 220, w: 112 },
    web: { x: 212, y: 120, w: 112 },
    movil: { x: 212, y: 320, w: 112 },
    api: { x: 360, y: 220, w: 112 },
    nube: { x: 516, y: 130, w: 132 },
    datos: { x: 516, y: 310, w: 132 },
  },
  lines: [
    { d: "M122 220 H139 V120 H156", delay: 0.35 },
    { d: "M122 220 H139 V320 H156", delay: 0.35 },
    { d: "M268 120 H282 V220 H304", delay: 1.0 },
    { d: "M268 320 H282 V220 H304", delay: 1.0 },
    { d: "M416 220 H433 V130 H450", delay: 1.6 },
    { d: "M416 220 H433 V310 H450", delay: 1.6 },
  ],
  zone: { x: 290, y: 72, w: 304, h: 300, labelX: 306, labelY: 98 },
};

const vertical: Layout = {
  viewBox: "0 0 340 440",
  nodes: {
    equipo: { x: 170, y: 32, w: 130 },
    web: { x: 90, y: 130, w: 136 },
    movil: { x: 250, y: 130, w: 136 },
    api: { x: 170, y: 240, w: 130 },
    nube: { x: 90, y: 350, w: 136 },
    datos: { x: 250, y: 350, w: 136 },
  },
  lines: [
    { d: "M170 55 V80 H90 V107", delay: 0.35 },
    { d: "M170 55 V80 H250 V107", delay: 0.35 },
    { d: "M90 153 V185 H170 V217", delay: 1.0 },
    { d: "M250 153 V185 H170 V217", delay: 1.0 },
    { d: "M170 263 V295 H90 V327", delay: 1.6 },
    { d: "M170 263 V295 H250 V327", delay: 1.6 },
  ],
  zone: { x: 10, y: 200, w: 320, h: 232, labelX: 24, labelY: 420 },
};

function Diagram({ layout, className }: { layout: Layout; className: string }) {
  const { zone } = layout;
  return (
    <svg
      viewBox={layout.viewBox}
      className={className}
      role="img"
      aria-label="Diagrama: tu equipo usa una app web y una app móvil que se conectan a una API, a la nube y a la base de datos, dentro de un entorno protegido."
    >
      <g className="diagram-node" style={{ animationDelay: "1.5s" }}>
        <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="16" fill="rgb(35 70 209 / 0.04)" stroke="#2346d1" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x={zone.labelX} y={zone.labelY} fill="#2346d1" fontSize="13" fontWeight="600">
          Entorno protegido
        </text>
      </g>

      {layout.lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          pathLength={1}
          className="diagram-line"
          style={{ animationDelay: `${l.delay}s` }}
          fill="none"
          stroke="#0f1a33"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      ))}

      {(Object.keys(layout.nodes) as NodeId[]).map((id) => {
        const { x, y, w } = layout.nodes[id];
        const { label, delay, tone } = nodeMeta[id];
        const fill = tone === "cobalt" ? "#2346d1" : "#ffffff";
        const text = tone === "cobalt" ? "#ffffff" : "#0f1a33";
        const stroke = tone === "cobalt" ? "#2346d1" : tone === "signal" ? "#0e9f7e" : "#0f1a33";
        return (
          <g key={id} className="diagram-node" style={{ animationDelay: `${delay}s` }}>
            <rect x={x - w / 2} y={y - H / 2} width={w} height={H} rx="10" fill={fill} stroke={stroke} strokeWidth="1.75" />
            <circle cx={x - w / 2 + 16} cy={y} r="4" fill={tone === "cobalt" ? "#ffffff" : "#0e9f7e"} />
            <text x={x - w / 2 + 28} y={y + 4.5} fill={text} fontSize="13.5" fontWeight="600">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HeroDiagram() {
  return (
    <>
      <Diagram layout={horizontal} className="hidden h-auto w-full sm:block" />
      <Diagram layout={vertical} className="mx-auto h-auto w-full max-w-[22rem] sm:hidden" />
    </>
  );
}
