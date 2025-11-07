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
  // try to load up to 5 slides
  for(let i=1;i<=5;i++){
    slides.push(`assets/images/opening/slide-0${i}.png`);
  }

  let idx = 0;
  const interval = 2000;

  function show(index){
    const url = slides[index];
    slideEl.classList.remove('visible');
    // preload
    const img = new Image();
    img.onload = ()=>{
      slideEl.src = url;
      requestAnimationFrame(()=>{
        slideEl.classList.add('visible');
      });
    };
    img.onerror = ()=>{
      // fallback: use a low-contrast placeholder
      slideEl.src = 'assets/images/opening/placeholder.png';
      slideEl.classList.add('visible');
    };
    img.src = url;
    // progress bar
    progressEl.style.transitionDuration = interval + 'ms';
    progressEl.style.width = '100%';
  }

  function start(){
    show(idx);
    const timer = setInterval(()=>{
      idx++;
      if(idx>=slides.length){
        clearInterval(timer);
        // finished -> go to main
        window.location.href = 'main.html';
        return;
      }
      progressEl.style.width = '0%';
      // allow CSS transition reset
      setTimeout(()=>{
        show(idx);
      }, 100);
    }, interval);
  }

  skipBtn.addEventListener('click', ()=>{
    window.location.href = 'main.html';
  });

  // start when DOM ready
  document.addEventListener('DOMContentLoaded', start);
})();
