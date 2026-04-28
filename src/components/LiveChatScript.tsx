import { useEffect } from "react";
import { useSupportSettings } from "@/hooks/useSupportSettings";
import { isChatwootScript, normalizeLiveChatScript } from "@/lib/liveChat";

/**
 * Injects the user-defined live chat embed script (Tawk.to, Crisp, Tidio, Chatwoot, etc.)
 * Only runs when live_chat_enabled = true and a script is configured.
 */
export function LiveChatScript() {
  const { data } = useSupportSettings();
  const script = normalizeLiveChatScript(data?.live_chat_embed_script?.trim() || "");
  const enabled = !!data?.live_chat_enabled && script.length > 0;

  useEffect(() => {
    if (!enabled) return;
    const chatwoot = isChatwootScript(script);
    const container = document.createElement("div");
    container.id = "live-chat-embed-container";
    let bubbleStyle: HTMLStyleElement | null = null;
    // Parse and re-create script tags so they actually execute
    const tmp = document.createElement("div");
    tmp.innerHTML = script;
    const nodes: Node[] = [];
    tmp.childNodes.forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const s = document.createElement("script");
        for (const attr of Array.from(old.attributes)) s.setAttribute(attr.name, attr.value);
        s.text = old.text;
        nodes.push(s);
      } else {
        nodes.push(node.cloneNode(true));
      }
    });
    nodes.forEach((n) => container.appendChild(n));
    document.body.appendChild(container);

    // Always hide the provider's default floating bubble — we expose our own FAB.
    bubbleStyle = document.createElement("style");
    bubbleStyle.id = "live-chat-bubble-hide-style";
    bubbleStyle.textContent = `
      /* Chatwoot */
      .woot-widget-bubble,
      .woot--bubble-holder,
      button[title="Open chat window"],
      button[aria-label="Open chat window"],
      /* Tawk.to */
      iframe[title*="chat" i][src*="tawk.to"],
      #tawkchat-container,
      .widget-visible iframe[src*="tawk.to"],
      /* Crisp */
      .crisp-client .cc-1brb6,
      #crisp-chatbox > div > a[aria-label*="chat" i],
      /* Tidio */
      #tidio-chat,
      #tidio-chat-iframe,
      /* Intercom */
      .intercom-lightweight-app-launcher,
      .intercom-launcher,
      .intercom-launcher-frame,
      /* LiveChat */
      #chat-widget-container,
      #livechat-compact-container,
      #livechat-eye-catcher,
      /* ChatWave / generic embed bubble */
      button[aria-label="Open chat" i],
      button[aria-label="Open chat window" i] {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(bubbleStyle);

    const onOpenLiveChat = () => {
      const w = window as Window & typeof globalThis & {
        $chatwoot?: {
          toggle?: (state?: "open" | "close") => void;
          toggleBubbleVisibility?: (state?: "hide" | "show") => void;
        };
        __hoxtaPendingChatwootOpen?: boolean;
      };

      if (w.$chatwoot?.toggle) {
        w.$chatwoot.toggleBubbleVisibility?.("hide");
        w.$chatwoot.toggle("open");
        w.__hoxtaPendingChatwootOpen = false;
      }
    };

    const onChatwootReady = () => {
      const w = window as Window & typeof globalThis & {
        $chatwoot?: { toggleBubbleVisibility?: (state?: "hide" | "show") => void };
        __hoxtaPendingChatwootOpen?: boolean;
      };
      w.$chatwoot?.toggleBubbleVisibility?.("hide");
      if (w.__hoxtaPendingChatwootOpen) onOpenLiveChat();
    };

    if (chatwoot) {
      window.addEventListener("hoxta:open-live-chat", onOpenLiveChat);
      window.addEventListener("chatwoot:ready", onChatwootReady);
    }

    return () => {
      if (chatwoot) {
        window.removeEventListener("hoxta:open-live-chat", onOpenLiveChat);
        window.removeEventListener("chatwoot:ready", onChatwootReady);
      }
      bubbleStyle?.remove();
      container.remove();
    };
  }, [enabled, script]);

  return null;
}
