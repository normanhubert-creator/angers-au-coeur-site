
const menuBtn = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if(menuBtn && nav) menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));

// Vidéo(s) à la une : vignette = première image réelle de la vidéo (miniature Drive), lecteur
// chargé seulement au clic (pas d'iframe ni de vidéo au chargement de la page).
document.querySelectorAll('.video-box[data-video-id]').forEach(videoBox=>{
  const id=videoBox.getAttribute('data-video-id');
  videoBox.style.backgroundImage='linear-gradient(0deg,rgba(4,18,34,.72),rgba(4,18,34,.08)), url(https://drive.google.com/thumbnail?id='+id+'&sz=w1000)';
  videoBox.style.backgroundSize='cover';
  videoBox.style.backgroundPosition='center';
  videoBox.addEventListener('click',()=>{
    const iframe=document.createElement('iframe');
    iframe.src='https://drive.google.com/file/d/'+id+'/preview';
    iframe.setAttribute('allow','autoplay; fullscreen');
    iframe.allowFullscreen=true;
    iframe.loading='lazy';
    iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';
    videoBox.replaceChildren(iframe);
  },{once:true});
});

const demoIdeas = [
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
let ideas=demoIdeas;
let ideaIndex=0;
function rebuildDots(){
  const wrap=document.querySelector('.idea-controls .dots');
  if(!wrap)return;
  wrap.replaceChildren();
  ideas.forEach((_,i)=>{
    const dot=document.createElement('button');
    dot.className='dot'+(i===0?' active':'');
    dot.addEventListener('click',()=>{ideaIndex=i;renderIdea();});
    wrap.append(dot);
  });
}
function renderIdea(){
  const card=document.querySelector('[data-idea-card]');
  if(!card||!ideas.length)return;
  const x=ideas[ideaIndex];
  card.querySelector('[data-status]').textContent=x.status||'';
  card.querySelector('[data-title]').textContent=x.title||'';
  card.querySelector('[data-text]').textContent=x.text||'';
  card.querySelector('[data-meta]').textContent=x.meta||'';
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===ideaIndex));
}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{ideaIndex=(ideaIndex+1)%ideas.length;renderIdea()}));
document.querySelectorAll('[data-prev]').forEach(b=>b.addEventListener('click',()=>{ideaIndex=(ideaIndex-1+ideas.length)%ideas.length;renderIdea()}));
renderIdea();
rebuildDots();
// Idées réelles publiées par le Vice-Président depuis l'espace adhérent, si disponibles — sinon
// les exemples de démonstration ci-dessus restent affichés (comportement inchangé par défaut).
fetch('data/public-ideas.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
  if(!data||!Array.isArray(data.items)||!data.items.length)return;
  ideas=data.items.map(item=>({
    status:item.pole_nom||'',
    title:item.titre||'',
    text:item.extrait||'',
    meta:item.date?('Idée du pôle « '+(item.pole_nom||'')+' » · '+item.date):('Idée du pôle « '+(item.pole_nom||'')+' »')
  }));
  ideaIndex=0;
  var note=document.querySelector('.idea-note');
  if(note)note.textContent='Idées publiées par le mouvement, sélectionnées par le Vice-Président.';
  renderIdea();
  rebuildDots();
}).catch(()=>{});

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
