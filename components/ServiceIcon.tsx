import { Cloud, CodeXml, Compass, Headset, MonitorSmartphone, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ServiceIcon as IconName } from "@/data/services";

const icons: Record<IconName, LucideIcon> = {
  code: CodeXml,
  compass: Compass,
  devices: MonitorSmartphone,
  cloud: Cloud,
  shield: ShieldCheck,
  support: Headset,
};

export function ServiceIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
