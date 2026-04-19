function isDiscordInviteUrl(url: string) {
  return /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\//i.test(url);
}

function isEmbeddedContext() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function openDiscordPreviewFallback(url: string) {
  navigator.clipboard?.writeText(url).catch(() => undefined);

  const safeUrl = escapeHtml(url);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Open Discord</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #08131f; color: #eef5ff; display: grid; place-items: center; min-height: 100vh; }
    .card { width: min(560px, calc(100vw - 32px)); background: #0d1b2a; border: 1px solid rgba(53, 194, 255, 0.24); border-radius: 20px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    h1 { margin: 0 0 12px; font-size: 28px; }
    p { margin: 0 0 14px; color: #b8c5d6; line-height: 1.55; }
    input { width: 100%; box-sizing: border-box; margin: 10px 0 14px; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,.16); background: #07101a; color: #eef5ff; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
    button, a { appearance: none; border: 0; border-radius: 12px; padding: 12px 16px; font-weight: 600; text-decoration: none; cursor: pointer; }
    .primary { background: #23b6eb; color: #041018; }
    .secondary { background: transparent; color: #eef5ff; border: 1px solid rgba(255,255,255,.16); }
    .note { margin-top: 14px; font-size: 14px; color: #8ea2bb; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Open Discord invite</h1>
    <p>Discord blocks links opened from embedded previews. I copied the invite link below so you can paste it directly in your browser if needed.</p>
    <input value="${safeUrl}" readonly onclick="this.select()" />
    <div class="actions">
      <button class="primary" onclick="navigator.clipboard.writeText('${safeUrl}').then(() => alert('Invite link copied'))">Copy invite link</button>
      <a class="secondary" href="${safeUrl}">Try open here</a>
    </div>
    <p class="note">On the published site, the Discord link should open normally outside the preview sandbox.</p>
  </div>
</body>
</html>`;

  const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const popup = window.open(blobUrl, "_blank", "noopener,noreferrer");

  if (popup) {
    popup.opener = null;
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    return;
  }

  URL.revokeObjectURL(blobUrl);
  window.prompt("Copy this Discord invite link", url);
}

export function openExternalUrl(url: string) {
  if (!url) return;

  if (isDiscordInviteUrl(url) && isEmbeddedContext()) {
    openDiscordPreviewFallback(url);
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

