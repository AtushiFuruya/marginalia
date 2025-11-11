document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');

  if(navToggle && navList){
    const toggleMenu = () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('main-nav__list--open', !expanded);
    };
    navToggle.addEventListener('click', toggleMenu);
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded','false');
        navList.classList.remove('main-nav__list--open');
      });
    });
  }

  const newsletterForm = document.querySelector('.newsletter__form');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if(emailInput){
        emailInput.value = '';
      }
      alert('購読ありがとうございます。最新情報をお届けします。');
    });
  }
});
