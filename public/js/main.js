document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');

  const toggleMenu = () => {
    if(!hamburger || !nav) return;
    const willOpen = !hamburger.classList.contains('is-active');
    hamburger.classList.toggle('is-active', willOpen);
    hamburger.setAttribute('aria-expanded', String(willOpen));
    nav.classList.toggle('is-open', willOpen);
    nav.setAttribute('aria-hidden', String(!willOpen));
  };

  const closeMenu = () => {
    if(!hamburger || !nav) return;
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden','true');
  };

  if(hamburger){
    hamburger.addEventListener('click', toggleMenu);
  }

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', () => {
    if(!header) return;
    if(window.scrollY > 120){
      header.classList.add('scrolled');
    }else{
      header.classList.remove('scrolled');
    }
  });

  window.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
      closeMenu();
    }
  });

  const initScrollReveal = () => {
    if(typeof ScrollReveal === 'undefined') return;
    const sr = ScrollReveal();
    const base = {
      distance:'60px',
      duration:800,
      opacity:0,
      easing:'cubic-bezier(0.5, 0, 0, 1)',
      viewFactor:0.2,
      reset:false,
      mobile:true
    };

    const variants = {
      '1': { origin:'bottom', delay:200 },
      '2': { origin:'left', distance:'80px', delay:250 },
      '3': { origin:'right', distance:'80px', delay:250 },
      '4': { distance:'0px', scale:0.92, delay:150 }
    };

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const key = el.getAttribute('data-reveal') || '1';
      sr.reveal(el, { ...base, ...(variants[key] || {}) });
    });
  };

  initScrollReveal();

  class MemberSlider {
    constructor(root){
      this.root = root;
      this.viewport = root?.querySelector('.member-slider__viewport');
      this.track = root?.querySelector('.member-slider__track');
      this.prevBtn = root?.querySelector('[data-action="prev"]');
      this.nextBtn = root?.querySelector('[data-action="next"]');
      this.dots = Array.from(root?.querySelectorAll('.member-slider__dot') || []);
      this.originalSlides = Array.from(this.track?.querySelectorAll('.member-card') || []);
      this.logicalCount = this.originalSlides.length;
      this.slides = [];
      this.indexOffset = 1;
      this.currentIndex = 0;
      this.pendingLogical = null;
      this.timer = null;
      this.autoplayDelay = 5200;
      this.autoplayEnabled = root?.dataset.autoplay !== 'false';
      this.isEnabled = false;
      this.hasClones = false;
      this.metrics = {
        slideWidth:0,
        gap:0,
        paddingLeft:0,
        paddingRight:0,
        viewportWidth:0,
        totalWidth:0
      };
      this.handleResize = this.handleResize.bind(this);
      this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
      this.handleViewportResize = this.handleViewportResize.bind(this);
      this.init();
    }

    init(){
      if(!this.track || !this.viewport || !this.logicalCount) return;
      this.bindControls();
      window.addEventListener('resize', this.handleResize);
      if('ResizeObserver' in window){
        this.resizeObserver = new ResizeObserver(this.handleViewportResize);
        this.resizeObserver.observe(this.viewport);
      }
      this.root.addEventListener('mouseenter', ()=> this.stopAutoplay());
      this.root.addEventListener('mouseleave', ()=> this.startAutoplay());
      this.handleResize();
    }

    createClonesIfNeeded(){
      if(this.hasClones || this.logicalCount === 0) return;
      const first = this.originalSlides[0];
      const last = this.originalSlides[this.logicalCount - 1];
      if(!first || !last) return;
      const firstClone = first.cloneNode(true);
      const lastClone = last.cloneNode(true);
      [firstClone, lastClone].forEach(clone => {
        clone.classList.add('member-card--clone');
        clone.setAttribute('aria-hidden','true');
      });
      this.track.appendChild(firstClone);
      this.track.insertBefore(lastClone, first);
      this.slides = Array.from(this.track.children);
      this.hasClones = true;
      this.indexOffset = 1;
    }

    removeClones(){
      if(!this.hasClones) return;
      this.track.querySelectorAll('.member-card--clone').forEach(clone => clone.remove());
      this.hasClones = false;
      this.slides = Array.from(this.track.children);
      this.indexOffset = 0;
    }

    bindControls(){
      this.prevBtn?.addEventListener('click', ()=>{
        this.goToLogical(this.currentIndex - 1);
        this.resetAutoplay();
      });
      this.nextBtn?.addEventListener('click', ()=>{
        this.goToLogical(this.currentIndex + 1);
        this.resetAutoplay();
      });
      this.dots.forEach((dot,index)=>{
        dot.addEventListener('click', ()=>{
          this.goToLogical(index);
          this.resetAutoplay();
        });
      });
    }

    isMobile(){
      return window.matchMedia('(max-width: 767px)').matches;
    }

    handleResize(){
      if(this.isMobile()){
        this.disableSlider();
      }else{
        this.enableSlider();
      }
    }

    enableSlider(){
      if(this.isEnabled) return;
      this.createClonesIfNeeded();
      this.slides = this.slides.length ? this.slides : Array.from(this.track.children);
      if(!this.hasClones){
        // クローンが作れなかった場合はスライダー化できない
        return;
      }
      this.isEnabled = true;
      this.root.classList.add('is-slider-enabled');
      this.root.classList.remove('is-slider-disabled');
      this.track.addEventListener('transitionend', this.handleTransitionEnd);
      this.updateMetrics();
      this.jumpToLogical(this.currentIndex, false);
      this.startAutoplay();
      this.prevBtn?.removeAttribute('disabled');
      this.nextBtn?.removeAttribute('disabled');
    }

    disableSlider(){
      if(!this.isEnabled){
        this.root.classList.add('is-slider-disabled');
        this.root.classList.remove('is-slider-enabled');
        this.removeClones();
        this.slides = Array.from(this.track?.children || []);
        return;
      }
      this.isEnabled = false;
      this.track.removeEventListener('transitionend', this.handleTransitionEnd);
      this.stopAutoplay();
      this.track.style.transition = '';
      this.track.style.transform = '';
      this.root.classList.add('is-slider-disabled');
      this.root.classList.remove('is-slider-enabled');
      this.prevBtn?.setAttribute('disabled','true');
      this.nextBtn?.setAttribute('disabled','true');
      this.dots.forEach(dot => dot.classList.remove('is-active'));
      this.removeClones();
      this.slides = Array.from(this.track?.children || []);
    }

    handleViewportResize(){
      if(!this.isEnabled) return;
      this.updateMetrics();
      this.jumpToLogical(this.currentIndex, false);
    }

    updateMetrics(){
      if(!this.slides.length) return;
      const referenceSlide = this.slides[this.indexOffset];
      if(!referenceSlide) return;
      const slideRect = referenceSlide.getBoundingClientRect();
      const trackStyles = getComputedStyle(this.track);
      const viewportStyles = getComputedStyle(this.viewport);
      const gapValue = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
      const paddingLeft = parseFloat(viewportStyles.paddingLeft || '0');
      const paddingRight = parseFloat(viewportStyles.paddingRight || '0');
      const viewportWidth = this.viewport.getBoundingClientRect().width;
      const totalWidth = paddingLeft + paddingRight + (slideRect.width + gapValue) * this.slides.length - gapValue;
      this.metrics = {
        slideWidth:slideRect.width,
        gap:gapValue,
        paddingLeft,
        paddingRight,
        viewportWidth,
        totalWidth
      };
    }

    goToLogical(targetIndex){
      if(!this.isEnabled) return;
      if(targetIndex < 0){
        this.pendingLogical = this.logicalCount - 1;
        this.jumpToActual(0, true);
        return;
      }
      if(targetIndex >= this.logicalCount){
        this.pendingLogical = 0;
        this.jumpToActual(this.logicalCount + this.indexOffset, true);
        return;
      }
      this.pendingLogical = null;
      this.currentIndex = targetIndex;
      this.jumpToActual(targetIndex + this.indexOffset, true);
    }

    jumpToLogical(logicalIndex, animate){
      if(!this.logicalCount) return;
      this.currentIndex = ((logicalIndex % this.logicalCount)+this.logicalCount)%this.logicalCount;
      this.pendingLogical = null;
      this.jumpToActual(this.currentIndex + this.indexOffset, animate);
    }

    jumpToActual(actualIndex, animate){
      const offset = this.offsetFor(actualIndex);
      this.setTransform(offset, animate);
      this.updateDots(this.currentIndex);
    }

    offsetFor(actualIndex){
      const { slideWidth, gap, paddingLeft, viewportWidth, totalWidth } = this.metrics;
      const slideLeft = paddingLeft + actualIndex * (slideWidth + gap);
      const targetCenter = slideLeft + slideWidth / 2;
      const baseShift = viewportWidth > totalWidth ? -(viewportWidth - totalWidth)/2 : 0;
      return targetCenter - viewportWidth / 2 + baseShift;
    }

    setTransform(offset, animate){
      if(!this.track || Number.isNaN(offset)) return;
      if(!animate){
        this.track.style.transition = 'none';
        requestAnimationFrame(()=>{
          this.track.style.transform = `translateX(${-offset}px)`;
          requestAnimationFrame(()=> this.track.style.transition = '');
        });
      }else{
        this.track.style.transform = `translateX(${-offset}px)`;
      }
    }

    handleTransitionEnd(){
      if(this.pendingLogical === null) return;
      this.jumpToLogical(this.pendingLogical, false);
    }

    updateDots(activeIndex){
      this.dots.forEach((dot,index)=>{
        dot.classList.toggle('is-active', index === activeIndex);
      });
    }

    startAutoplay(){
      if(!this.autoplayEnabled || !this.isEnabled || this.logicalCount < 2) return;
      this.stopAutoplay();
      this.timer = window.setInterval(()=> this.goToLogical(this.currentIndex + 1), this.autoplayDelay);
    }

    stopAutoplay(){
      if(this.timer){
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    resetAutoplay(){
      if(!this.autoplayEnabled) return;
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  document.querySelectorAll('.member-slider').forEach(sliderEl => {
    new MemberSlider(sliderEl);
  });

  const initGalleryPreview = () => {
    const gallery = document.querySelector('[data-gallery]');
    if(!gallery) return;
    const previewImg = gallery.querySelector('[data-gallery-preview]');
    const captionEl = document.getElementById('gallery-preview-caption');
    const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumb'));

    const swap = (target) => {
      if(!previewImg || !target) return;
      const src = target.getAttribute('data-image');
      const alt = target.getAttribute('data-alt') || '';
      const caption = target.getAttribute('data-caption') || '';
      thumbs.forEach(btn => {
        btn.classList.toggle('is-active', btn === target);
        btn.removeAttribute('aria-current');
      });
      target.setAttribute('aria-current','true');
      previewImg.style.opacity = '0';
      window.requestAnimationFrame(()=>{
        previewImg.src = src || previewImg.src;
        previewImg.alt = alt;
        captionEl && (captionEl.textContent = caption);
        previewImg.style.opacity = '1';
      });
    };

    thumbs.forEach(btn => {
      btn.addEventListener('click', ()=> swap(btn));
    });
  };

  initGalleryPreview();

  const initLibraryModal = () => {
    const cards = document.querySelectorAll('.library-card');
    const modal = document.querySelector('[data-library-modal]');
    if(!cards.length || !modal) return;

    const body = document.body;
    const modalImage = modal.querySelector('[data-modal-image]');
    const modalLabel = modal.querySelector('[data-modal-label]');
    const modalStory = modal.querySelector('[data-modal-story]');
    const closeBtn = modal.querySelector('[data-modal-close]');

    const renderStory = (text) => {
      if(!modalStory) return;
      const fragments = (text || '').split('|').map(str => str.trim()).filter(Boolean);
      modalStory.innerHTML = fragments.map(fragment => `<p>${fragment}</p>`).join('');
    };

    const openModal = (card) => {
      const imageSrc = card.dataset.image;
      const label = card.dataset.label || '';
      const story = card.dataset.story || '';
      const img = card.querySelector('img');

      if(modalImage && imageSrc){
        modalImage.src = imageSrc;
        modalImage.alt = img?.getAttribute('alt') || '';
      }
      if(modalLabel){
        modalLabel.textContent = label;
      }
      renderStory(story);

      modal.classList.add('is-open');
      body.classList.add('modal-open');
      closeBtn?.focus();
      modal.setAttribute('aria-hidden','false');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      body.classList.remove('modal-open');
      modal.setAttribute('aria-hidden','true');
    };

    cards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

    closeBtn?.addEventListener('click', closeModal);
  };

  initLibraryModal();

});
