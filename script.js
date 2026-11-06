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
