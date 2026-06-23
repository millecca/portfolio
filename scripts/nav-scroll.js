(function () {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const threshold = 8;

  function updateNav() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY <= 0) {
      nav.classList.remove('is-hidden');
    } else if (delta > threshold) {
      nav.classList.add('is-hidden');
    } else if (delta < -threshold) {
      nav.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();
