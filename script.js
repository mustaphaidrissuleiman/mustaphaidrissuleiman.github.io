/**
 * Mustapha Idris Suleiman — One-Page CV
 * Clean, minimal, zero-bloat script.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitch();
  initStickyHeader();
  initLagosClock();
  initEmailCopy();
  initComponentTabs();
});

/* --------------------------------------------------------------------------
   1. Theme Switch (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeSwitch() {
  const toggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const savedTheme = localStorage.getItem('mis_cv_theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = htmlEl.getAttribute('data-theme') || 'dark';
      const next = active === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('mis_cv_theme', next);
    });
  }

  function setTheme(t) {
    htmlEl.setAttribute('data-theme', t);
    if (metaTheme) {
      metaTheme.setAttribute('content', t === 'dark' ? '#111111' : '#ffffff');
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mis_cv_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* --------------------------------------------------------------------------
   Sticky Header on Scroll (Frozen Identity Bar)
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.cv-header');
  if (!header) return;

  function onScroll() {
    const isScrolled = window.scrollY > 8;
    header.classList.toggle('is-scrolled', isScrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Real-Time Lagos Time (WAT)
   -------------------------------------------------------------------------- */
function initLagosClock() {
  const clockEl = document.getElementById('lagosClock');
  if (!clockEl) return;

  function tick() {
    try {
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
      clockEl.textContent = `${timeStr} WAT`;
    } catch {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wat = new Date(utc + 3600000);
      const h = String(wat.getHours()).padStart(2, '0');
      const m = String(wat.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${h}:${m} WAT`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------------
   3. Contact Copy Actions (Email & Phone)
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
        btn.style.borderColor = 'var(--text-primary)';
        setTimeout(() => {
          feedback.textContent = 'Copy';
          btn.style.borderColor = '';
        }, 2000);
      } catch {
        feedback.textContent = 'Copied!';
        setTimeout(() => { feedback.textContent = 'Copy'; }, 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Component Tabs Navigation
   -------------------------------------------------------------------------- */
function initComponentTabs() {
  const tabsNav = document.querySelector('.cv-tabs-nav');
  const tabsList = document.getElementById('cvTabsList');
  const glider = document.getElementById('cvTabGlider');
  const tabButtons = document.querySelectorAll('.cv-tab');
  const tabPanelsContainer = document.getElementById('tabPanelsContainer');
  const tabPanels = document.querySelectorAll('.cv-tabpanel');

  if (!tabButtons.length || !tabPanels.length) return;

  // Sync articles count badge if needed
  const articlesCount = document.querySelectorAll('#articles .cv-row').length;
  const articlesBadge = document.getElementById('articlesBadge');
  if (articlesBadge && articlesCount > 0) {
    articlesBadge.textContent = articlesCount;
  }

  function updateGlider(targetBtn, animate = true) {
    if (!glider || !targetBtn || !tabsList) return;

    if (!animate) {
      glider.style.transition = 'none';
    } else {
      glider.style.transition = '';
    }

    const left = targetBtn.offsetLeft;
    const top = targetBtn.offsetTop;
    const width = targetBtn.offsetWidth;
    const height = targetBtn.offsetHeight;

    glider.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    glider.style.width = `${width}px`;
    glider.style.height = `${height}px`;
    glider.style.opacity = '1';

    if (!tabsList.classList.contains('has-glider')) {
      tabsList.classList.add('has-glider');
    }
  }

  function activateTab(tabId, updateHash = true, scrollIntoView = false) {
    const isAll = tabId === 'all';
    let targetBtn = null;

    tabButtons.forEach((btn) => {
      const match = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
      btn.setAttribute('tabindex', match ? '0' : '-1');
      if (match) targetBtn = btn;
    });

    if (targetBtn) {
      updateGlider(targetBtn, true);
    }

    if (tabPanelsContainer) {
      tabPanelsContainer.classList.toggle('show-all', isAll);
    }

    tabPanels.forEach((panel) => {
      if (isAll) {
        panel.hidden = false;
        panel.classList.add('is-active');
      } else {
        const match = panel.id === `tab-${tabId}`;
        panel.hidden = !match;
        panel.classList.toggle('is-active', match);
      }
    });

    if (updateHash) {
      if (isAll) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        history.replaceState(null, '', `#${tabId}`);
      }
    }

    if (scrollIntoView) {
      const header = document.querySelector('.cv-header');
      const headerHeight = header ? header.offsetHeight : 130;
      const panelsTop = tabPanelsContainer ? tabPanelsContainer.offsetTop : 200;
      if (window.scrollY > panelsTop - headerHeight) {
        window.scrollTo({
          top: Math.max(0, panelsTop - headerHeight - 8),
          behavior: 'smooth'
        });
      }
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      activateTab(tabId, true, true);
    });

    btn.addEventListener('keydown', (e) => {
      const tabsArray = Array.from(tabButtons);
      const currentIndex = tabsArray.indexOf(btn);
      let nextIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabsArray.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabsArray.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextBtn = tabsArray[nextIndex];
        nextBtn.focus();
        activateTab(nextBtn.getAttribute('data-tab'), true, false);
      }
    });
  });

  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.cv-tab.is-active');
    if (activeBtn) updateGlider(activeBtn, false);
  });

  // Handle URL hash changes or initial hash
  function handleHash() {
    const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
    const aliasMap = {
      'research-projects': 'projects',
      'credentials': 'education',
      'memberships': 'education'
    };
    const target = aliasMap[rawHash] || rawHash;
    const validTabs = ['experience', 'projects', 'articles', 'skills', 'education', 'contact', 'all'];

    if (validTabs.includes(target)) {
      activateTab(target, false, false);
    } else {
      activateTab('experience', false, false);
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Initial glider placement without transition
  requestAnimationFrame(() => {
    const initialBtn = document.querySelector('.cv-tab.is-active') || tabButtons[0];
    if (initialBtn) {
      updateGlider(initialBtn, false);
    }
  });
}

