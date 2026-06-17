document.querySelectorAll('.bento-card').forEach((card) => {
  const media = card.querySelector('.bento-card-media');
  const cta = card.querySelector('.bento-card-cta');
  if (!media || !cta) return;

  function moveCta(clientX, clientY) {
    const cardRect = card.getBoundingClientRect();
    cta.style.left = `${clientX - cardRect.left}px`;
    cta.style.top = `${clientY - cardRect.top}px`;
  }

  media.addEventListener('mouseenter', (event) => {
    cta.classList.add('is-visible');
    moveCta(event.clientX, event.clientY);
  });

  media.addEventListener('mouseleave', () => {
    cta.classList.remove('is-visible');
  });

  media.addEventListener('mousemove', (event) => {
    moveCta(event.clientX, event.clientY);
  });
});
