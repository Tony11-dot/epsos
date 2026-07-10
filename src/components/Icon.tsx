import type { SVGProps } from "react";

// Compact, consistent stroke-based icon set used across site + admin.
// Single source so weights/curves stay uniform (no mixed icon libraries).
const PATHS: Record<string, React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  arrow: <path d="M14 6l-6 6 6 6" />,
  arrowLeft: <path d="M14 6l-6 6 6 6" />,
  arrowRight: <path d="M10 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12l4 4 10-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />,
  phone: <path d="M4 5c0 9 6 15 15 15l-1-4-4-1-2 2c-2-1-4-3-5-5l2-2-1-4-4-1Z" />,
  mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  pin: (
    <>
      <path d="M12 21c5-5 7-8 7-11a7 7 0 10-14 0c0 3 2 6 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  whatsapp: (
    <path d="M4 20l1.4-4A7.5 7.5 0 1120 12a7.5 7.5 0 01-11 6.7L4 20Zm5.5-9.5c.2 1 .8 2 1.7 2.9.9.9 1.9 1.5 2.9 1.7.4.1.7 0 .9-.3l.5-.7c.2-.2.1-.4-.1-.5l-1.3-.6c-.2-.1-.4 0-.5.1l-.4.4c-.6-.3-1.2-.9-1.5-1.5l.4-.4c.1-.1.2-.3.1-.5l-.6-1.3c-.1-.2-.3-.3-.5-.1l-.7.5c-.3.2-.4.5-.3.9Z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.5" cy="7.5" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8h2V5h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14v-2c0-.5.5-1 1-1Z" />,
  pen: <path d="M4 20l1-4L15 6l3 3L8 19l-4 1ZM14 7l3 3" />,
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M5 17l4.5-4 3 2.5L16 11l3 3.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19c.5-3 2.7-4.5 5.5-4.5s5 1.5 5.5 4.5" />
      <path d="M15.5 6.2A3 3 0 0118 12M17 14.6c2.2.4 3.8 1.8 4.2 4.4" />
    </>
  ),
  news: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 12h8M8 15h5" />
    </>
  ),
  book: <path d="M5 4h9a3 3 0 013 3v13H8a3 3 0 01-3-3V4ZM17 4h2v13M5 4a3 3 0 003 3h6" />,
  medal: (
    <>
      <circle cx="12" cy="14" r="5" />
      <path d="M9 9L7 3M15 9l2-6M11 13l1-1v4M10.5 16h3" />
    </>
  ),
  blocks: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 000 18c1.5 0 2-1 2-2 0-1.5 1-2 2-2h1a4 4 0 004-4c0-4.5-4-8-9-8Z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  home: <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
  logout: <path d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 12h9M16 8l4 4-4 4" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  up: <path d="M6 14l6-6 6 6" />,
  down: <path d="M6 10l6 6 6-6" />,
  contact: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M8 17c.7-2 2.2-3 4-3s3.3 1 4 3" />
    </>
  ),
  layers: <path d="M12 4l8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />,
  save: <path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 24,
  ...props
}: { name: string; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const node = PATHS[name] ?? PATHS.spark;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {node}
    </svg>
  );
}
