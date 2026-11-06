/* Presentation shell; opening exploration remains unscored. */
(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const previous = document.querySelector('#previous-slide');
  const next = document.querySelector('#next-slide');
  const counter = document.querySelector('#slide-counter');
  const progress = document.querySelector('#slide-progress');
  const fill = document.querySelector('#progress-fill');
  const category = document.querySelector('#slide-category');
  const overview = document.querySelector('#slide-overview');
  const overviewLinks = document.querySelector('#overview-links');
  const motionToggle = document.querySelector('#motion-toggle');
  const motionLabel = document.querySelector('#motion-label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const categories = ['THE DEPARTURE', 'FOLLOW YOUR CURIOSITY', 'A WORLD OF POSSIBILITIES'];
  const scenes = window.TravelScenes;
  const journey = window.QuizJourney;
  let suitcaseOpen = false;
  let current = 0;
  let motionEnabled = !reducedMotion.matches;

  // Derive the available slide count from markup, so future slides extend the shell.
  progress.setAttribute('aria-valuemax', String(slides.length));
  const overviewButtons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'overview-link';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(slide.dataset.title));
    button.addEventListener('click', () => {
      overview.close();
      showSlide(index);
    });
    overviewLinks.append(button);
    return button;
  });

  function showSlide(index, { updateHistory = true, focus = true } = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
    if (journey && !journey.canEnter(index)) { journey.blocked(); return; }
    const direction = index >= current ? 1 : -1;
    const changed = index !== current;
    current = index;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.inert = !active;
      slide.classList.remove('is-entering');
      overviewButtons[slideIndex].removeAttribute('aria-current');
    });
    const active = slides[current];
    overviewButtons[current].setAttribute('aria-current', 'step');
    active.style.setProperty('--enter-offset', `${direction * 16}px`);
    if (changed && motionEnabled && !reducedMotion.matches) active.classList.add('is-entering');
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    next.hidden = next.disabled;
    document.querySelector('#restart-slides').hidden = !next.disabled;
    journey?.onSlide(active.id);
    scenes?.setSlide(active.id);
    next.replaceChildren(document.createTextNode(next.disabled ? 'Chapter complete' : 'Next '));
    if (!next.disabled) {
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      next.append(arrow);
    }
    counter.textContent = `Slide ${current + 1} of ${slides.length}`;
    category.textContent = categories[current] || 'YOUR JOURNEY';
    progress.setAttribute('aria-valuenow', String(current + 1));
    progress.setAttribute('aria-valuetext', counter.textContent);
    fill.style.width = `${((current + 1) / slides.length) * 100}%`;
    document.title = `${active.dataset.title} — The Travel Edit`;
    if (updateHistory && window.location.hash !== `#${active.id}`) {
      // Native history preserves browser Back/Forward without a router dependency.
      window.history.pushState(null, '', `#${active.id}`);
    }
    if (focus) {
      active.querySelector('h1, h2').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function restoreFromHash({ initial = false } = {}) {
    const index = slides.findIndex(slide => `#${slide.id}` === window.location.hash);
    // Non-slide anchors (including the skip link) must not reset the chapter.
    if (index < 0 && window.location.hash !== '' && !initial) return;
    showSlide(index < 0 || (journey && !journey.canEnter(index)) ? 0 : index, { updateHistory: false, focus: !initial });
  }

  previous.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));
  document.querySelector('#restart-slides').addEventListener('click', () => showSlide(0));
  document.querySelector('.brand').addEventListener('click', event => {
    event.preventDefault();
    showSlide(0);
  });
  window.addEventListener('popstate', () => restoreFromHash());
  window.addEventListener('hashchange', () => restoreFromHash());
  document.addEventListener('keydown', event => {
    if ([...document.querySelectorAll('dialog')].some(dialog => dialog.open) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('button, a, input, textarea, select, summary, [contenteditable="true"], [role="radio"]')) return;
    const destinations = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    showSlide(destinations[event.key]);
  });
  document.querySelector('#overview-open').addEventListener('click', () => overview.showModal());
  document.querySelector('#overview-close').addEventListener('click', () => overview.close());
  overview.addEventListener('click', event => {
    if (event.target !== overview) return;
    const bounds = overview.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) overview.close();
  });

  function renderMotion() {
    const enabled = motionEnabled && !reducedMotion.matches;
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    scenes?.setMotion(enabled);
    journey?.motion(enabled);
    motionToggle.setAttribute('aria-pressed', String(enabled));
    motionToggle.disabled = reducedMotion.matches;
    motionLabel.textContent = enabled ? 'Motion on' : 'Motion off';
    motionToggle.title = reducedMotion.matches ? 'Reduced motion is enabled in your system settings' : 'Turn slide transitions on or off';
  }
  motionToggle.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    renderMotion();
  });
  reducedMotion.addEventListener('change', () => {
    motionEnabled = !reducedMotion.matches;
    renderMotion();
  });

  function setSuitcaseOpen(open) {
    suitcaseOpen = open;
    scenes?.setSuitcaseOpen(open);
    const stage = document.querySelector('#suitcase-stage');
    stage.setAttribute('aria-pressed', String(open));
    stage.setAttribute('aria-label', open ? 'Close suitcase' : 'Open suitcase');
    document.querySelector('#suitcase-hint').textContent = open ? 'Click to close' : 'Click to unpack';
    document.querySelector('#hero-action').textContent = open ? 'Explore travel moods ↗' : 'Open my suitcase ↗';
    document.querySelector('#suitcase-status').textContent = open ? 'Curiosity packed. You’re ready to explore.' : 'Your next adventure is waiting.';
  }
  document.querySelector('#suitcase-stage').addEventListener('click', () => setSuitcaseOpen(!suitcaseOpen));
  document.querySelector('#hero-action').addEventListener('click', () => suitcaseOpen ? showSlide(1) : setSuitcaseOpen(true));
  document.querySelector('#rotate-left').addEventListener('click', () => {
    scenes?.rotateSuitcase(-1);
    document.querySelector('#suitcase-status').textContent = 'Turned left. Take a look at the details.';
  });
  document.querySelector('#rotate-right').addEventListener('click', () => {
    scenes?.rotateSuitcase(1);
    document.querySelector('#suitcase-status').textContent = 'Turned right. Take a look at the details.';
  });
  document.querySelector('#reset-view').addEventListener('click', () => {
    scenes?.resetView();
    document.querySelector('#suitcase-status').textContent = 'Back to the starting view.';
  });

  const stories = {
    structure: 'Your route is saved. There’s even time for a coffee stop.',
    discovery: 'A side street, a tiny bookshop, a story you didn’t plan.',
    downtime: 'A sea breeze and an afternoon with nowhere to rush.',
    food: 'Follow the smell of fresh coffee. Find your new favorite spot.'
  };
  const postcards = [...document.querySelectorAll('[data-preference]')];
  const continueButton = document.querySelector('#preference-continue');
  const preferenceMood = { structure: 1, discovery: 0, downtime: 2, food: 3 };
  let chosenMood = null;
  postcards.forEach(button => {
    button.addEventListener('click', () => {
      postcards.forEach(card => card.setAttribute('aria-pressed', String(card === button)));
      document.querySelector('#preference-text').textContent = stories[button.dataset.preference];
      scenes?.setPreference(button.dataset.modelChoice);
      chosenMood = preferenceMood[button.dataset.preference];
      continueButton.disabled = false;
      continueButton.textContent = 'Explore this mood ↗';
    });
  });
  const moods = [
    ['The scenic route', 'Leave a little room for the unexpected.'],
    ['A day well planned', 'Make a little plan. Leave a little space.'],
    ['Slow mornings', 'Sometimes, the best plan is to pause.'],
    ['A taste of somewhere', 'Find your next favorite at a local table.']
  ];
  let captionIndex = 0;
  function chooseMood(index) {
    captionIndex = index;
    document.querySelector('#mood-name').textContent = moods[index][0];
    document.querySelector('#mood-caption').textContent = moods[index][1];
    document.querySelector('#caption-count').textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    scenes?.setMood(index);
  }
  continueButton.addEventListener('click', () => {
    if (chosenMood === null) return;
    chooseMood(chosenMood);
    showSlide(2);
  });
  document.querySelector('#surprise-button').addEventListener('click', () => chooseMood((captionIndex + 1) % moods.length));

  journey?.connect({
    navigate: showSlide,
    refresh() { overviewButtons.forEach((button, index) => { button.disabled = !journey.canEnter(index); }); },
    setMotion(value) { motionEnabled = value; renderMotion(); }
  });
  renderMotion();
  restoreFromHash({ initial: true });
})();
