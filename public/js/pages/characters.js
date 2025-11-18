(() => {
  const buttons = document.querySelectorAll('[data-profile-link]');
  const sections = Array.from(document.querySelectorAll('.character-profile'));

  const setActive = (targetId) => {
    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.profileLink === targetId);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.profileLink);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(btn.dataset.profileLink);
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(`#${entry.target.id}`);
        }
      });
    }, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
  }
})();
