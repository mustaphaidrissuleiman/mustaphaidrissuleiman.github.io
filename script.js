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
  setupCopy('copyEmailBtn', 'copyFeedback', 'mustaphaidrissuleiman@gmail.com');
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

  function onScroll() {
    const isScrolled = window.scrollY > 12;
    header.classList.toggle('is-scrolled', isScrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   5. Kinetic Text Preloader (Static Name + Upward Clock Timer Ticker)
   -------------------------------------------------------------------------- */
function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const ticker = document.getElementById('preloaderTicker');
  const logo = document.querySelector('.preloader-logo-wrap, .preloader-static-name');

  if (!preloader || !ticker) {
    if (onComplete) onComplete();
    return;
  }

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preloader.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  document.body.style.overflow = 'hidden';

  if (!window.gsap) {
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 2000);
    return;
  }

  const items = ticker.querySelectorAll('.ticker-item');
  const itemHeight = items.length > 0 ? items[0].offsetHeight : 30;
  const numSteps = items.length - 1; // 4 rolling transitions

  const tl = gsap.timeline({
    onComplete: () => {
      // Smooth curtain reveal upward
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });
    }
  });

  // Signature logo gentle fade-in at start
  if (logo) {
    tl.from(logo, {
      opacity: 0,
      y: 12,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  // Odometer/Clock timer rolling upward over ~2 seconds
  for (let i = 1; i <= numSteps; i++) {
    tl.to(ticker, {
      y: -i * itemHeight,
      duration: 0.32,
      ease: 'power3.inOut',
      delay: 0.18
    });
  }
}

/* --------------------------------------------------------------------------
   6. Horizontal & Vertical Text Animations (GSAP + ScrollTrigger + Fallback)
   -------------------------------------------------------------------------- */
function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // I. Hero Vertical Entrance (Page Load)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('header.top', {
        y: -24,
        opacity: 0,
        duration: 0.8,
        delay: 0.1
      })
      .from('.hero-content h1', {
        y: 45,
        opacity: 0,
        duration: 1.1
      }, '-=0.5')
      .from('.hero-lead, .hero-sub', {
        y: 25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9
      }, '-=0.7')
      .from('.hero-portrait-frame', {
        x: 40,
        opacity: 0,
        scale: 0.96,
        duration: 1.2
      }, '-=1.0');

    // II. Section Headings: Horizontal Slide-In from Left
    document.querySelectorAll('section > h2').forEach((heading) => {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        x: -40,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out'
      });
    });

    // III. Work & Writing Entries: Staggered Vertical Float Up
    document.querySelectorAll('#work, #writing').forEach((sec) => {
      const entries = sec.querySelectorAll('.entry');
      if (entries.length) {
        gsap.from(entries, {
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out'
        });
      }
    });

    // IV. About Monograph: Intro Reveal + Chapters Entrance (Tony Elumelu Style)
    const aboutIntro = document.querySelector('.monograph-intro');
    if (aboutIntro) {
      gsap.from('.monograph-intro .kicker, .monograph-intro .monograph-name, .monograph-lead p', {
        scrollTrigger: {
          trigger: aboutIntro,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power2.out'
      });
    }

    // Monograph Eras (Tony Elumelu style chapters)
    document.querySelectorAll('.monograph-era').forEach((era) => {
      const meta = era.querySelector('.era-meta');
      const body = era.querySelector('.era-body');

      if (meta) {
        gsap.from(meta, {
          scrollTrigger: {
            trigger: era,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: -30,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out'
        });
      }

      if (body) {
        gsap.from(body, {
          scrollTrigger: {
            trigger: era,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.95,
          delay: 0.1,
          ease: 'power2.out'
        });
      }
    });

    // V. Contact Section: Staggered Horizontal Slide-In
    const contactSec = document.querySelector('#contact');
    if (contactSec) {
      gsap.from('#contact .contact-line', {
        scrollTrigger: {
          trigger: contactSec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: -35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out'
      });

      gsap.from('#contact .social-list li', {
        scrollTrigger: {
          trigger: contactSec,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        x: -25,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power2.out'
      });
    }
  } else {
    // Zero-dependency IntersectionObserver fallback
    initIntersectionFallback();
  }
}

function initIntersectionFallback() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section > h2').forEach((el) => {
    el.classList.add('no-js-slide-left');
    observer.observe(el);
  });

  document.querySelectorAll('.entry, .contact-line, .monograph-era').forEach((el) => {
    el.classList.add('no-js-fade-up');
    observer.observe(el);
  });
}
