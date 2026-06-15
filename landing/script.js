// Scroll reveal — fade elements in as they enter the viewport
(function () {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));

  // Subtle shadow on nav once scrolled
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) {
      nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.06)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
