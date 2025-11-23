document.addEventListener('DOMContentLoaded', () => {
  // インタラクションデモ用
  const allControls = document.querySelectorAll('.member-slider__controls');

  allControls.forEach(controls => {
    const prevBtn = controls.querySelector('[data-action="prev"]');
    const nextBtn = controls.querySelector('[data-action="next"]');
    const dots = Array.from(controls.querySelectorAll('.member-slider__dot'));
    let currentIndex = 0;

    const updateDots = (index) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + dots.length) % dots.length;
        updateDots(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % dots.length;
        updateDots(currentIndex);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateDots(currentIndex);
      });
    });
  });

  console.log('Slider controls test page loaded. Click arrows and dots to test interactions.');
});
