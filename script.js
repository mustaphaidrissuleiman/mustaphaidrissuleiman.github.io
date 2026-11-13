/**
 * Mustapha Idris Suleiman — Editorial Personal Site
 * Motion & Animation: Smooth Horizontal & Vertical Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pure editorial light theme
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.removeItem('mis_editorial_theme'); } catch (_) {}
  
  initEmailCopy();
  initActiveNav();
  initStickyHeader();
  initMobileMenu();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initPreloader(() => {
    initMotion();
  });
});

/* --------------------------------------------------------------------------
   1. Contact Copy Actions (Email & Phone)
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  setupCopy('copyEmailBtn', 'copyFeedback', 'mustapha@herdbaseafrica.com');
  setupCopy('copyPhoneBtn', 'copyPhoneFeedback', '+2348061651401');

  function setupCopy(btnId, feedbackId, text) {
    const btn = document.getElementById(btnId);
    const feedback = document.getElementById(feedbackId);
    if (!btn || !feedback) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text);
        feedback.textContent = 'Copied!';
        btn.style.borderColor = 'var(--ink)';
        btn.style.color = 'var(--ink)';
        setTimeout(() => {
          feedback.textContent = 'Copy';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch {
        feedback.textContent = 'Copied!';
        setTimeout(() => {
          feedback.textContent = 'Copy';
        }, 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Active Nav Highlighting on Scroll
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('main > section, .hero');
  const navLinks = document.querySelectorAll('header.top nav a');

  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('is-active', href === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   4. Sticky Header Border on Scroll
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('header.top');
  if (!header) return;

  let isScrolled = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset || 0;
    if (!isScrolled && y > 16) {
      isScrolled = true;
      header.classList.add('is-scrolled');
    } else if (isScrolled && y < 6) {
      isScrolled = false;
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   4b. Mobile Navigation Drawer & Hamburger Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !drawer) return;

  function toggleMenu(forceOpen) {
    const isCurrentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
    const nextOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

    toggle.setAttribute('aria-expanded', String(nextOpen));
    toggle.setAttribute('aria-label', nextOpen ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', nextOpen);
    drawer.setAttribute('aria-hidden', String(!nextOpen));
    document.body.style.overflow = nextOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link in the drawer
  drawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });

  // Auto-close if resized to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && drawer.classList.contains('is-open')) {
      toggleMenu(false);
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. Kinetic Text Preloader (High-Performance & Snappy)
   -------------------------------------------------------------------------- */
function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const ticker = document.getElementById('preloaderTicker');
  const logo = document.querySelector('.preloader-logo-wrap, .preloader-static-name');

  if (!preloader || !ticker) {
    if (onComplete) onComplete();
    return;
  }

  // Instant skip if reduced motion or already visited in this session
  const hasVisited = (() => {
    try { return sessionStorage.getItem('mis_visited_site') === '1'; } catch (_) { return false; }
  })();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasVisited) {
    preloader.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  try { sessionStorage.setItem('mis_visited_site', '1'); } catch (_) {}
  document.body.style.overflow = 'hidden';

  let isDismissed = false;
  const dismissPreloader = () => {
    if (isDismissed) return;
    isDismissed = true;
    if (window.gsap) gsap.killTweensOf([preloader, ticker.children, logo]);
    preloader.style.transition = 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    preloader.style.opacity = '0';
    preloader.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 450);
  };

  // Tap or click anywhere on the preloader to dismiss immediately
  preloader.addEventListener('click', dismissPreloader, { once: true });
  preloader.addEventListener('touchstart', dismissPreloader, { passive: true, once: true });

  if (!window.gsap) {
    setTimeout(dismissPreloader, 1400);
    return;
  }

  const items = ticker.querySelectorAll('.ticker-item');
  gsap.set(items, { opacity: 0, y: -14 });

  const isMobile = window.innerWidth <= 640;
  const tl = gsap.timeline({
    onComplete: dismissPreloader
  });

  // Snappy signature entrance
  if (logo) {
    tl.from(logo, {
      opacity: 0,
      scale: 0.97,
      duration: 0.35,
      ease: 'power2.out'
    });
  }

  // Snappy title cycle: total runtime ~2.2s (or ~1.8s on mobile)
  const enterDur = isMobile ? 0.22 : 0.28;
  const holdDur = isMobile ? 0.32 : 0.42;
  const exitDur = isMobile ? 0.18 : 0.22;

  items.forEach((item, index) => {
    tl.fromTo(item,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: enterDur, ease: 'power3.out' }
    );

    tl.to({}, { duration: holdDur });

    if (index < items.length - 1) {
      tl.to(item, {
        y: 14,
        opacity: 0,
        duration: exitDur,
        ease: 'power2.in'
      });
    }
  });

  tl.to({}, { duration: 0.2 });
}

/* --------------------------------------------------------------------------
   6. Clean, Stable Entrance Animations (Zero Scroll Jitter)
   -------------------------------------------------------------------------- */
function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (window.gsap) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Clean, gentle hero entrance on page load (NO transform on sticky header)
    heroTl
      .from('header.top', {
        opacity: 0,
        duration: 0.45
      })
      .from('.hero-kicker', {
        opacity: 0,
        y: 8,
        duration: 0.4
      }, '-=0.25')
      .from('.hero-content h1', {
        opacity: 0,
        y: 12,
        duration: 0.6
      }, '-=0.3')
      .from('.hero-sub', {
        opacity: 0,
        y: 8,
        stagger: 0.08,
        duration: 0.5
      }, '-=0.45')
      .from('.hero-portrait-frame', {
        opacity: 0,
        scale: 0.98,
        duration: 0.7
      }, '-=0.5');

    // All section text, headings, and cards remain rock-solid and stable on scroll.
    // No scroll-triggered jumps, popping text, or layout jitter.
  }
}
