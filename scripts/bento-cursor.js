document.querySelectorAll('.bento-card-media').forEach((media) => {
  const cta = media.querySelector('.bento-card-cta');
  if (!cta) return;

  media.addEventListener('mouseenter', () => {
    cta.classList.add('is-visible');
  });

  media.addEventListener('mouseleave', () => {
    cta.classList.remove('is-visible');
  });

  media.addEventListener('mousemove', (event) => {
    const rect = media.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cta.style.left = `${x}px`;
    cta.style.top = `${y}px`;
  });
});
