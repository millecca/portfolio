(function () {
  const block = document.querySelector('[data-features-scroll]');
  if (!block) return;

  const driver = block.querySelector('.scroll-driver');
  const panels = block.querySelectorAll('[data-feature-panel]');
  const dots = block.querySelectorAll('.pagination-dots .dot');
  const featureText = block.querySelector('.feature-text');
  const featureTextContent = block.querySelector('.feature-text-content');
  const titleEl = block.querySelector('.features-scroll-chrome .h3');
  const descEl = block.querySelector('.features-scroll-chrome .body-sm');
  const numEl = block.querySelector('.features-scroll-chrome .feature-num');

  const features = [
    {
      num: '01',
      title: 'Detecting for new types of movements',
      desc: 'The original device only detected whether someone was standing, in bed, or on the ground. But most nursing home residents used mobility aids like walkers.',
    },
    {
      num: '02',
      title: 'Warning nurses about risky resident movement',
      desc: 'The original dashboard only alerted nurses about falls that had already happened. We introduced a lower-priority alert type focusing on potential falls.',
    },
    {
      num: '03',
      title: 'Adding patient notes and tags',
      desc: 'Nurses can add notes for clear communication on what care a resident needs. Tags give an at-a-glance look at a patient\'s fall risk.',
    },
    {
      num: '04',
      title: 'Keeping track of incident response times',
      desc: 'We introduced a timeline that shows exactly when a nurse entered the room after an incident, helping staff verify response times.',
    },
  ];

  const total = features.length;
  const MIN_SCROLL_HEIGHT = 760;

  block.style.setProperty('--feature-count', total);

  let activeIdx = 0;
  let isAnimating = false;
  let pendingIdx = null;
  let scrollLockIdx = null;
  let scrollMode = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function shouldUseScrollMode() {
    if (prefersReducedMotion()) return false;
    return window.innerHeight >= MIN_SCROLL_HEIGHT;
  }

  function getScrollMetrics() {
    const rect = driver.getBoundingClientRect();
    const scrollRange = driver.offsetHeight - window.innerHeight;
    const segmentSize = scrollRange > 0 ? scrollRange / total : 0;
    const driverDocTop = window.scrollY + rect.top;
    const scrolled = rect.top > 0 ? 0 : -rect.top;

    return { rect, scrollRange, segmentSize, driverDocTop, scrolled };
  }

  function indexFromScroll(scrolled, segmentSize) {
    if (segmentSize <= 0) return 0;
    return Math.min(total - 1, Math.max(0, Math.floor(scrolled / segmentSize)));
  }

  function setPanelState(idx) {
    panels.forEach((panel, i) => {
      const isActive = i === idx;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      const isActive = i === idx;
      dot.classList.toggle('active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function setStackPanelState() {
    panels.forEach((panel) => {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
    });
  }

  function setTextContent(idx) {
    const feature = features[idx];
    titleEl.textContent = feature.title;
    descEl.textContent = feature.desc;
    numEl.textContent = feature.num;
  }

  function setTitleDesc(idx) {
    const feature = features[idx];
    titleEl.textContent = feature.title;
    descEl.textContent = feature.desc;
  }

  function lockFeatureTextHeight() {
    if (!scrollMode || !featureText) return;

    const previousIdx = activeIdx;
    let maxHeight = 0;

    for (let i = 0; i < features.length; i++) {
      setTextContent(i);
      maxHeight = Math.max(maxHeight, featureText.offsetHeight);
    }

    setTextContent(previousIdx);
    featureText.style.height = `${maxHeight}px`;
  }

  function clearFeatureTextHeight() {
    if (!featureText) return;
    featureText.style.height = '';
  }

  function activate(idx) {
    if (!scrollMode || idx === activeIdx) return;

    if (isAnimating) {
      pendingIdx = idx;
      return;
    }

    isAnimating = true;
    numEl.textContent = features[idx].num;
    featureTextContent.classList.add('is-transitioning');

    window.setTimeout(() => {
      setPanelState(idx);
      setTitleDesc(idx);
      activeIdx = idx;
      featureTextContent.classList.remove('is-transitioning');

      window.setTimeout(() => {
        isAnimating = false;
        if (pendingIdx !== null && pendingIdx !== activeIdx) {
          const next = pendingIdx;
          pendingIdx = null;
          activate(next);
        } else {
          pendingIdx = null;
        }
      }, 150);
    }, 150);
  }

  function onScroll() {
    if (!scrollMode || scrollLockIdx !== null) return;

    const { rect, scrollRange, segmentSize, scrolled } = getScrollMetrics();

    if (rect.top > 0 || scrollRange <= 0) {
      activate(0);
      return;
    }

    activate(indexFromScroll(scrolled, segmentSize));
  }

  function scrollToFeature(idx) {
    if (!scrollMode) return;

    const { segmentSize, driverDocTop } = getScrollMetrics();
    if (segmentSize <= 0 || idx === activeIdx) return;

    const isAdjacent = Math.abs(idx - activeIdx) === 1;
    const targetTop = driverDocTop + idx * segmentSize + 1;

    if (!isAdjacent) {
      pendingIdx = null;
      isAnimating = false;
      featureTextContent.classList.remove('is-transitioning');
      scrollLockIdx = idx;

      window.scrollTo({ top: targetTop, behavior: 'auto' });
      activate(idx);

      window.setTimeout(() => {
        scrollLockIdx = null;
      }, 320);
      return;
    }

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  function enableStackMode() {
    scrollMode = false;
    pendingIdx = null;
    isAnimating = false;
    scrollLockIdx = null;
    activeIdx = 0;

    block.classList.remove('features-block--scroll');
    block.classList.add('features-block--stack');
    featureTextContent.classList.remove('is-transitioning');
    clearFeatureTextHeight();
    setStackPanelState();

    const scrollChrome = block.querySelector('.features-scroll-chrome');
    if (scrollChrome) scrollChrome.setAttribute('aria-hidden', 'true');

    block.querySelectorAll('.feature-item-text').forEach((el) => {
      el.removeAttribute('aria-hidden');
    });
  }

  function enableScrollMode() {
    scrollMode = true;

    block.classList.remove('features-block--stack');
    block.classList.add('features-block--scroll');

    const scrollChrome = block.querySelector('.features-scroll-chrome');
    if (scrollChrome) scrollChrome.setAttribute('aria-hidden', 'false');

    block.querySelectorAll('.feature-item-text').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });

    setTextContent(activeIdx);
    setPanelState(activeIdx);
    lockFeatureTextHeight();
    onScroll();
  }

  function updateMode() {
    const nextMode = shouldUseScrollMode();
    if (nextMode === scrollMode) return;

    if (nextMode) {
      enableScrollMode();
      return;
    }

    enableStackMode();
  }

  dots.forEach((dot, i) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to feature ${i + 1}`);

    dot.addEventListener('click', () => scrollToFeature(i));
    dot.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        scrollToFeature(i);
      }
    });
  });

  updateMode();
  window.addEventListener('resize', () => {
    updateMode();
    lockFeatureTextHeight();
  }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', updateMode);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(updateMode);
  }
})();
