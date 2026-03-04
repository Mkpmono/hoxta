import { useEffect, useRef } from 'react';

/**
 * Official Trustpilot TrustBox widget embed.
 * Uses the Review Collector template with Hoxta's Business Unit ID.
 */
export function TrustpilotWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TrustBox widget when available
    if ((window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="69a8446c906325a770c6320c"
      data-style-height="52px"
      data-style-width="100%"
      data-token="cda27eed-b9f5-4b48-a518-fa455287f13c"
    >
      <a href="https://www.trustpilot.com/review/hoxta.com" target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
