import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---- Service icons ---- */

export function ShoeCleanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 16h13.5c2 0 4.5.4 4.5 2v1H3z" />
      <path d="M3 16V9l4-1 2 2 3-1 2 2.5c1 1.2 2.6 2 4.2 2.2" />
      <path d="M6 19v1M10 19v1M14 19v1" />
    </svg>
  );
}

export function BagCleanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 19.5z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </svg>
  );
}

export function ShoeRepairIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17h12.5c2.2 0 4.5.3 4.5 2v1H3z" />
      <path d="M3 17v-6l3-1 5 4c1.2 1 2.8 1.6 4.4 1.7" />
      <path d="m15.5 4 4.5 4.5M18 6l-3 3" />
    </svg>
  );
}

export function BagRepairIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 19.5z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
      <path d="M9 13h6M9 13l1.5-1.5M15 13l-1.5 1.5M9 16h6M9 16l1.5-1.5M15 16l-1.5 1.5" />
    </svg>
  );
}

export function RecolorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c3.5 3.6 6 6.6 6 9.5a6 6 0 0 1-12 0C6 9.6 8.5 6.6 12 3Z" />
      <path d="M9 13a3 3 0 0 0 3 3" />
    </svg>
  );
}

export function HardwareIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  );
}

export const serviceIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  "shoe-cleaning": ShoeCleanIcon,
  "bag-cleaning": BagCleanIcon,
  "shoe-repair": ShoeRepairIcon,
  "bag-repair": BagRepairIcon,
  recolor: RecolorIcon,
  hardware: HardwareIcon,
};

/* ---- UI icons ---- */

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5c0 8.3 6.7 15 15 15 .7 0 1.3-.4 1.6-1l.9-2a1.3 1.3 0 0 0-.7-1.7l-3-1.2a1.3 1.3 0 0 0-1.5.4l-.8 1a12 12 0 0 1-4.7-4.7l1-.8a1.3 1.3 0 0 0 .4-1.5L11 4.2A1.3 1.3 0 0 0 9.3 3.5l-2 .9C6.5 4.7 6 5.3 6 6" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 3 18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6A18.5 18.5 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.3-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

/* ---- Social icons ---- */

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3.5H14A3 3 0 0 0 11 6.5v2H9V11h2v9.5h3V11h2.2l.6-2.5z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LineIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10.4C20 6.6 16.4 3.5 12 3.5S4 6.6 4 10.4c0 3.4 2.9 6.3 6.8 6.8.7.1.6.5.5 1l-.2 1.3c-.1.5.3.6.7.4 1.6-.9 5-3.2 6.3-5.4.8-1.2 1.1-2.4 1.1-3.6Z" />
      <path d="M8.5 9v3.5M8.5 9H7M11 12.5V9l2 3.5V9M16.8 9h-1.6v3.5h1.6M15.2 10.7h1.4" />
    </svg>
  );
}
