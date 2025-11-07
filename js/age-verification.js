document.addEventListener('DOMContentLoaded', function(){
  // === Temporarily disable remembering age-confirmation ===
  try{
    localStorage.removeItem('ageVerified');
    sessionStorage.removeItem('ageVerified');
    document.cookie = 'ageVerified=; Max-Age=0; path=/;';

    const _origLSSet = localStorage.setItem.bind(localStorage);
    const _origSSSet = sessionStorage.setItem.bind(sessionStorage);
    localStorage.setItem = function(k,v){ if(/age/i.test(k)) return; return _origLSSet(k,v); };
    sessionStorage.setItem = function(k,v){ if(/age/i.test(k)) return; return _origSSSet(k,v); };
  }catch(e){ /* ignore in restricted contexts */ }

  const docEl = document.documentElement;
  const bodyEl = document.body;
  const ageGate = document.querySelector('.age-gate');
  const enterBtn = document.getElementById('enter-btn');
  const exitBtn = document.getElementById('exit-btn');
  const overlay = document.querySelector('.overlay');
  const video = document.getElementById('bg-video');

  const openingSection = document.getElementById('opening-sequence');
  const skipBtn = document.getElementById('skip-opening');
  const openingSlideEl = document.getElementById('opening-slide');
  const openingCaptionEl = document.getElementById('slide-caption');
  const openingStatusEl = document.getElementById('slide-status');
  const openingProgressEl = document.getElementById('progress-bar');
  const mainView = document.getElementById('main-view');

  const prefersReducedMotion = window.matchMedia ?
    window.matchMedia('(prefers-reduced-motion: reduce)') :
    { matches: false };
  let resizeTimer = null;

  function setViewportUnit(){
    if(!docEl) return;
    docEl.style.setProperty('--vh', `${window.innerHeight}px`);
  }
  setViewportUnit();
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setViewportUnit, 150);
  });

  function flagNoVideo(){ bodyEl.classList.add('no-video'); }
  function clearNoVideo(){ bodyEl.classList.remove('no-video'); }

  if(!video){
    flagNoVideo();
  } else {
    const support = typeof video.canPlayType === 'function' ? video.canPlayType('video/mp4') : 'maybe';
    if(!support){
      flagNoVideo();
    }else{
      video.addEventListener('error', flagNoVideo);
      video.addEventListener('loadeddata', clearNoVideo, { once: true });
    }
  }

  // ---- Age gate actions ----
  function beginOpeningFlow(delayMs=520){
    setTimeout(()=>{ revealOpeningSequence(); }, delayMs);
  }

  function redirectToOpening(){
    overlay && overlay.classList.add('fade-out');
    beginOpeningFlow(520);
  }

  function exitToExternal(){
    window.location.href = 'https://www.google.com';
  }

  if(enterBtn) enterBtn.addEventListener('click', redirectToOpening);
  if(exitBtn) exitBtn.addEventListener('click', exitToExternal);

  // ---- Background slideshow behind age gate ----
  const bgSlides = [
    'images/gallery/scene_mary_onTop.jpg',
    'images/gallery/scene_sex_Elaine.jpg',
    'images/gallery/scene_caning.jpg',
    'images/gallery/scene_pear of anguish.jpg'
  ];
  const slideshowContainer = document.getElementById('bg-slideshow');
  const slideshowImg = document.getElementById('slideshow-img');
  const slideshowFlash = document.getElementById('slideshow-flash');

  function playBackgroundSlideshow(list, displayTime=500, flashDuration=180){
    if(!slideshowContainer || !slideshowImg || !slideshowFlash) return;
    if(!list || list.length === 0 || prefersReducedMotion.matches) return;
    slideshowContainer.style.display = 'flex';
    slideshowContainer.setAttribute('aria-hidden','false');
    if(video){ try{ video.style.display='none'; }catch(e){} }
    let i = 0;
    function next(){
      if(i >= list.length){ return; }
      const src = list[i];
      slideshowImg.src = encodeURI(src);
      setTimeout(()=>{
        slideshowFlash.classList.add('visible');
        setTimeout(()=>{
          slideshowFlash.classList.remove('visible');
          i++;
          setTimeout(next, 50);
        }, flashDuration);
      }, displayTime);
    }
    next();
  }

  if(video){
    video.addEventListener('ended', ()=> playBackgroundSlideshow(bgSlides, 500, 180));
    setTimeout(()=>{
      if(video.ended) return;
      try{
        video.pause();
        if(Number.isFinite(video.duration)){ video.currentTime = video.duration; }
      }catch(e){}
      playBackgroundSlideshow(bgSlides, 500, 180);
    }, 8000);
  } else {
    flagNoVideo();
    playBackgroundSlideshow(bgSlides, 500, 180);
  }

  // ---- Opening sequence (now inline on index) ----
  const openingSlides = [
    { src: 'images/gallery/scene_caning.jpg', text: '痛みと恥辱の中で微笑むあなた。' },
    { src: 'images/gallery/scene_pear of anguish.jpg', text: '私はだれ？' },
    { src: 'images/gallery/scene_sex_Elaine.jpg', text: '屈するしかない。' },
    { src: 'images/gallery/scene_tits.jpg', text: '痛みの中' },
    { src: 'images/gallery/scene_orgy.jpg', text: '破綻へと向かう道。' }
  ];
  const openingDuration = prefersReducedMotion.matches ? 4000 : 2000;
  let openingTimer = null;
  let openingIndex = 0;
  let openingStarted = false;
  let mainShown = false;

  function showMainView(){
    if(mainShown) return;
    mainShown = true;
    openingStarted = false;
    clearTimeout(openingTimer);
    if(openingSection){
      openingSection.classList.remove('opening--active');
      openingSection.classList.add('opening--hidden');
      openingSection.hidden = true;
      openingSection.setAttribute('aria-hidden','true');
    }
    if(mainView){
      mainView.classList.remove('main-view--hidden');
      mainView.setAttribute('aria-hidden','false');
      if(typeof mainView.focus === 'function'){
        mainView.focus({ preventScroll: false });
      }
    }
    if(history.replaceState){
      history.replaceState(null, document.title, window.location.pathname);
    }
  }

  function goToMain(){
    showMainView();
  }

  function animateOpeningProgress(duration){
    if(!openingProgressEl) return;
    openingProgressEl.style.transition = 'none';
    openingProgressEl.style.width = '0%';
    requestAnimationFrame(()=>{
      openingProgressEl.style.transition = `width ${duration}ms linear`;
      openingProgressEl.style.width = '100%';
    });
  }

  function updateOpeningStatus(){
    if(openingStatusEl){
      openingStatusEl.textContent = `スライド ${openingIndex + 1} / ${openingSlides.length}`;
    }
    if(openingCaptionEl){
      openingCaptionEl.textContent = openingSlides[openingIndex].text;
    }
  }

  function showOpeningSlide(index){
    if(!openingSlideEl) return;
    const slide = openingSlides[index];
    if(!slide) return;
    openingSlideEl.classList.remove('visible');
    const loader = new Image();
    loader.onload = ()=>{
      openingSlideEl.src = loader.src;
      openingSlideEl.alt = slide.text;
      updateOpeningStatus();
      requestAnimationFrame(()=> openingSlideEl.classList.add('visible'));
      animateOpeningProgress(openingDuration);
    };
    loader.onerror = ()=>{
      openingSlideEl.src = 'assets/images/opening/placeholder.svg';
      openingSlideEl.alt = 'スライド画像を読み込めませんでした';
      updateOpeningStatus();
      animateOpeningProgress(openingDuration);
    };
    loader.src = encodeURI(slide.src);
  }

  function scheduleOpeningNext(){
    clearTimeout(openingTimer);
    openingTimer = setTimeout(()=>{
      openingIndex += 1;
      if(openingIndex >= openingSlides.length){
        goToMain();
        return;
      }
      showOpeningSlide(openingIndex);
      scheduleOpeningNext();
    }, openingDuration);
  }

  function startOpeningSlides(){
    if(!openingSection || !openingSlideEl) return;
    openingIndex = 0;
    showOpeningSlide(openingIndex);
    scheduleOpeningNext();
  }

  function revealOpeningSequence(options = {}){
    if(openingStarted || !openingSection) return;
    openingStarted = true;

    if(history.replaceState){
      history.replaceState(null, document.title, '#opening');
    } else {
      window.location.hash = 'opening';
    }

    if(ageGate){
      ageGate.classList.add('age-gate--hidden');
      ageGate.setAttribute('aria-hidden','true');
    }
    overlay && overlay.setAttribute('aria-hidden','true');

    openingSection.hidden = false;
    openingSection.classList.remove('opening--hidden');
    openingSection.classList.add('opening--active');
    openingSection.setAttribute('aria-hidden','false');

    startOpeningSlides();
  }

  function skipOpening(){
    goToMain();
  }

  if(skipBtn) skipBtn.addEventListener('click', skipOpening);

  document.addEventListener('keydown', function(e){
    const key = e.key;
    if(openingStarted){
      if(key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Escape'){
        e.preventDefault();
        skipOpening();
      }
      return;
    }
    if(key === 'Enter'){
      const active = document.activeElement;
      if(active === enterBtn || active === exitBtn){ return; }
      redirectToOpening();
    }
    if(key === 'Escape'){
      exitToExternal();
    }
  });

  if(window.location.hash === '#opening'){
    overlay && overlay.classList.remove('fade-out');
    revealOpeningSequence();
  }
});
