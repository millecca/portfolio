function randomTilt() {
  const sign = Math.random() < 0.5 ? -1 : 1;
  const angle = 1 + Math.random();
  return sign * angle;
}

document.querySelectorAll('.steps-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.setProperty('--steps-card-tilt', `${randomTilt()}deg`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--steps-card-tilt', '0deg');
  });
});
