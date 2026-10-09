
const menuBtn = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if(menuBtn && nav){
  nav.id='navigation-principale';
  menuBtn.setAttribute('aria-controls',nav.id);
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.addEventListener('click',()=>menuBtn.setAttribute('aria-expanded',String(nav.classList.toggle('open'))));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}});
}

// Crédits discrets : survol, clic tactile et clavier ; le HTML natif reste utilisable sans JS.
document.querySelectorAll('.photo-credit').forEach(details=>{
  const summary=details.querySelector('summary');
  let pinned=false,dismissed=false;
  details.addEventListener('mouseenter',()=>{dismissed=false;details.open=true;});
  details.addEventListener('mouseleave',()=>{dismissed=false;if(!pinned&&!details.contains(document.activeElement))details.open=false;});
  details.addEventListener('focusin',()=>{if(!dismissed)details.open=true;});
  details.addEventListener('focusout',event=>{if(!details.contains(event.relatedTarget)&&!pinned)details.open=false;dismissed=false;});
  summary.addEventListener('click',event=>{event.preventDefault();pinned=!pinned;dismissed=!pinned;details.open=pinned;});
  details.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();pinned=false;dismissed=true;details.open=false;summary.focus();}
  });
  document.addEventListener('click',event=>{if(!details.contains(event.target)){pinned=false;details.open=false;}});
});

// Fond photographique toutes les trois secondes ; pause et préférences d'accessibilité.
document.querySelectorAll('[data-hero-gallery]').forEach(gallery=>{
  const slides=[...gallery.querySelectorAll('[data-hero-slide]')];
  const dots=[...gallery.querySelectorAll('[data-hero-go]')];
  const status=gallery.querySelector('[data-hero-status]');
  const pause=gallery.querySelector('[data-hero-pause]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(slides.length<2)return;
  let selected=0,timer=null,userPaused=motion.matches,hovered=false,focused=false,inView=true,request=0;
  const running=()=>!userPaused&&!motion.matches&&!hovered&&!focused&&!document.hidden&&inView;
  const show=async(index,manual=false)=>{
    const serial=++request,next=(index+slides.length)%slides.length;
    const photo=slides[next].querySelector('img');
    try{await photo.decode();}catch{return;}
    if(serial!==request||(!manual&&!running()))return;
    selected=next;
    slides.forEach((slide,n)=>slide.classList.toggle('is-current',n===selected));
    dots.forEach((dot,n)=>dot.setAttribute('aria-current',String(n===selected)));
    gallery.querySelectorAll('[data-slide-credit]').forEach(credit=>{credit.hidden=Number(credit.dataset.slideCredit)!==selected;});
    if(status){status.setAttribute('aria-live',manual?'polite':'off');status.textContent='Photo '+(selected+1)+' sur '+slides.length;}
  };
  const sync=()=>{
    clearTimeout(timer);timer=null;
    gallery.dataset.rotation=running()?'playing':'paused';
    if(pause){
      const label=motion.matches?'Animation arrêtée selon votre préférence de mouvement réduit':userPaused?'Relancer le diaporama':'Mettre le diaporama en pause';
      pause.disabled=motion.matches;
      pause.textContent=userPaused&&!motion.matches?'▶':'Ⅱ';
      pause.setAttribute('aria-label',label);
      pause.title=label;
    }
    if(running())timer=setTimeout(async()=>{await show(selected+1);sync();},3000);
  };
  pause?.addEventListener('click',()=>{userPaused=!userPaused;sync();});
  gallery.querySelector('[data-hero-prev]')?.addEventListener('click',()=>show(selected-1,true));
  gallery.querySelector('[data-hero-next]')?.addEventListener('click',()=>show(selected+1,true));
  dots.forEach((dot,n)=>dot.addEventListener('click',()=>show(n,true)));
  gallery.addEventListener('keydown',event=>{
    if(event.target.tagName!=='BUTTON')return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();show(selected+(event.key==='ArrowRight'?1:-1),true);
    }
  });
  gallery.addEventListener('mouseenter',()=>{hovered=true;sync();});
  gallery.addEventListener('mouseleave',()=>{hovered=false;sync();});
  gallery.addEventListener('focusin',()=>{focused=true;sync();});
  gallery.addEventListener('focusout',event=>{focused=gallery.contains(event.relatedTarget);sync();});
  document.addEventListener('visibilitychange',sync);
  motion.addEventListener('change',()=>{if(motion.matches)userPaused=true;sync();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0}).observe(gallery);
  const controls=gallery.querySelector('[data-hero-controls]');
  if(controls)controls.hidden=false;
  sync();
});

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
