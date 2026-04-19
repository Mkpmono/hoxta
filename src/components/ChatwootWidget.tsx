import { useEffect } from "react";

const CHATWOOT_BASE_URL = "https://chat.hoxta.com";
const CHATWOOT_WEBSITE_TOKEN = "trhqpQU1vSXLvoQWDg1KBGDV";

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
      setUser: (
        identifier: string,
        user: { name?: string; email?: string; avatar_url?: string; identifier_hash?: string }
      ) => void;
      reset: () => void;
      toggleBubbleVisibility: (visibility: "show" | "hide") => void;
    };
    chatwootSettings?: {
      hideMessageBubble?: boolean;
      position?: "left" | "right";
      locale?: string;
      type?: "standard" | "expanded_bubble";
      darkMode?: "light" | "dark" | "auto";
    };
  }
}

/**
 * Loads the Chatwoot self-hosted widget.
 * The native FAB is hidden — we open it programmatically from LiveChatButton.
 */
export function ChatwootWidget() {
  useEffect(() => {
    if (document.getElementById("chatwoot-sdk")) return;

    // Hide the default Chatwoot bubble — we use our own button
    window.chatwootSettings = {
      hideMessageBubble: true,
      position: "right",
      locale: "en",
      type: "standard",
      darkMode: "dark", // forțat dark ca să se asorteze cu tema site-ului
    };

    const script = document.createElement("script");
    script.id = "chatwoot-sdk";
    script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: CHATWOOT_WEBSITE_TOKEN,
        baseUrl: CHATWOOT_BASE_URL,
      });
    };
    document.head.appendChild(script);
  }, []);

  return null;
}

/** Programmatically open the Chatwoot panel. Returns true if available. */
export function openChatwoot(): boolean {
  if (typeof window === "undefined" || !window.$chatwoot) return false;
  window.$chatwoot.toggle("open");
  return true;
}
