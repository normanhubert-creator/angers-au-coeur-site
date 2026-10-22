(() => {
  'use strict';
  const url = 'https://www.angersaucoeur.org/reflexion-immobilier-habitat-angers.html';
  const title = 'Immobilier et habitat : quel avenir pour Angers ?';
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
