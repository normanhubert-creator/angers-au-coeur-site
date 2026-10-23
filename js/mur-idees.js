(()=>{'use strict';
const POLES=['INSTITUTIONS_DEMOCRATIE','JUSTICE_SECURITE_LIBERTES','FINANCES_PUBLIQUES','ECONOMIE_TRAVAIL_ENTREPRISES','EDUCATION_JEUNESSE_CULTURE','SANTE_PROTECTION_SOCIALE','LOGEMENT_MOBILITES_TERRITOIRES','ECOLOGIE_ENERGIE_AGRICULTURE','SCIENCE_NUMERIQUE_IA','EUROPE_DEFENSE_SOUVERAINETES'];
const LABELS=['Institutions, démocratie et territoires','Justice, sécurité et libertés','Finances publiques et fiscalité','Économie, travail et entreprises','Éducation, culture, jeunesse et sport','Santé, protection sociale et familles','Logement, aménagement et mobilités','Écologie, énergie et alimentation','Science, numérique et intelligence artificielle','Europe, international et souverainetés'];
const TYPES={CONTRIBUTION:'Contribution anonyme',SYNTHESE:'Synthèse des échanges',QUESTION_POLE:'Question du pôle'};
const API=(['localhost','127.0.0.1'].includes(location.hostname)?location.origin:'https://angers-au-coeur-espace.angers-au-coeur-cloudflare-v2.workers.dev')+'/api/public/idea-wall';
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function card(item){
 const pole=POLES.indexOf(item.pole),node=el('article',undefined,'idea-note note-'+((Math.max(0,pole))%4));node.id='idee-'+item.id;node.tabIndex=-1;
 node.append(el('span',TYPES[item.type]||'Réflexion','note-kind'),el('h3',item.titre));
 if(item.texte.length>230){const cutoff=item.texte.lastIndexOf(' ',230),end=cutoff>150?cutoff:230;node.append(el('p',item.texte.slice(0,end)+'…','note-excerpt'));const details=el('details'),summary=el('summary','Lire la suite');details.append(summary,el('p',item.texte));node.append(details);}else node.append(el('p',item.texte,'note-excerpt'));
 const foot=el('footer',undefined,'note-footer');foot.append(el('span',item.etape==='EN_TRAVAIL'?'En cours de travail':'Réflexion ouverte','note-stage'));
 if(pole>=0){const link=el('a','Pôle '+String(pole+1).padStart(2,'0')+' · '+LABELS[pole]);link.href='travaux.html?pole='+(pole+1)+'#pole-'+(pole+1);foot.append(link);}else foot.append(el('span','Sujet transversal'));
 const date=el('time',new Date(item.date_publication).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}));date.dateTime=item.date_publication;foot.append(date);
 const share=el('a','Lien de ce post-it','note-share');share.href='mur-des-idees.html#idee-'+item.id;foot.append(share);node.append(foot);return node;
}
async function request(path){const response=await fetch(API+path,{credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('Le mur ne répond pas pour le moment.');const value=await response.json();if(!value.ok||!Array.isArray(value.data?.items))throw Error('Le mur est temporairement indisponible.');return value.data;}
for(const wall of document.querySelectorAll('[data-idea-wall]')){
 const grid=wall.querySelector('[data-wall-grid]'),message=wall.querySelector('[data-wall-message]'),pole=wall.querySelector('[data-wall-pole]'),kind=wall.querySelector('[data-wall-kind]'),more=wall.querySelector('[data-wall-more]'),refresh=wall.querySelector('[data-wall-refresh]'),controls=wall.querySelector('[data-wall-controls]');
 const compact=wall.hasAttribute('data-wall-compact'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let items=[],page=1,hasMore=false,offset=0,paused=reduced.matches,hover=false,loading=false;
 const text=el('span','', 'wall-position'),pause=el('button',paused?'Lecture':'Pause'),previous=el('button','←'),next=el('button','→');for(const b of[pause,previous,next])b.type='button';previous.setAttribute('aria-label','Post-it précédents');next.setAttribute('aria-label','Post-it suivants');
 if(controls)controls.append(pause,previous,text,next);
 function selected(){return items.filter(x=>!kind?.value||x.type===kind.value);}
 function render(){const all=selected(),limit=compact?3:all.length;offset=all.length?offset%all.length:0;const shown=compact?all.slice(offset,offset+limit):all;grid.replaceChildren(...shown.map(card));
  message.textContent=all.length?'':kind?.value?'Aucun post-it de cette nature pour ce pôle.':'Le mur accueillera les contributions relues et les synthèses des pôles. Vous pouvez déjà proposer une idée.';
  if(controls){controls.hidden=all.length<=3;text.textContent=all.length?Math.floor(offset/3)+1+' / '+Math.ceil(all.length/3):'';pause.textContent=paused?'Lecture':'Pause';pause.setAttribute('aria-label',paused?'Démarrer la rotation des post-it':'Mettre la rotation des post-it en pause');}
  if(more)more.hidden=!hasMore;
 }
 async function load(append=false){if(loading)return;loading=true;if(refresh)refresh.disabled=true;try{const data=await request('?'+new URLSearchParams({page:append?page+1:1,pole:pole?.value||'',type:kind?.value||''}));page=data.page;hasMore=data.has_more;items=append?[...items,...data.items.filter(x=>!items.some(y=>y.id===x.id))]:data.items;offset=0;render();}catch(error){message.textContent=error.message+(refresh?' Réessayez avec le bouton Actualiser.':' Ouvrez le mur pour réessayer.');}finally{loading=false;if(refresh)refresh.disabled=false;}}
 function turn(direction){const length=selected().length,groups=Math.ceil(length/3);if(groups>1){offset=((Math.floor(offset/3)+direction+groups)%groups)*3;render();}}
 pause.onclick=()=>{paused=!paused;render();};previous.onclick=()=>{paused=true;turn(-1);};next.onclick=()=>{paused=true;turn(1);};
 wall.addEventListener('pointerenter',()=>{hover=true;});wall.addEventListener('pointerleave',()=>{hover=false;});wall.addEventListener('focusin',()=>{paused=true;if(controls)pause.textContent='Lecture';});wall.addEventListener('toggle',event=>{if(event.target.open)paused=true;},true);
 if(pole)pole.onchange=()=>load();if(kind)kind.onchange=()=>load();if(more)more.onclick=()=>load(true);if(refresh)refresh.onclick=()=>load();
 reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;render();}});
 const rotation=compact?setInterval(()=>{if(!paused&&!hover&&!document.hidden&&!wall.contains(document.activeElement)&&wall.getBoundingClientRect().bottom>0&&wall.getBoundingClientRect().top<innerHeight)turn(1);},8000):null;
 const renewal=compact?setInterval(()=>{if(!paused&&!hover&&!document.hidden&&!wall.contains(document.activeElement))load();},90000):null;
 window.addEventListener('pagehide',()=>{clearInterval(rotation);clearInterval(renewal);},{once:true});
 load().then(async()=>{const id=location.hash.match(/^#idee-([a-f0-9-]{36})$/i)?.[1];if(!id||compact)return;let target=document.getElementById('idee-'+id);if(!target){try{const r=await fetch(API+'/'+id,{credentials:'omit',cache:'no-store'}),v=await r.json();if(r.ok&&v.ok){target=card(v.data.item);grid.prepend(target);message.textContent='';}}catch{}}if(target){target.scrollIntoView({block:'center',behavior:'instant'});target.focus({preventScroll:true});}else message.textContent='Ce post-it n’est plus publié. Découvrez les réflexions disponibles ci-dessous.';});
}
})();
