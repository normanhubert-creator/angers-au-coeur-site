(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.get('sujet') !== 'immobilier-habitat') return;
  const form = document.getElementById('public-contribution-form');
  const context = document.getElementById('contribution-context');
  if (!form || !context) return;
  const labels = new Map([
    ['centre-ville', 'Centre-ville et commerces'],
    ['location', 'Marché locatif'],
    ['etudiants', 'Logement étudiant'],
    ['logement-social', 'Logement social'],
    ['ville-demain', 'La ville dans vingt ans'],
    ['accession', 'Accession à la propriété']
  ]);
  const angle = labels.get(params.get('angle'));
  const title = 'Immobilier et habitat à Angers' + (angle ? ' : ' + angle : '');
  if (!form.elements.titre.value) form.elements.titre.value = title;
  if (!form.elements.pole_suggere_code.value) form.elements.pole_suggere_code.value = 'LOGEMENT_MOBILITES_TERRITOIRES';
  context.querySelector('[data-context-title]').textContent = title;
  context.hidden = false;
})();
