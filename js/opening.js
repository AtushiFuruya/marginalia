document.addEventListener('DOMContentLoaded', () => {
  const slideEl = document.getElementById('opening-slide');
  const captionEl = document.getElementById('slide-caption');
  const statusEl = document.getElementById('slide-status');
  const progressEl = document.getElementById('progress-bar');
  const skipBtn = document.getElementById('skip-opening');

  const prefersReducedMotion = window.matchMedia ?
    window.matchMedia('(prefers-reduced-motion: reduce)') :
    { matches: false };

  const slides = [
    { src: 'images/gallery/scene_caning.jpg', alt: '痛みと恥辱の中で微笑むあなた。', caption: '痛みと恥辱の中で微笑むあなた。' },
    { src: 'images/gallery/scene_pear of anguish.jpg', alt: '私はだれ？', caption: '私はだれ？' },
    { src: 'images/gallery/scene_sex_Elaine.jpg', alt: '屈するしかない。', caption: '屈するしかない。' },
    { src: 'images/gallery/scene_tits.jpg', alt: '痛みの中', caption: '痛みの中' },
    { src: 'images/gallery/scene_orgy.jpg', alt: '破綻へと向かう道。', caption: '破綻へと向かう道。' }
  ];
  const totalSlides = slides.length;
  const slideDuration = prefersReducedMotion.matches ? 4000 : 2000;
  let current = 0;
  let timer = null;

  function goToMain(){
    window.location.href = 'main.html';
  }

  function animateProgress(duration){
    if(!progressEl) return;
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    requestAnimationFrame(() => {
      progressEl.style.transition = `width ${duration}ms linear`;
      progressEl.style.width = '100%';
    });
  }

  function updateStatus(){
    if(statusEl){
      statusEl.textContent = `スライド ${current + 1} / ${totalSlides}`;
    }
  }

  function showSlide(index){
    const data = slides[index];
    if(!data || !slideEl) return;

    slideEl.classList.remove('visible');
    const loader = new Image();
    loader.onload = () => {
      slideEl.src = loader.src;
      slideEl.alt = data.alt;
      if(captionEl){ captionEl.textContent = data.caption; }
      updateStatus();
      requestAnimationFrame(() => slideEl.classList.add('visible'));
      animateProgress(slideDuration);
    };
    loader.onerror = () => {
      slideEl.src = 'assets/images/opening/placeholder.svg';
      slideEl.alt = 'スライド画像を読み込めませんでした';
      if(captionEl){ captionEl.textContent = data.caption; }
      updateStatus();
      animateProgress(slideDuration);
    };
    loader.src = encodeURI(data.src);
  }

  function scheduleNext(){
    clearTimeout(timer);
    timer = setTimeout(() => {
      current += 1;
      if(current >= totalSlides){
        goToMain();
        return;
      }
      showSlide(current);
      scheduleNext();
    }, slideDuration);
  }

  function startSequence(){
    showSlide(current);
    scheduleNext();
  }

  function skipSequence(){
    clearTimeout(timer);
    goToMain();
  }

  if(skipBtn){
    skipBtn.addEventListener('click', skipSequence);
  }

  document.addEventListener('keydown', (evt) => {
    if(evt.key === 'Enter' || evt.key === ' ' || evt.key === 'Escape'){
      evt.preventDefault();
      skipSequence();
    }
  });

  if(prefersReducedMotion.matches){
    animateProgress(slideDuration);
  }

  startSequence();
});
