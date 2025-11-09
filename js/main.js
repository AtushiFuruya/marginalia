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

  const revealElements = document.querySelectorAll('.js-scrollreveal');
  const revealMap = {
    '1': { delay:200, duration:800 },
    '2': { delay:250, duration:900 },
    '3': { delay:250, duration:900 },
    '4': { delay:150, duration:700 }
  };

  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const type = entry.target.getAttribute('data-reveal') || '1';
          const cfg = revealMap[type] || revealMap['1'];
          entry.target.style.transitionDuration = `${cfg.duration}ms`;
          entry.target.style.transitionDelay = `${cfg.delay}ms`;
          entry.target.classList.add('sr-active');
          observer.unobserve(entry.target);
        }
      });
    },{ threshold:0.2 });
    revealElements.forEach(el=>observer.observe(el));
  } else {
    revealElements.forEach(el=>el.classList.add('sr-active'));
  }
});
