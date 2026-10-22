(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-pole-tab]')];
  const panels = [...document.querySelectorAll('[data-pole-panel]')];
  if (!tabs.length) return;
  panels.forEach(panel => { panel.id = 'pole-' + panel.dataset.polePanel; });
  const requested = new URLSearchParams(location.search).get('pole');
  if (!/^(?:[1-9]|10)$/.test(requested || '')) return;
  const tab = tabs.find(node => node.dataset.poleTab === requested);
  if (!tab) return;
  tabs.forEach(node => node.classList.toggle('active', node === tab));
  panels.forEach(node => node.classList.toggle('active', node.dataset.polePanel === requested));
  const panel = panels.find(node => node.dataset.polePanel === requested);
  if (location.hash === '#pole-' + requested) panel.scrollIntoView({block:'start', behavior:'instant'});
})();
