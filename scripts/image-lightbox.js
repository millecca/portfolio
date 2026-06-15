(function () {
  const ZOOMABLE_SELECTOR = '.img-block img[src], .work-card-img img[src]';

  let lightbox;
  let lightboxImg;
  let scrim;
  let closeBtn;

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button type="button" class="image-lightbox-close" aria-label="Close image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <div class="image-lightbox-scrim"></div>
      <figure class="image-lightbox-figure">
        <img class="image-lightbox-image" alt="" />
      </figure>
    `;

    document.body.appendChild(lightbox);

    lightboxImg = lightbox.querySelector('.image-lightbox-image');
    scrim = lightbox.querySelector('.image-lightbox-scrim');
    closeBtn = lightbox.querySelector('.image-lightbox-close');

    scrim.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', onKeyDown);
  }

  function openLightbox(img) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lightbox-open');
    document.body.classList.add('lightbox-open');

    closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lightbox-open');
    document.body.classList.remove('lightbox-open');

    window.setTimeout(() => {
      if (!lightbox.classList.contains('is-open')) {
        lightboxImg.removeAttribute('src');
      }
    }, 200);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  }

  function initZoomableImages() {
    document.querySelectorAll(ZOOMABLE_SELECTOR).forEach((img) => {
      img.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(img);
      });
    });
  }

  createLightbox();
  initZoomableImages();
})();
