const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-primary-navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
const dialog=document.querySelector('.image-dialog'),expanded=dialog?.querySelector('img');let returnFocus;
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{returnFocus=b;expanded.src=b.dataset.image;expanded.alt=b.querySelector('img').alt;expanded.classList.add('fit');dialog.showModal();document.body.style.overflow='hidden';}));
dialog?.querySelector('.close-dialog')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});expanded?.addEventListener('click',()=>expanded.classList.toggle('fit'));dialog?.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus();expanded.removeAttribute('src');});

document.querySelectorAll('[data-skip]').forEach(b=>b.addEventListener('click',()=>{const m=document.querySelector('.desktop-view main,.desktop-view #SITE_PAGES');m?.focus();m?.scrollIntoView();}));document.addEventListener('keydown',e=>{if(e.key==='Tab')document.body.classList.add('keyboard-tabbing-on');});
document.querySelectorAll('.desktop-view [role="button"]').forEach(control=>{const video=control.querySelector('video');if(!video)return;const sync=()=>control.setAttribute('aria-pressed',String(!video.paused));video.addEventListener('play',sync);video.addEventListener('pause',sync);sync();control.addEventListener('keydown',e=>{if(e.target===control&&(e.key===' '||e.key==='Enter')){e.preventDefault();if(video.paused)video.play();else video.pause();}});});
document.querySelectorAll('.desktop-view [data-testid="vb-audio"]').forEach(b=>{const video=b.closest('section')?.querySelector('video');if(!video)return;b.addEventListener('click',()=>{video.muted=!video.muted;b.setAttribute('aria-pressed',String(video.muted));});});
function fitDesktop(){document.documentElement.style.setProperty('--desktop-scale',String(Math.min(1,window.innerWidth/1440)));}
fitDesktop();window.addEventListener('resize',fitDesktop,{passive:true});
document.querySelectorAll('.desktop-view [aria-label="content changes on hover"]').forEach(region=>region.addEventListener('keydown',e=>{if(e.target===region&&e.key==='Enter'){e.preventDefault();region.querySelector('a[href]')?.click();}}));
