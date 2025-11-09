document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];

  const closeMenu = () => {
    if(!hamburger || !nav) return;
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden','true');
  };

  const toggleMenu = () => {
    if(!hamburger || !nav) return;
    const willOpen = !hamburger.classList.contains('is-active');
    hamburger.classList.toggle('is-active', willOpen);
    hamburger.setAttribute('aria-expanded', String(willOpen));
    nav.classList.toggle('is-open', willOpen);
    nav.setAttribute('aria-hidden', String(!willOpen));
  };

  if(hamburger){
    hamburger.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href') || '';
      if(targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if(targetEl){
        event.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top:elementPosition - headerHeight,
          behavior:'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    if(!header) return;
    if(window.scrollY > 100){
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

  class CharacterSlider {
    constructor(root){
      this.root = root;
      this.track = root.querySelector('.character-slider__track');
      this.slides = Array.from(root.querySelectorAll('.character-slide'));
      this.navItems = Array.from(root.querySelectorAll('.character-slider__nav__item'));
      this.currentIndex = 0;
      this.timer = null;
      this.autoplayDelay = 5000;
      this.autoplay = root.dataset.autoplay !== 'false';
      this.init();
    }

    init(){
      if(!this.track || this.slides.length === 0) return;
      this.showSlide(0,false);
      this.navItems.forEach((btn,index)=>{
        btn.addEventListener('click', ()=>{
          this.showSlide(index);
          this.resetAutoplay();
        });
      });
      this.root.addEventListener('mouseenter', ()=> this.stopAutoplay());
      this.root.addEventListener('mouseleave', ()=> this.startAutoplay());
      window.addEventListener('resize', ()=> this.showSlide(this.currentIndex,false));
      this.startAutoplay();
    }

    getVisibleSlides(){
      const width = window.innerWidth;
      if(width >= 1024) return 3;
      if(width >= 768) return 2;
      return 1;
    }

    showSlide(index, animate=true){
      if(index < 0) index = this.slides.length - 1;
      if(index >= this.slides.length) index = 0;
      this.currentIndex = index;
      const visible = this.getVisibleSlides();
      const offset = -(index * (100 / visible));

      if(!animate){
        this.track.style.transition = 'none';
        requestAnimationFrame(()=>{
          this.track.style.transform = `translateX(${offset}%)`;
          requestAnimationFrame(()=>{ this.track.style.transition = ''; });
        });
      } else {
        this.track.style.transform = `translateX(${offset}%)`;
      }

      this.slides.forEach((slide,i)=>{
        slide.classList.toggle('is-active', i === index);
      });
      this.navItems.forEach((btn,i)=>{
        btn.classList.toggle('is-active', i === index);
      });
    }

    next(){
      this.showSlide(this.currentIndex + 1);
    }

    startAutoplay(){
      if(!this.autoplay) return;
      this.stopAutoplay();
      this.timer = window.setInterval(()=> this.next(), this.autoplayDelay);
    }

    stopAutoplay(){
      if(this.timer){
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    resetAutoplay(){
      if(!this.autoplay) return;
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  const characterSliderEl = document.querySelector('.character-slider');
  if(characterSliderEl){
    new CharacterSlider(characterSliderEl);
  }
});
