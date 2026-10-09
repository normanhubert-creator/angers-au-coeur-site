
const menuBtn = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if(menuBtn && nav){
  nav.id='navigation-principale';
  menuBtn.setAttribute('aria-controls',nav.id);
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.addEventListener('click',()=>menuBtn.setAttribute('aria-expanded',String(nav.classList.toggle('open'))));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}});
}

// Miniatures Drive ou YouTube ; aucun lecteur n'est chargé avant l'action du visiteur.
document.querySelectorAll('.video-box[data-video-id], .video-box[data-youtube-id]').forEach(videoBox=>{
  const youtubeId=videoBox.getAttribute('data-youtube-id');
  const id=youtubeId || videoBox.getAttribute('data-video-id');
  if(!id || !/^[A-Za-z0-9_-]+$/.test(id))return;
  const title=videoBox.querySelector('.video-caption')?.textContent.trim() || 'Vidéo Angers au Cœur';
  const thumbnail=youtubeId ? 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg' : 'https://drive.google.com/thumbnail?id='+id+'&sz=w1000';
  videoBox.style.backgroundImage='linear-gradient(0deg,rgba(4,18,34,.72),rgba(4,18,34,.08)), url('+thumbnail+')';
  videoBox.style.backgroundSize='cover';
  videoBox.style.backgroundPosition='center';
  let loaded=false;
  const loadPlayer=event=>{
    event.preventDefault();
    if(loaded)return;
    loaded=true;
    const iframe=document.createElement('iframe');
    iframe.src=youtubeId ? 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0' : 'https://drive.google.com/file/d/'+id+'/preview';
    iframe.title=title;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; fullscreen');
    iframe.allowFullscreen=true;
    iframe.loading='lazy';
    iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';
    videoBox.removeAttribute('role');
    videoBox.removeAttribute('tabindex');
    videoBox.removeAttribute('aria-label');
    if(videoBox.tagName==='A')videoBox.removeAttribute('href');
    videoBox.replaceChildren(iframe);
    iframe.focus();
  };
  videoBox.addEventListener('click',loadPlayer);
  if(videoBox.tagName!=='A'){
    videoBox.setAttribute('role','button');
    videoBox.setAttribute('tabindex','0');
    videoBox.setAttribute('aria-label','Lire la vidéo : '+title);
  }
  videoBox.addEventListener('keydown',event=>{
    if(event.target===videoBox && (event.key==='Enter' || event.key===' '))loadPlayer(event);
  });
});

// Ce fichier public ne contient que des éléments sélectionnés pour publication.
const POLE_PANEL_NAMES=['Institutions et démocratie','Justice, sécurité et libertés','Finances publiques','Économie, travail et entreprises','Éducation, jeunesse et culture','Santé et protection sociale','Logement, mobilités et territoires','Écologie, énergie et agriculture','Science, numérique et IA','Europe, défense et souverainetés'];
function applyPoleIdeas(items){
  const panels=document.querySelectorAll('[data-pole-panel]');
  if(!panels.length||!items||!items.length)return;
  const byPanel={};
  items.forEach(item=>{
    const idx=POLE_PANEL_NAMES.indexOf(item.pole_nom);
    if(idx<0)return;
    const num=String(idx+1);
    (byPanel[num]=byPanel[num]||[]).push(item);
  });
  panels.forEach(panel=>{
    const list=byPanel[panel.getAttribute('data-pole-panel')];
    if(!list||!list.length)return;
    const ul=panel.querySelector('.pole-list');
    if(!ul)return;
    ul.replaceChildren(...list.map(item=>{
      const li=document.createElement('li');
      li.textContent=item.titre||'';
      return li;
    }));
  });
}
fetch('data/public-ideas.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
  if(!data||!Array.isArray(data.items)||!data.items.length)return;
  applyPoleIdeas(data.items);
}).catch(()=>{});


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
