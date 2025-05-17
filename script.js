// ===== Main Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScrolling();
  initBackToTop();
  initNavHighlighter();
  initScrollAnimations();
});

// ===== 1. Smooth Scrolling =====
function initSmoothScrolling() {
  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (!target) return;

      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      history.pushState(null, null, targetId);
    });
  });
}

// ===== 2. Back to Top Button =====
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Return to top');
  document.body.appendChild(btn);

  const updateButtonVisibility = () => {
    const scrollPosition = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPosition / scrollHeight) * 100;

    btn.style.setProperty('--progress', scrollPercent);
    btn.classList.toggle('visible', scrollPosition > 300);
  };

  window.addEventListener('scroll', updateButtonVisibility);
  updateButtonVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== 3. Active Nav Highlighting =====
function initNavHighlighter() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').split('#')[1];
            link.classList.toggle('active', linkHref === id);
          });
        }
      });
    },
    {
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0.1
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ===== 4. Scroll Animations =====
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('[data-animate]');
  if (!animateElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animateElements.forEach(el => {
    const delay = el.style.getPropertyValue('--delay') || '0s';
    el.style.transitionDelay = delay;
    observer.observe(el);
  });
}
