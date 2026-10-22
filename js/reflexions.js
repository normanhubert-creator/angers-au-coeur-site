(() => {
  'use strict';
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const allowed = new Set([
    'https://www.angersaucoeur.org/reflexion-immobilier-habitat-angers.html',
    'https://www.angersaucoeur.org/reflexion-ia-numerique-angers.html'
  ]);
  if (!allowed.has(canonical)) return;
  const url = canonical;
  const title = document.querySelector('meta[property="og:title"]')?.content || 'Les réflexions des pôles · Angers au Cœur';
  const status = document.querySelector('[data-debate-share-status]');
  const copy = document.querySelector('[data-copy-debate]');
  const share = document.querySelector('[data-share-debate]');
  if (copy && navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); status.textContent = 'Lien du dossier copié.'; }
      catch { status.textContent = 'Copiez le lien du dossier affiché ci-dessus.'; }
    });
  }
  if (share && navigator.share) {
    share.hidden = false;
    share.addEventListener('click', async () => {
      try { await navigator.share({title, text: 'Six questions pour ouvrir le débat avec Angers au Cœur.', url}); }
      catch (error) { if (error.name !== 'AbortError') status.textContent = 'Vous pouvez partager le lien affiché ci-dessous.'; }
    });
  }
})();
