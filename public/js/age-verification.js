document.addEventListener('DOMContentLoaded', function(){
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
  const openingFlashEl = document.getElementById('opening-flash');
  const fireVideoLayer = document.getElementById('fire-video-layer');
  const fireVideo = document.getElementById('fire-video');
  const MAIN_PAGE = 'main.html';
  const ageGateState = window.KarinAgeGate || {};
  const rememberAgeVerification = typeof ageGateState.setVerified === 'function'
    ? ageGateState.setVerified
    : function(){};
  const isAgePreviouslyVerified = typeof ageGateState.isVerified === 'function'
    ? ageGateState.isVerified
    : function(){ return false; };
  const alreadyVerified = isAgePreviouslyVerified();

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

  function redirectToOpening(options = {}){
    const { immediate = false, skipPersist = false } = options;
    if(!skipPersist){
      rememberAgeVerification();
    }
    overlay && overlay.classList.add('fade-out');
    beginOpeningFlow(immediate ? 0 : 520);
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
  let fireVideoActive = false;
  let fireVideoTimeout = null;
  let hasNavigatedToMain = false;

  function resetFireVideoLayer(){
    if(!fireVideoLayer || !fireVideo) return;
    fireVideoLayer.classList.add('fire-video--hidden');
    fireVideoLayer.classList.remove('fire-video--visible');
    fireVideoLayer.classList.remove('fire-video--fade');
    fireVideoLayer.setAttribute('aria-hidden','true');
    try{
      fireVideo.pause();
      fireVideo.currentTime = 0;
    }catch(e){}
    fireVideoActive = false;
  }

  function navigateToMain(){
    if(hasNavigatedToMain) return;
    hasNavigatedToMain = true;
    if(history.replaceState){
      history.replaceState(null, document.title, window.location.pathname);
    }
    window.location.href = MAIN_PAGE;
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

  function triggerOpeningFlash(){
    if(!openingFlashEl || prefersReducedMotion.matches) return;
    openingFlashEl.classList.remove('visible');
    void openingFlashEl.offsetWidth;
    openingFlashEl.classList.add('visible');
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
      triggerOpeningFlash();
      requestAnimationFrame(()=> openingSlideEl.classList.add('visible'));
      animateOpeningProgress(openingDuration);
    };
    loader.onerror = ()=>{
      openingSlideEl.src = 'assets/images/opening/placeholder.svg';
      openingSlideEl.alt = 'スライド画像を読み込めませんでした';
      updateOpeningStatus();
      triggerOpeningFlash();
      animateOpeningProgress(openingDuration);
    };
    loader.src = encodeURI(slide.src);
  }

  function scheduleOpeningNext(){
    clearTimeout(openingTimer);
    openingTimer = setTimeout(()=>{
      openingIndex += 1;
      if(openingIndex >= openingSlides.length){
        startFireVideoSequence();
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

  function handleFireVideoEnded(){
    fadeOutFireVideoLayer(false);
  }

  function handleFireVideoError(){
    fadeOutFireVideoLayer(true);
  }

  function fadeOutFireVideoLayer(skipAnimation){
    if(fireVideoTimeout){
      clearTimeout(fireVideoTimeout);
      fireVideoTimeout = null;
    }
    if(fireVideo){
      try{ fireVideo.pause(); }catch(e){}
      fireVideo.removeEventListener('ended', handleFireVideoEnded);
      fireVideo.removeEventListener('error', handleFireVideoError);
    }
    if(!fireVideoLayer){
      navigateToMain();
      return;
    }
    if(skipAnimation || prefersReducedMotion.matches){
      resetFireVideoLayer();
      navigateToMain();
      return;
    }
    fireVideoLayer.classList.add('fire-video--fade');
    setTimeout(()=>{
      resetFireVideoLayer();
      navigateToMain();
    }, 600);
  }

  function startFireVideoSequence(){
    if(!fireVideoLayer || !fireVideo){
      navigateToMain();
      return;
    }
    fireVideoLayer.classList.remove('fire-video--hidden');
    fireVideoLayer.classList.remove('fire-video--fade');
    fireVideoLayer.classList.add('fire-video--visible');
    fireVideoLayer.setAttribute('aria-hidden','false');
    fireVideo.currentTime = 0;
    fireVideoActive = true;

    const playVideo = () => {
      try{
        const playPromise = fireVideo.play();
        if(playPromise && typeof playPromise.catch === 'function'){
          playPromise.catch(()=> handleFireVideoError());
        }
      }catch(e){
        handleFireVideoError();
      }
    };

    fireVideo.addEventListener('ended', handleFireVideoEnded, { once:true });
    fireVideo.addEventListener('error', handleFireVideoError, { once:true });

    fireVideoTimeout = setTimeout(playVideo, 100);
  }

  function skipOpening(){
    if(fireVideoTimeout){
      clearTimeout(fireVideoTimeout);
      fireVideoTimeout = null;
    }
    if(fireVideoActive){
      fadeOutFireVideoLayer(true);
      return;
    }
    navigateToMain();
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

  if(history.replaceState && window.location.hash === '#opening'){
    history.replaceState(null, document.title, window.location.pathname);
  }

  // ---- 火の粉アニメーション生成 ----
  function createEmbers(){
    if(prefersReducedMotion.matches) return;
    const mediaBg = document.querySelector('.media-bg');
    if(!mediaBg) return;

    const embersContainer = document.createElement('div');
    embersContainer.className = 'embers';
    embersContainer.setAttribute('aria-hidden', 'true');

    const emberCount = window.innerWidth < 768 ? 25 : 50;

    for(let i = 0; i < emberCount; i++){
      const ember = document.createElement('div');
      ember.className = 'ember';

      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 10;
      const drift = (Math.random() - 0.5) * 2;
      const width = 2 + Math.random() * 4;
      const height = width * (1.5 + Math.random() * 0.8);

      ember.style.left = `${left}%`;
      ember.style.bottom = '-20px';
      ember.style.setProperty('--duration', `${duration}s`);
      ember.style.setProperty('--delay', `${delay}s`);
      ember.style.setProperty('--drift', drift);
      ember.style.setProperty('--ember-width', `${width}px`);
      ember.style.setProperty('--ember-height', `${height}px`);

      embersContainer.appendChild(ember);
    }

    mediaBg.appendChild(embersContainer);
  }

  if(alreadyVerified){
    requestAnimationFrame(()=>{
      redirectToOpening({ immediate:true, skipPersist:true });
    });
  }

  createEmbers();
});
