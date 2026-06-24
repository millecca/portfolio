(function () {
  const blocks = document.querySelectorAll('[data-hero-video]');
  if (!blocks.length) return;

  blocks.forEach((block) => {
    const video = block.querySelector('.hero-video');
    if (!video) return;

    let isInView = false;
    let userPaused = false;

    function syncPlayback() {
      if (isInView && !userPaused) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
        return;
      }

      video.pause();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== block) return;
          isInView = entry.isIntersecting;
          syncPlayback();
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(block);

    video.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        syncPlayback();
        return;
      }

      userPaused = true;
      video.pause();
    });
  });
})();
