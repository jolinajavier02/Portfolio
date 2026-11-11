const mobileLayout = window.matchMedia('(max-width: 900px), (max-aspect-ratio: 0.95)');
const panels = [...document.querySelectorAll('.panel')];

// Use the supplied artwork when it is available, keeping a styled fallback otherwise.
document.querySelectorAll('[data-creator-image]').forEach((image) => {
  image.addEventListener('load', () => {
    image.hidden = false;
    image.parentElement.classList.add('has-image');
  });
  if (image.complete && image.naturalWidth) {
    image.hidden = false;
    image.parentElement.classList.add('has-image');
  }
});

function startReadingLayout() {
  document.documentElement.classList.add('ready');
  document.body.classList.add('ready-state', 'intro-done');
  document.querySelector('#loader').classList.add('is-done');
  const nav = document.querySelector('#panelNav');
  nav.replaceChildren();
  panels.forEach((panel, index) => {
    panel.id = `section-${panel.dataset.section.toLowerCase()}`;
    panel.classList.add('is-active');
    const link = document.createElement('a');
    link.href = `#${panel.id}`;
    link.textContent = panel.dataset.section;
    link.className = 'mobile-nav-link';
    nav.append(link);
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        [...nav.children].forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  panels.forEach((panel) => observer.observe(panel));
  document.querySelector('#brandBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelector('#termBtn').addEventListener('click', () => window.location.assign('https://terminal.jolinapjavier.com/'));
}

if (mobileLayout.matches) {
  startReadingLayout();
} else {
  try {
    await import('./app.js');
  } catch (error) {
    console.error('Animated portfolio unavailable; using reading layout.', error);
    document.documentElement.classList.add('reading-layout');
    startReadingLayout();
  }
}
// Reinitialize when crossing layouts, including phone rotation and desktop resizing.
mobileLayout.addEventListener('change', () => window.location.reload());
