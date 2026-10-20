'use strict';
(() => {
  const root=document.documentElement, themeButton=document.querySelector('.theme-control');
  const modes=['system','light','dark']; let theme='system';
  try { const saved=localStorage.getItem('al-murajaah-theme'); if(modes.includes(saved))theme=saved; } catch {}
  function applyTheme(){ if(theme==='system')delete root.dataset.theme;else root.dataset.theme=theme; themeButton.setAttribute('aria-label','Theme: '+theme+'. Change theme.');document.getElementById('theme-label').textContent=theme[0].toUpperCase()+theme.slice(1); }
  themeButton.hidden=false;applyTheme();themeButton.addEventListener('click',()=>{theme=modes[(modes.indexOf(theme)+1)%modes.length];applyTheme();try{localStorage.setItem('al-murajaah-theme',theme)}catch{}});
  const status=document.getElementById('store-status');let dismiss;
  const messages={google:'Al-Murāja’ah isn’t available on Google Play yet. Download the Android APK above.',apple:'Al-Murāja’ah isn’t available on the App Store yet.'};
  document.querySelectorAll('[data-store]').forEach(button=>button.addEventListener('click',()=>{clearTimeout(dismiss);status.textContent=messages[button.dataset.store];status.classList.add('visible');dismiss=setTimeout(()=>{status.classList.remove('visible');setTimeout(()=>{if(!status.classList.contains('visible'))status.textContent=''},250)},7000)}));
  const band=document.querySelector('.reminder-band'), en=document.getElementById('lang-en'), ar=document.getElementById('lang-ar'), pause=document.getElementById('pause-reading'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=false,visible=false,timer;
  const panels=[document.querySelector('.reading-en'),document.querySelector('.reading-ar')];
  function syncLanguage(){panels[0].setAttribute('aria-hidden',String(ar.checked));panels[1].setAttribute('aria-hidden',String(en.checked));}
  function schedule(){clearTimeout(timer);const staticMode=reduced.matches;pause.hidden=staticMode;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume switching':'Pause switching';document.body.classList.toggle('is-hidden',document.hidden);band.classList.toggle('is-visible',visible&&!document.hidden&&!staticMode);if(visible&&!document.hidden&&!paused&&!staticMode)timer=setTimeout(()=>{en.checked=!en.checked;ar.checked=!en.checked;syncLanguage();schedule()},6500)}
  [en,ar].forEach(radio=>radio.addEventListener('change',()=>{syncLanguage();schedule()}));pause.addEventListener('click',()=>{paused=!paused;schedule()});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25});observer.observe(band);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);syncLanguage();schedule();
})();
