import { site } from "@/lib/site";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? "#ffffff" : "#0f1a33";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 22 H16 V10 H25" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="22" r="3.6" fill="#2346d1" />
        <circle cx="25" cy="10" r="3.6" fill="#0e9f7e" />
      </svg>
      <span className={`heading text-lg ${inverted ? "text-white" : "text-ink"}`}>{site.name}</span>
    </span>
  );
}
