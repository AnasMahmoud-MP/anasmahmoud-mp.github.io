const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.querySelector('span').textContent = isOpen ? '×' : '+';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('span').textContent = '+';
    });
  });
}

const animatedTargets = document.querySelectorAll('.metric-card, .service-item, .case-stat-strip > div, .timeline-step, .proof-card, .abaq-shot, .study-row, .evidence-card, .process-step, .offer-card');
animatedTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('.footer p').forEach((element) => {
  element.textContent = `Performance marketing / ${new Date().getFullYear()}`;
});

const scrollProgress = document.querySelector('.scroll-progress');
const updateScrollProgress = () => {
  if (!scrollProgress) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-content img');
const lightboxCaption = lightbox?.querySelector('#lightbox-caption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxZoom = lightbox?.querySelector('.lightbox-zoom');
let lastFocusedElement = null;

const setLightboxZoom = (isZoomed) => {
  if (!lightbox || !lightboxZoom) return;

  lightbox.classList.toggle('is-zoomed', isZoomed);
  lightboxZoom.innerHTML = isZoomed ? 'Fit image <span aria-hidden="true">−</span>' : 'Zoom image <span aria-hidden="true">+</span>';
  lightboxZoom.setAttribute('aria-label', isZoomed ? 'Fit image to screen' : 'Zoom image');
  lightbox.scrollTo({ top: 0, left: 0 });
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  setLightboxZoom(false);
  lightboxImage.src = '';
  lightboxImage.alt = '';
  lightboxCaption.textContent = '';
  lastFocusedElement?.focus();
};

if (lightbox && lightboxImage && lightboxCaption && lightboxClose && lightboxZoom) {
  document.querySelectorAll('.expandable-image').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image) return;

      lastFocusedElement = button;
      setLightboxZoom(false);
      lightboxImage.onload = () => setLightboxZoom(lightboxImage.naturalWidth / lightboxImage.naturalHeight > 3);
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = button.dataset.caption || image.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightboxClose.focus();
    });
  });

  lightboxZoom.addEventListener('click', () => setLightboxZoom(!lightbox.classList.contains('is-zoomed')));
  lightboxImage.addEventListener('click', () => setLightboxZoom(!lightbox.classList.contains('is-zoomed')));
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

const portfolioGuide = document.querySelector('.portfolio-guide');

if (portfolioGuide) {
  const avatar = portfolioGuide.querySelector('.guide-avatar');
  const avatarLabel = portfolioGuide.querySelector('.guide-avatar-label');
  const bubble = portfolioGuide.querySelector('.guide-bubble');
  const kicker = portfolioGuide.querySelector('#guide-kicker');
  const title = portfolioGuide.querySelector('#guide-title');
  const message = portfolioGuide.querySelector('#guide-message');
  const progress = portfolioGuide.querySelector('.guide-progress');
  const progressBar = progress?.querySelector('i');
  const stepCount = portfolioGuide.querySelector('#guide-step-count');
  const inviteActions = portfolioGuide.querySelector('.guide-invite-actions');
  const tourActions = portfolioGuide.querySelector('.guide-tour-actions');
  const startButton = portfolioGuide.querySelector('[data-guide-start]');
  const skipButton = portfolioGuide.querySelector('[data-guide-skip]');
  const backButton = portfolioGuide.querySelector('[data-guide-back]');
  const nextButton = portfolioGuide.querySelector('[data-guide-next]');
  const exitButton = portfolioGuide.querySelector('[data-guide-exit]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stops = [
    { target: '#hero', kicker: '01 / Meet Anas', title: 'Paid media, shown through outcomes.', message: 'Start here: Anas builds and optimizes campaigns across Meta, Snapchat and TikTok—then makes the numbers easy to understand.' },
    { target: '#results', kicker: '02 / Results', title: 'The headline proof.', message: 'This snapshot brings the biggest outcomes forward: conversions, purchases, registrations and campaign return.' },
    { target: '#services', kicker: '03 / Services', title: 'What Anas can run.', message: 'From campaign setup and creative testing to optimization and reporting, these are the core paid-media capabilities.' },
    { target: '#work', kicker: '04 / Featured case', title: 'Abaq: problem to growth.', message: 'The featured case study shows the challenge, what changed, the result and the real campaign screenshots behind it.' },
    { target: '#clients', kicker: '05 / Client work', title: 'More brands. More outcomes.', message: 'These client stories show how the same performance mindset was applied across e-commerce, education and healthcare.' },
    { target: '#evidence', kicker: '06 / Campaign evidence', title: 'Open the proof.', message: 'Every campaign screenshot is clickable. Open any one to inspect the data at a larger size.' },
    { target: '#process', kicker: '07 / Process', title: 'A clear working rhythm.', message: 'Review, plan, run and report: four practical steps that keep decisions grounded in performance data.' },
    { target: '#work-with-me', kicker: '08 / Ways to work', title: 'Choose the right engagement.', message: 'You can bring Anas in for an audit, campaign management, a focused strategy sprint or ongoing support.' },
    { target: '#about', kicker: '09 / About', title: 'The operator behind the work.', message: 'A quick look at Anas’s working style: direct communication, active testing and attention to business outcomes.' },
    { target: '#faq', kicker: '10 / FAQ', title: 'Practical details, answered.', message: 'Platforms, markets, budgets, reporting and project setup are covered here before the first conversation.' },
    { target: '#contact', kicker: '11 / Contact', title: 'Tour complete. Let’s talk.', message: 'Call, WhatsApp, email or Instagram are all one tap away. Pick whichever contact method feels easiest.' }
  ];
  let currentIndex = 0;
  let isActive = false;
  let movementTimer = null;

  const readSession = (key) => {
    try { return window.sessionStorage.getItem(key); } catch (error) { return null; }
  };

  const writeSession = (key, value) => {
    try { window.sessionStorage.setItem(key, value); } catch (error) { /* Storage can be unavailable in private contexts. */ }
  };

  const setBubbleOpen = (isOpen) => {
    if (!avatar || !bubble) return;
    bubble.hidden = !isOpen;
    avatar.setAttribute('aria-expanded', String(isOpen));
  };

  const clearHighlight = () => {
    document.querySelector('.tour-highlight')?.classList.remove('tour-highlight');
  };

  const showInvitation = () => {
    if (!kicker || !title || !message || !inviteActions || !tourActions || !progress) return;
    kicker.textContent = 'Pixel portfolio tour';
    title.textContent = 'Want the quick guided run?';
    message.textContent = 'I can walk you through every section and point out the strongest campaign proof. You stay in control.';
    inviteActions.hidden = false;
    tourActions.hidden = true;
    progress.hidden = true;
    avatarLabel.textContent = 'Tour';
    setBubbleOpen(true);
  };

  const updateStop = () => {
    const stop = stops[currentIndex];
    const target = document.querySelector(stop.target);
    if (!target || !kicker || !title || !message || !stepCount || !progressBar || !backButton || !nextButton) return;

    clearHighlight();
    target.classList.add('tour-highlight');
    kicker.textContent = stop.kicker;
    title.textContent = stop.title;
    message.textContent = stop.message;
    stepCount.textContent = `${currentIndex + 1} / ${stops.length}`;
    progressBar.style.width = `${((currentIndex + 1) / stops.length) * 100}%`;
    backButton.disabled = currentIndex === 0;
    nextButton.textContent = currentIndex === stops.length - 1 ? 'Finish' : 'Next';
    avatarLabel.textContent = `${currentIndex + 1}/${stops.length}`;
    setBubbleOpen(true);

    portfolioGuide.classList.add('is-moving');
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.clearTimeout(movementTimer);
    movementTimer = window.setTimeout(() => portfolioGuide.classList.remove('is-moving'), reduceMotion ? 0 : 650);
  };

  const closeTour = () => {
    isActive = false;
    clearHighlight();
    document.body.classList.remove('guide-tour-active');
    avatarLabel.textContent = 'Tour';
    setBubbleOpen(false);
    writeSession('anas-portfolio-tour-seen', 'true');
  };

  const startTour = () => {
    if (!inviteActions || !tourActions || !progress) return;
    isActive = true;
    currentIndex = 0;
    document.body.classList.add('guide-tour-active');
    inviteActions.hidden = true;
    tourActions.hidden = false;
    progress.hidden = false;
    updateStop();
  };

  avatar?.addEventListener('click', () => {
    if (isActive) {
      setBubbleOpen(Boolean(bubble?.hidden));
    } else {
      showInvitation();
    }
  });

  startButton?.addEventListener('click', startTour);
  skipButton?.addEventListener('click', closeTour);
  backButton?.addEventListener('click', () => {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    updateStop();
  });
  nextButton?.addEventListener('click', () => {
    if (currentIndex === stops.length - 1) {
      closeTour();
      return;
    }
    currentIndex += 1;
    updateStop();
  });
  exitButton?.addEventListener('click', closeTour);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isActive) closeTour();
  });

  window.requestAnimationFrame(() => {
    portfolioGuide.classList.add('is-ready');
    if (readSession('anas-portfolio-tour-seen')) setBubbleOpen(false);
    else showInvitation();
  });
}
