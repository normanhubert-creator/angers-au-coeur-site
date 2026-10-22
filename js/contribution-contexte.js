(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const subjects = new Map([
    ['immobilier-habitat', {
      title: 'Immobilier et habitat à Angers', pole: 'LOGEMENT_MOBILITES_TERRITOIRES', number: '07',
      page: 'reflexion-immobilier-habitat-angers.html',
      angles: new Map([['centre-ville','Centre-ville et commerces'],['location','Marché locatif'],['etudiants','Logement étudiant'],['logement-social','Logement social'],['ville-demain','La ville dans vingt ans'],['accession','Accession à la propriété']])
    }],
    ['ia-numerique', {
      title: 'IA et numérique à Angers', pole: 'SCIENCE_NUMERIQUE_IA', number: '09',
      page: 'reflexion-ia-numerique-angers.html',
      angles: new Map([['services-publics','Services publics'],['travail','Travail et entreprises'],['formation','Formation et jeunesse'],['inclusion','Inclusion numérique'],['donnees','Données et responsabilité'],['evaluation','Utilité et sobriété']])
    }]
  ]);
  const subject = subjects.get(params.get('sujet'));
  if (!subject) return;
  const form = document.getElementById('public-contribution-form');
  const context = document.getElementById('contribution-context');
  if (!form || !context) return;
  const angle = subject.angles.get(params.get('angle'));
  const title = subject.title + (angle ? ' : ' + angle : '');
  if (!form.elements.titre.value) form.elements.titre.value = title;
  if (!form.elements.pole_suggere_code.value) form.elements.pole_suggere_code.value = subject.pole;
  context.querySelector('[data-context-title]').textContent = title;
  context.querySelector('[data-context-pole]').textContent = 'En lien avec une réflexion du pôle ' + subject.number;
  context.querySelector('[data-context-return]').href = subject.page;
  context.hidden = false;
})();
