(function () {
  const blocks = document.querySelectorAll('[data-screen-demo]');
  if (!blocks.length) return;

  blocks.forEach((block) => {
    const video = block.querySelector('.screen-demo-video');
    if (!video) return;

    let isInView = false;
    let userPaused = false;

    function isContextVisible() {
      const hiddenAncestor = block.closest('[aria-hidden="true"]');
      return !hiddenAncestor;
    }

    function syncPlayback() {
      const inContext = isInView && isContextVisible();
      const canPlay = inContext && !userPaused;

      if (canPlay) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
        return;
      }

      video.pause();

      if (!inContext) {
        video.currentTime = 0;
      }
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

    const ariaObserver = new MutationObserver(syncPlayback);
    const panel = block.closest('[data-feature-panel]');
    if (panel) {
      ariaObserver.observe(panel, { attributes: true, attributeFilter: ['aria-hidden'] });
    }

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
