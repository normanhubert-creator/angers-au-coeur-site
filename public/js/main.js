
const menuBtn = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if(menuBtn && nav) menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));

const ideas = [
  {
    status:"En cours d'étude",
    title:"Simplifier certaines démarches administratives locales",
    text:"Une contribution pourrait proposer d'alléger certaines formalités pour les habitants et les petites entreprises.",
    meta:"Exemple de démonstration · contribution non officielle"
  },
  {
    status:"À qualifier",
    title:"Mieux relier les horaires de transport et d'emploi",
    text:"Une contribution pourrait documenter les difficultés rencontrées par les salariés en horaires décalés.",
    meta:"Exemple de démonstration · contribution non officielle"
  },
  {
    status:"En analyse",
    title:"Mieux expliquer le fonctionnement des institutions",
    text:"Une contribution pourrait suggérer de nouveaux formats pédagogiques simples et accessibles.",
    meta:"Exemple de démonstration · contribution non officielle"
  }
];
let ideaIndex=0;
function renderIdea(){
  const card=document.querySelector('[data-idea-card]');
  if(!card)return;
  const x=ideas[ideaIndex];
  card.querySelector('[data-status]').textContent=x.status;
  card.querySelector('[data-title]').textContent=x.title;
  card.querySelector('[data-text]').textContent=x.text;
  card.querySelector('[data-meta]').textContent=x.meta;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===ideaIndex));
}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{ideaIndex=(ideaIndex+1)%ideas.length;renderIdea()}));
document.querySelectorAll('[data-prev]').forEach(b=>b.addEventListener('click',()=>{ideaIndex=(ideaIndex-1+ideas.length)%ideas.length;renderIdea()}));
document.querySelectorAll('.dot').forEach((d,i)=>d.addEventListener('click',()=>{ideaIndex=i;renderIdea()}));
renderIdea();

document.querySelectorAll('[data-demo]').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault();
  alert("Fonction prévue mais non connectée dans cette maquette.");
}));

const poleTabs=document.querySelectorAll('[data-pole-tab]');
const polePanels=document.querySelectorAll('[data-pole-panel]');
if(poleTabs.length){
  poleTabs.forEach(tab=>tab.addEventListener('click',()=>{
    const id=tab.getAttribute('data-pole-tab');
    poleTabs.forEach(t=>t.classList.toggle('active',t===tab));
    polePanels.forEach(p=>p.classList.toggle('active',p.getAttribute('data-pole-panel')===id));
    const panel=document.querySelector('[data-pole-panel="'+id+'"]');
    if(panel) panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }));
}
