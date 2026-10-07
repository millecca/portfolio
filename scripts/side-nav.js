(function () {
  const navLinks = Array.from(document.querySelectorAll('.side-nav a[href^="#"]'));
  const sections = navLinks.flatMap((link) => {
    const href = link.getAttribute('href');
    const el = document.getElementById(href.slice(1));
    return el ? [{ href, el }] : [];
  });

  if (!sections.length) return;

  const topNavHeight = 56;

  function getActiveHref() {
    const scrollY = window.scrollY + topNavHeight + 40;
    let active = sections[0];
    for (const section of sections) {
      if (section.el.offsetTop <= scrollY) active = section;
    }
    return active.href;
  }

  function updateNav() {
    const activeHref = getActiveHref();
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeHref);
    });
  }

  const overviewLink = navLinks.find((link) => link.getAttribute('href') === '#overview');
  if (overviewLink) {
    overviewLink.addEventListener('click', (event) => {
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (location.hash !== '#overview') {
        history.pushState(null, '', '#overview');
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
