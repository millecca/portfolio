(function () {
  const block = document.querySelector('[data-features-scroll]');
  if (!block) return;

  const driver = block.querySelector('.scroll-driver');
  const panels = block.querySelectorAll('[data-feature-panel]');
  const dots = block.querySelectorAll('.pagination-dots .dot');
  const featureText = block.querySelector('.feature-text');
  const featureTextContent = block.querySelector('.feature-text-content');
  const titleEl = block.querySelector('.h3');
  const descEl = block.querySelector('.body-sm');
  const numEl = block.querySelector('.feature-num');

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
  block.style.setProperty('--feature-count', total);

  let activeIdx = 0;
  let isAnimating = false;
  let pendingIdx = null;

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
    const previousIdx = activeIdx;
    let maxHeight = 0;

    for (let i = 0; i < features.length; i++) {
      setTextContent(i);
      maxHeight = Math.max(maxHeight, featureText.offsetHeight);
    }

    setTextContent(previousIdx);
    featureText.style.height = `${maxHeight}px`;
  }

  function activate(idx) {
    if (idx === activeIdx) return;

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
    const rect = driver.getBoundingClientRect();
    const scrollRange = driver.offsetHeight - window.innerHeight;

    if (rect.top > 0 || scrollRange <= 0) {
      activate(0);
      return;
    }

    const scrolled = -rect.top;
    const segmentSize = scrollRange / total;
    const idx = Math.min(total - 1, Math.max(0, Math.floor(scrolled / segmentSize)));
    activate(idx);
  }

  setPanelState(0);
  lockFeatureTextHeight();
  window.addEventListener('resize', lockFeatureTextHeight, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
