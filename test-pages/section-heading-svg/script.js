const headings = document.querySelectorAll('.section-heading');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      entry.target.classList.add('is-painted');
      observer.unobserve(entry.target);
    }
  });
},{ threshold:0.5 });
headings.forEach(header => observer.observe(header));
