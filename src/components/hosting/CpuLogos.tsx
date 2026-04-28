/**
 * Custom Intel & AMD inspired CPU brand marks.
 * Pure SVG, monochrome (currentColor), scales perfectly,
 * matches the dark theme by default.
 */

interface LogoProps {
  className?: string;
}

export function IntelLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Intel"
    >
      {/* Elliptical swoosh */}
      <ellipse
        cx="60"
        cy="20"
        rx="52"
        ry="15"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        opacity="0.85"
      />
      {/* Wordmark — lowercase "intel" */}
      <text
        x="60"
        y="26"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="500"
        fontSize="18"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        intel
      </text>
      {/* Trademark dot */}
      <circle cx="92" cy="11" r="1.4" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function AmdLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AMD"
    >
      {/* Wordmark — uppercase "AMD" */}
      <text
        x="8"
        y="29"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="currentColor"
        letterSpacing="1"
      >
        AMD
      </text>
      {/* Iconic angular arrow mark — geometric chevron */}
      <g transform="translate(82, 8)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path
          d="M 0 24 L 0 4 L 20 4 L 20 24 L 12 24 L 12 12 L 8 12 L 8 24 Z"
          fill="currentColor"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}
