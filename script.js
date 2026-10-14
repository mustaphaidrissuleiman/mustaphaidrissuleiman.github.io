/**
 * Mustapha Idris Suleiman — One-Page CV
 * Clean, minimal, zero-bloat script.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitch();
  initLagosClock();
  initEmailCopy();
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
