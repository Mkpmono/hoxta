const CHATWOOT_OPEN_SELECTOR = [
  'button[title="Open chat window"]',
  'button[aria-label="Open chat window"]',
  ".woot-widget-bubble",
  ".woot--bubble-holder",
].join(", ");

type LiveChatWindow = Window & typeof globalThis & {
  Tawk_API?: { maximize?: () => void };
  $crisp?: unknown[];
  tidioChatApi?: { open?: () => void };
  $chatwoot?: { toggle?: (state?: "open" | "close") => void; popoutChatWindow?: () => void };
  Intercom?: (command: string) => void;
  __hoxtaPendingChatwootOpen?: boolean;
};

export function isChatwootScript(script: string) {
  return /chatwootSDK\.run|\/packs\/js\/sdk\.js|\$chatwoot/i.test(script);
}

function normalizeChatwootBaseUrl(baseUrl: string) {
  const compact = baseUrl.trim();
  const duplicateUrlMatch = compact.match(/^(https?:\/\/.*?)(https?:\/\/.*)$/i);
  const withoutDuplicate = duplicateUrlMatch ? duplicateUrlMatch[1] : compact;
  const localRuntimeMatch = withoutDuplicate.match(/^(https?:\/\/.*?)(?:https?:\/\/(?:0\.0\.0\.0|127\.0\.0\.1|localhost)(?::\d+)?.*)$/i);
  const cleanUrl = localRuntimeMatch ? localRuntimeMatch[1] : withoutDuplicate;
  return cleanUrl.replace(/\/+$/, "");
}

export function normalizeLiveChatScript(script: string) {
  const trimmed = script.trim();
  if (!trimmed || !isChatwootScript(trimmed)) return trimmed;

  return trimmed.replace(/(var\s+BASE_URL\s*=\s*["'])([^"']+)(["'])/i, (_full, start, value, end) => {
    return `${start}${normalizeChatwootBaseUrl(value)}${end}`;
  });
}

function clickChatwootBubble() {
  const trigger = document.querySelector<HTMLElement>(CHATWOOT_OPEN_SELECTOR);
  if (!trigger) return false;
  trigger.click();
  return true;
}

export function openEmbeddedLiveChat(script: string) {
  const w = window as LiveChatWindow;

  if (w.Tawk_API?.maximize) {
    w.Tawk_API.maximize();
    return true;
  }

  if (Array.isArray(w.$crisp)) {
    w.$crisp.push(["do", "chat:open"]);
    return true;
  }

  if (w.tidioChatApi?.open) {
    w.tidioChatApi.open();
    return true;
  }

  if (w.$chatwoot?.toggle) {
    w.$chatwoot.toggle("open");
    return true;
  }

  if (clickChatwootBubble()) return true;

  if (w.Intercom) {
    w.Intercom("show");
    return true;
  }

  if (isChatwootScript(script)) {
    w.__hoxtaPendingChatwootOpen = true;
    window.dispatchEvent(new CustomEvent("hoxta:open-live-chat"));
  }

  return false;
}