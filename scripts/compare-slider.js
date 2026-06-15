function initCompareSlider(slider) {
  const viewport = slider.querySelector('.compare-slider-viewport');
  const beforeWrap = slider.querySelector('.compare-slider-before');
  const beforeImg = beforeWrap.querySelector('img');
  const afterImg = slider.querySelector('.compare-slider-after');
  const handle = slider.querySelector('.compare-slider-handle');

  if (!viewport || !beforeWrap || !beforeImg || !afterImg || !handle) return;

  let position = Number(slider.dataset.start) || 50;
  let dragging = false;

  function syncBeforeImageWidth() {
    beforeImg.style.width = `${viewport.offsetWidth}px`;
    beforeImg.style.height = `${viewport.offsetHeight}px`;
  }

  function setPosition(percent) {
    position = Math.max(0, Math.min(100, percent));
    beforeWrap.style.width = `${position}%`;
    handle.style.left = `${position}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(position)));
  }

  function positionFromClientX(clientX) {
    const rect = viewport.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerDown(event) {
    dragging = true;
    viewport.setPointerCapture(event.pointerId);
    setPosition(positionFromClientX(event.clientX));
  }

  function onPointerMove(event) {
    if (!dragging) return;
    setPosition(positionFromClientX(event.clientX));
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'ArrowLeft') setPosition(position - 5);
    if (event.key === 'ArrowRight') setPosition(position + 5);
    if (event.key === 'Home') setPosition(0);
    if (event.key === 'End') setPosition(100);
  }

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);
  handle.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', syncBeforeImageWidth);

  afterImg.addEventListener('load', syncBeforeImageWidth);
  beforeImg.addEventListener('load', syncBeforeImageWidth);

  if (afterImg.complete) syncBeforeImageWidth();
  if (beforeImg.complete) syncBeforeImageWidth();

  setPosition(position);
}

document.querySelectorAll('[data-compare-slider]').forEach(initCompareSlider);
