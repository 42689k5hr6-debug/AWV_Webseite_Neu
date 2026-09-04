const awSchemaPath=location.pathname.split('/').pop()||'index.html';
const awSchemaLabels={
  'index.html':'Startseite',
  'unternehmen.html':'Unternehmen',
  'leistungen.html':'Leistungen',
  'immobilien.html':'Immobilien',
  'angebote.html':'Aktuelle Angebote',
  '3-zimmer-wohnung-traunstein.html':'3-Zimmer-Wohnung Traunstein',
  'wissenswertes.html':'Wissenswertes',
  'selbstauskunft.html':'Selbstauskunft',
  'kontakt.html':'Kontakt',
  'impressum.html':'Impressum',
  'datenschutz.html':'Datenschutz'
};
const awSchemaUrl=awSchemaPath==='index.html'?'https://www.aw-verwaltung.de/':`https://www.aw-verwaltung.de/${awSchemaPath}`;
const awOrganization={
  '@type':['Organization','RealEstateAgent'],
  '@id':'https://www.aw-verwaltung.de/#organization',
  name:'AW Verwaltungs GmbH & Co. KG',
  alternateName:'AW Verwaltung',
  url:'https://www.aw-verwaltung.de/',
  logo:{'@type':'ImageObject',url:'https://www.aw-verwaltung.de/assets/aw-logo.png'},
  image:'https://www.aw-verwaltung.de/assets/aw-preview.jpg',
  email:'info@aw-verwaltung.de',
  telephone:'+49-861-4307',
  address:{
    '@type':'PostalAddress',
    streetAddress:'Bahnweg 16',
    postalCode:'83278',
    addressLocality:'Traunstein',
    addressCountry:'DE'
  },
  areaServed:[
    {'@type':'City',name:'Traunstein'},
    {'@type':'AdministrativeArea',name:'Chiemgau'}
  ],
  openingHoursSpecification:[{
    '@type':'OpeningHoursSpecification',
    dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],
    opens:'08:00',
    closes:'12:00'
  }],
  knowsAbout:['Hausverwaltung','Objektverwaltung','Mietverwaltung','Technische Verwaltung','Kaufmännische Verwaltung','Mietwohnungen','Büroflächen','Gewerbeimmobilien','Garagen und Stellplätze']
};
const awSchemaGraph=[
  awOrganization,
  {
    '@type':'WebSite',
    '@id':'https://www.aw-verwaltung.de/#website',
    url:'https://www.aw-verwaltung.de/',
    name:'AW Verwaltung',
    publisher:{'@id':'https://www.aw-verwaltung.de/#organization'},
    inLanguage:'de-DE'
  },
  {
    '@type':'WebPage',
    '@id':`${awSchemaUrl}#webpage`,
    url:awSchemaUrl,
    name:document.title,
    isPartOf:{'@id':'https://www.aw-verwaltung.de/#website'},
    about:{'@id':'https://www.aw-verwaltung.de/#organization'},
    inLanguage:'de-DE'
  }
];
if(awSchemaPath!=='index.html'){
  awSchemaGraph.push({
    '@type':'BreadcrumbList',
    '@id':`${awSchemaUrl}#breadcrumb`,
    itemListElement:[
      {'@type':'ListItem',position:1,name:'Startseite',item:'https://www.aw-verwaltung.de/'},
      {'@type':'ListItem',position:2,name:awSchemaLabels[awSchemaPath]||document.title,item:awSchemaUrl}
    ]
  });
}
document.getElementById('aw-schema')?.remove();
const awSchemaScript=document.createElement('script');
awSchemaScript.id='aw-schema';
awSchemaScript.type='application/ld+json';
awSchemaScript.textContent=JSON.stringify({'@context':'https://schema.org','@graph':awSchemaGraph});
document.head.appendChild(awSchemaScript);

const awFavicon='assets/favicon-aw.svg?v=20260904-7';
let awIcon=document.querySelector('link[rel="icon"]');
if(!awIcon){awIcon=document.createElement('link');awIcon.rel='icon';document.head.appendChild(awIcon)}
awIcon.type='image/svg+xml';
awIcon.href=awFavicon;
let awShortcut=document.querySelector('link[rel="shortcut icon"]');
if(!awShortcut){awShortcut=document.createElement('link');awShortcut.rel='shortcut icon';document.head.appendChild(awShortcut)}
awShortcut.type='image/svg+xml';
awShortcut.href=awFavicon;

if(!document.querySelector('link[href^="enhancements.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='enhancements.css?v=20260830-9';document.head.appendChild(l)}
document.querySelectorAll('.footer-logo').forEach(img=>{img.src='assets/aw-logo.png?v=20260830-7';img.alt='AW Verwaltung'});
const menu=document.querySelector('.menu');const nav=document.querySelector('.navlinks');menu?.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(o))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.navlinks').forEach(n=>{if(!n.querySelector('a[href="angebote.html"]')){const ref=n.querySelector('a[href="wissenswertes.html"]');const a=document.createElement('a');a.href='angebote.html';a.textContent='Aktuelle Angebote';n.insertBefore(a,ref)}});
document.querySelectorAll('.footer-grid').forEach(f=>{const navCol=[...f.children].find(x=>x.querySelector('h4')?.textContent.trim()==='Navigation');if(navCol&&!navCol.querySelector('a[href="angebote.html"]')){const a=document.createElement('a');a.href='angebote.html';a.textContent='Aktuelle Angebote';navCol.append(document.createElement('br'),a)}});
const datePrefix=()=>{const d=new Date();return `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_`};
const setMail=(a,subject)=>{a.href=`mailto:s.schuhboeck@aw-verwaltung.de?cc=${encodeURIComponent('info@aw-verwaltung.de')}&subject=${encodeURIComponent(datePrefix()+subject)}`};
document.querySelectorAll('a[href^="mailto:s.schuhboeck@aw-verwaltung.de"]').forEach(a=>{const t=a.textContent.trim();let s='Anfrage an AW Verwaltung';if(t==='Anfrage per E-Mail senden')s='Anfrage Mietwohnung Traunstein';else if(t==='Verfügbarkeit prüfen')s='Anfrage Büro- oder Gewerbefläche';else if(t==='Anliegen mitteilen')s='Anliegen zum Mietverhältnis';else if(a.closest('.download')?.querySelector('h3')?.textContent.includes('Wohnraum'))s='Selbstauskunft Wohnraum anfordern';else if(a.closest('.download')?.querySelector('h3')?.textContent.includes('Gewerbe'))s='Selbstauskunft Gewerbe anfordern';setMail(a,s)});
const offerSubjects={Mietwohnungen:'Interesse an einer Mietwohnung',Doppelhaushälften:'Interesse an einer DHH','Garagen & Stellplätze':'Interesse an einer Garage oder einem Stellplatz','Büro & Gewerbeflächen':'Interesse an einer Büro- oder Gewerbefläche'};
document.querySelectorAll('.offer-type').forEach(card=>{const title=card.querySelector('h3')?.textContent.trim();if(!title||card.querySelector('.mail-interest'))return;const a=document.createElement('a');a.className='contact-action mail-interest';a.textContent='Interesse vormerken';setMail(a,offerSubjects[title]||`Interesse an ${title}`);card.appendChild(a)});
if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));const services=document.querySelector('.services-grid');if(services){const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');sio.unobserve(e.target)}}),{threshold:.16});sio.observe(services)}}else{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));document.querySelector('.services-grid')?.classList.add('is-visible')}
const typed=document.querySelector('.hero-typed');if(typed){const phrases=['Persönlich verwaltet.','Werthaltig entwickelt.','Modern organisiert.','Verlässlich betreut.'];if(reduced){typed.textContent=phrases[0]}else{let p=0,i=0,deleting=false;const tick=()=>{const phrase=phrases[p];if(deleting){i=Math.max(0,i-1)}else{i=Math.min(phrase.length,i+1)}typed.textContent=phrase.slice(0,i);let wait=deleting?32:56;if(!deleting&&i===phrase.length){deleting=true;wait=2200}else if(deleting&&i===0){deleting=false;p=(p+1)%phrases.length;wait=380}setTimeout(tick,wait)};typed.textContent='';setTimeout(tick,350)}}
document.querySelectorAll('[data-slider]').forEach(slider=>{const track=slider.querySelector('.insight-track');const slides=[...slider.querySelectorAll('.insight-slide')];const dots=[...slider.querySelectorAll('[data-dot]')];const prev=slider.querySelector('[data-prev]');const next=slider.querySelector('[data-next]');if(!track||slides.length<2)return;let index=0;const show=i=>{index=(i+slides.length)%slides.length;track.style.transform=`translateX(-${index*100}%)`;slides.forEach((s,n)=>s.setAttribute('aria-hidden',String(n!==index)));dots.forEach((d,n)=>d.classList.toggle('active',n===index))};prev?.addEventListener('click',()=>show(index-1));next?.addEventListener('click',()=>show(index+1));dots.forEach((d,n)=>d.addEventListener('click',()=>show(n)));show(0)});
const profileTriggers=document.querySelectorAll('.person-photo-trigger[aria-controls],.initials-profile-trigger[aria-controls]');let activeProfileModal=null,lastProfileFocus=null,profileCloseTimer=null;const openProfileModal=e=>{const t=e.getAttribute('aria-controls'),o=document.getElementById(t);if(!o)return;clearTimeout(profileCloseTimer),lastProfileFocus=document.activeElement,activeProfileModal=o,o.hidden=!1,o.setAttribute('aria-hidden','false'),document.body.classList.add('profile-modal-open'),requestAnimationFrame(()=>o.classList.add('is-open')),setTimeout(()=>o.querySelector('.profile-modal__close')?.focus(),100)};const closeProfileModal=()=>{if(!activeProfileModal)return;const e=activeProfileModal;e.classList.remove('is-open'),e.setAttribute('aria-hidden','true'),document.body.classList.remove('profile-modal-open'),profileCloseTimer=setTimeout(()=>{e.hidden=!0,activeProfileModal=null,lastProfileFocus&&lastProfileFocus.focus()},300)};profileTriggers.forEach(e=>e.addEventListener('click',()=>openProfileModal(e))),document.querySelectorAll('.profile-modal [data-profile-close]').forEach(e=>e.addEventListener('click',closeProfileModal)),document.querySelectorAll('.profile-modal__panel').forEach(e=>e.addEventListener('click',e=>e.stopPropagation())),document.addEventListener('keydown',e=>{'Escape'===e.key&&activeProfileModal&&closeProfileModal()});
