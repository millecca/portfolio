document.querySelectorAll('.bento-card').forEach((card) => {
  const target = card.classList.contains('next-case-study')
    ? card
    : card.querySelector('.bento-card-media');
  const cta = card.querySelector('.bento-card-cta');
  if (!target || !cta) return;

  function moveCta(clientX, clientY) {
    const cardRect = card.getBoundingClientRect();
    cta.style.left = `${clientX - cardRect.left}px`;
    cta.style.top = `${clientY - cardRect.top}px`;
  }

  target.addEventListener('mouseenter', (event) => {
    cta.classList.add('is-visible');
    moveCta(event.clientX, event.clientY);
  });

  target.addEventListener('mouseleave', () => {
    cta.classList.remove('is-visible');
  });

  target.addEventListener('mousemove', (event) => {
    moveCta(event.clientX, event.clientY);
  });
});
