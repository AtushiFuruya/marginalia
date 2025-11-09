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
});
