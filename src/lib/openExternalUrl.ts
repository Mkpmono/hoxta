function isDiscordInviteUrl(url: string) {
  return /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\//i.test(url);
}

function isRestrictedPreviewContext() {
  const hostname = window.location.hostname;

  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  return hostname === "localhost" || hostname.endsWith(".lovableproject.com");
}

export function openExternalUrl(url: string) {
  if (!url) return;

  if (isDiscordInviteUrl(url) && isRestrictedPreviewContext()) {
    navigator.clipboard?.writeText(url).catch(() => undefined);
    window.prompt(
      "Discord nu poate fi deschis direct din preview. Copiază și deschide manual acest link într-un tab normal:",
      url,
    );
    return;
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");

  if (popup) {
    popup.opener = null;
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.click();
}
