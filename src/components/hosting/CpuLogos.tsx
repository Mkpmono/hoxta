/**
 * Intel & AMD inspired CPU brand marks.
 * Monochrome (currentColor) — themeable, crisp at any size.
 */

interface LogoProps {
  className?: string;
}

/**
 * Intel-style mark: lowercase wordmark with the signature
 * dotted "i", angled "e", and the surrounding thin ellipse swoosh.
 */
export function IntelLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Intel"
    >
      {/* Thin elliptical swoosh */}
      <ellipse
        cx="100"
        cy="35"
        rx="92"
        ry="26"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.9"
      />

      {/* Wordmark "intel" — built from geometric paths */}
      <g fill="currentColor">
        {/* i — dot + stem */}
        <circle cx="48" cy="22" r="3.2" />
        <rect x="44.8" y="30" width="6.4" height="22" />

        {/* n */}
        <path d="M58 52 V30 h6.2 v3.4 c1.6-2.6 4.2-4 7.6-4 5.6 0 9 3.6 9 9.4 V52 h-6.4 V40 c0-3.4-1.7-5.2-4.6-5.2-3 0-5.4 2-5.4 5.6 V52 Z" />

        {/* t */}
        <path d="M88 30 h4 v-7 h6.4 v7 h5.4 v5 h-5.4 v9.4 c0 2.4 1.1 3.4 3.2 3.4 0.9 0 1.6-.1 2.4-.3 v5.2 c-1.2 .3-2.6 .5-4.4 .5-5.4 0-7.6-2.6-7.6-7.7 V35 H88 Z" />

        {/* e — with the signature flat right edge */}
        <path d="M108 41.2 c0-7 4.8-11.8 11.6-11.8 7.2 0 11.4 4.8 11.4 12 v1.7 H114.3 c.4 3.7 2.7 5.8 6 5.8 2.4 0 4.2-.9 5.2-2.7 h6.6 c-1.4 4.6-5.7 7.5-11.8 7.5-7.4 0-12.3-4.7-12.3-12.5 Z M114.4 39 h10.7 c-.5-3.3-2.5-5-5.3-5-2.9 0-4.9 1.7-5.4 5 Z" />

        {/* l */}
        <rect x="138" y="20" width="6.4" height="32" />
      </g>
    </svg>
  );
}

/**
 * AMD-style mark: bold italic wordmark with the iconic
 * double-arrow / chevron treatment.
 */
export function AmdLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AMD"
    >
      <g fill="currentColor">
        {/* Iconic AMD arrow / chevron block (left side) */}
        <path
          d="M8 14 L36 14 L36 56 L28 56 L28 28 L18 28 L18 56 L8 56 Z"
          opacity="0.95"
        />
        <path
          d="M44 14 L72 14 L72 56 L64 56 L64 28 L54 28 L54 56 L44 56 Z"
          opacity="0.55"
        />

        {/* Wordmark "AMD" — bold, slightly italic */}
        <g transform="skewX(-8)">
          {/* A */}
          <path d="M92 56 L102 16 H113 L123 56 H115.5 L113.6 47.5 H101.4 L99.5 56 Z M102.7 41.7 H112.3 L107.5 22.5 Z" />
          {/* M */}
          <path d="M128 56 V16 H139 L147 42 L155 16 H166 V56 H158.6 V27 L150.4 56 H143.6 L135.4 27 V56 Z" />
          {/* D */}
          <path d="M173 56 V16 H187.5 c10.4 0 16.5 7 16.5 19.8 0 13.4-6 20.2-16.6 20.2 Z M180.8 49.6 H187 c6 0 9.2-4.6 9.2-13.7 0-9-3.2-13.5-9.1-13.5 H180.8 Z" />
        </g>
      </g>
    </svg>
  );
}
