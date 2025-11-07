/* opening.js
  Simple slideshow for Issue #002
  - looks for assets/images/opening/slide-01.png ... slide-05.png
  - shows each for 2000ms, fade transition
  - skip button moves to main.html
*/
(function(){
  const slideEl = document.getElementById('slide');
  const progressEl = document.getElementById('progress');
  const skipBtn = document.getElementById('skipBtn');

  const slides = [];
  // use SVG placeholders (slide-01.svg ... slide-05.svg)
  for (let i = 1; i <= 5; i++) {
    slides.push(`assets/images/opening/slide-0${i}.svg`);
  }

  let idx = 0;
  const interval = 2000;
  let timer = null;

  function setProgressDuration(ms) {
    progressEl.style.transition = `width ${ms}ms linear`;
  }

  function show(index) {
    const url = slides[index];
    slideEl.classList.remove('visible');
    // preload
    const img = new Image();
    img.onload = () => {
      slideEl.src = url;
      // restart progress
      requestAnimationFrame(() => {
        setProgressDuration(interval);
        progressEl.style.width = '100%';
        slideEl.classList.add('visible');
      });
    };
    img.onerror = () => {
      slideEl.src = 'assets/images/opening/placeholder.svg';
      setProgressDuration(interval);
      progressEl.style.width = '100%';
      slideEl.classList.add('visible');
    };
    img.src = url;
  }

  function next() {
    idx++;
    if (idx >= slides.length) {
      // finished -> go to main
      window.location.href = 'main.html';
      return;
    }
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    // allow CSS transition reset
    setTimeout(() => show(idx), 50);
  }

  function start() {
    show(idx);
    timer = setInterval(() => {
      next();
    }, interval);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  skipBtn.addEventListener('click', () => {
    window.location.href = 'main.html';
  });

  // keyboard controls: Space/Enter skip; Right -> next; Left -> prev
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      window.location.href = 'main.html';
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stopTimer();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stopTimer();
      idx = Math.max(0, idx - 1);
      progressEl.style.transition = 'none';
      progressEl.style.width = '0%';
      setTimeout(() => show(idx), 50);
    }
  });

  // start when DOM ready
  document.addEventListener('DOMContentLoaded', start);
})();
