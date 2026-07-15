(function () {
  const ICONS = {
    play:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z" fill="currentColor"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" fill="currentColor"/></svg>',
  };

  class ScreenDemoVideo {
    constructor(block) {
      this.block = block;
      this.frame = block.querySelector('.screen-demo-frame');
      this.video = block.querySelector('.screen-demo-video');
      if (!this.video || !this.frame) return;

      this.isInView = false;
      this.userPaused = false;
      this.isHovered = false;
      this.isClickAnimating = false;
      this.clickAnimTimer = null;

      this.createOverlay();
      this.bindEvents();

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== block) return;
            this.isInView = entry.isIntersecting;
            this.syncPlayback();
          });
        },
        { threshold: 0.25 }
      );

      this.observer.observe(block);
    }

    createOverlay() {
      this.controls = document.createElement('div');
      this.controls.className = 'screen-demo-controls';
      this.controls.setAttribute('aria-hidden', 'true');

      this.icon = document.createElement('div');
      this.icon.className = 'screen-demo-icon';
      this.controls.appendChild(this.icon);

      this.frame.appendChild(this.controls);
      this.setIcon();
    }

    getNextIcon() {
      return this.video.paused ? 'play' : 'pause';
    }

    setIcon() {
      this.icon.innerHTML = ICONS[this.getNextIcon()];
    }

    syncHoverIcon() {
      if (this.isClickAnimating || !this.isHovered) return;
      this.setIcon();
      this.frame.classList.add('is-hovered');
    }

    onMouseEnter() {
      this.isHovered = true;
      this.syncHoverIcon();
    }

    onMouseLeave() {
      this.isHovered = false;
      if (!this.isClickAnimating) {
        this.frame.classList.remove('is-hovered');
      }
    }

    onPlayStateChange() {
      if (this.isHovered && !this.isClickAnimating) {
        this.setIcon();
      }
    }

    playClickAnimation(action) {
      if (this.clickAnimTimer) {
        clearTimeout(this.clickAnimTimer);
      }

      this.isClickAnimating = true;
      this.frame.classList.remove('is-hovered');
      this.icon.classList.remove('is-click-animating', 'is-click-exit');
      this.icon.innerHTML = ICONS[action];

      void this.icon.offsetWidth;

      this.icon.classList.add('is-click-animating');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.icon.classList.add('is-click-exit');
        });
      });

      this.clickAnimTimer = setTimeout(() => {
        this.icon.classList.remove('is-click-animating', 'is-click-exit');
        this.isClickAnimating = false;
        this.clickAnimTimer = null;
        this.syncHoverIcon();
      }, 600);
    }

    syncPlayback() {
      if (this.isInView && !this.userPaused) {
        const playPromise = this.video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
        return;
      }

      this.video.pause();

      if (!this.isInView) {
        this.video.currentTime = 0;
      }
    }

    onClick() {
      let action;

      if (this.video.paused) {
        this.userPaused = false;
        this.syncPlayback();
        action = 'play';
      } else {
        this.userPaused = true;
        this.video.pause();
        action = 'pause';
      }

      this.playClickAnimation(action);
    }

    bindEvents() {
      this.block.addEventListener('mouseenter', () => this.onMouseEnter());
      this.block.addEventListener('mouseleave', () => this.onMouseLeave());
      this.video.addEventListener('click', () => this.onClick());
      this.video.addEventListener('play', () => this.onPlayStateChange());
      this.video.addEventListener('pause', () => this.onPlayStateChange());
    }
  }

  document.querySelectorAll('[data-screen-demo]').forEach((block) => {
    new ScreenDemoVideo(block);
  });
})();
