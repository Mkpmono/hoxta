import { useEffect } from "react";
import { useSupportSettings } from "@/hooks/useSupportSettings";

/**
 * Injects the user-defined live chat embed script (Tawk.to, Crisp, Tidio, Chatwoot, etc.)
 * Only runs when live_chat_enabled = true and a script is configured.
 */
export function LiveChatScript() {
  const { data } = useSupportSettings();
  const script = data?.live_chat_embed_script?.trim() || "";
  const enabled = !!data?.live_chat_enabled && script.length > 0;

  useEffect(() => {
    if (!enabled) return;
    const container = document.createElement("div");
    container.id = "live-chat-embed-container";
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
    return () => {
      container.remove();
    };
  }, [enabled, script]);

  return null;
}
