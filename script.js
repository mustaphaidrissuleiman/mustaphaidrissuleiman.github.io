/**
 * Mustapha Idris Suleiman — Official Public Profile
 * Clean, minimal, zero-slop script.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitch();
  initLagosClock();
  initArticleReader();
  initPhotoArchive();
  initEmailCopy();
  initMobileNav();
});

/* --------------------------------------------------------------------------
   1. Theme Switch (Light / Dark)
   -------------------------------------------------------------------------- */
function initThemeSwitch() {
  const toggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const savedTheme = localStorage.getItem('mis_pref_theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = htmlEl.getAttribute('data-theme') || 'dark';
      const next = active === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('mis_pref_theme', next);
    });
  }

  function setTheme(t) {
    htmlEl.setAttribute('data-theme', t);
    if (metaTheme) {
      metaTheme.setAttribute('content', t === 'dark' ? '#0d0f0e' : '#faf9f6');
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mis_pref_theme')) {
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
        second: '2-digit',
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
   3. Curated Article Monograph Database & Modal Reader
   -------------------------------------------------------------------------- */
const ESSAYS = {
  'leadership-ai': {
    title: 'What Value Leaders Bring to Organizations in the AI Era',
    category: 'Leadership Monograph',
    date: 'July 2026',
    content: `
      <p>
        Artificial intelligence has evolved rapidly over the past few years. What began as simple chatbots and recommendation systems has developed into powerful engines capable of drafting complex reports, analyzing spreadsheets, and completing intricate tasks with little human intervention.
      </p>
      <p>
        For many years, leaders created value because they possessed information, technical experience, and procedural expertise that others did not. Today, AI has completely democratized that reality. Access to synthesis, quantitative analysis, and tactical problem-solving is no longer gated behind executive offices. Consequently, the raw technical advantage that leaders once leaned upon is diminishing.
      </p>
      <h3>The Five Irreplaceable Functions of Human Leadership</h3>
      <p>
        Rather than eliminating the need for leadership, AI reveals what leadership has always truly been about: people, judgment, and purpose. From an operational perspective, leadership rests upon five functions:
      </p>
      <ul>
        <li><strong>1. Directing:</strong> Deciding which problems merit institutional energy. With finite capital and time, only humans can discern which priorities align with the core mission and long-term societal vision.</li>
        <li><strong>2. Developing Talent:</strong> Mentoring colleagues, building resilience through adversity, and inspiring potential that algorithms cannot detect.</li>
        <li><strong>3. Planning:</strong> Translating vision into actionable milestones while earning the authentic trust and emotional commitment of teams.</li>
        <li><strong>4. Organizing:</strong> Uniting individuals across divergent backgrounds and resolving conflict. Coordination is technical; genuine cooperation is human.</li>
        <li><strong>5. Envisioning the Future:</strong> Recognizing possibilities unconstrained by historical training datasets. True vision stems from moral ambition and human conviction.</li>
      </ul>
      <blockquote>
        "AI replaces the routine analytical task, not the executive function. When intelligence becomes abundant, the premium on human courage, judgment, and trust rises exponentially."
      </blockquote>
      <p>
        The leaders who will define the coming decade across Africa and global enterprise are not those who pretend to hold all the answers, but those who ask the right questions, unite divided teams, and steer organizations through deep uncertainty.
      </p>
    `
  },

  'livestock-economy': {
    title: 'Understanding Emerging Market Economies: Structure, Inputs & Value Networks',
    category: 'Macroeconomics',
    date: 'August 2026',
    content: `
      <p>
        Across emerging markets, informal real-sector trade represents an economic titan exceeding $1.7 trillion. Yet across sub-Saharan Africa, vital value networks remain overwhelmingly informal, under-capitalized, and invisible to formal banking institutions.
      </p>
      <h3>The Three Structural Layers of the Value Chain</h3>
      <ul>
        <li><strong>1. Upstream Inputs:</strong> Genetic resources, specialized feedstocks, and biological inputs. In emerging production corridors, seasonal scarcity and preventable disease reduce biomass productivity significantly.</li>
        <li><strong>2. Midstream Production:</strong> Asset management across semi-intensive holdings and commercial operations. Because records historically existed only in personal notebooks or memory, operations remain un-insurable and cut off from debt financing.</li>
        <li><strong>3. Downstream Processing:</strong> Cold-chain transit, quality auditing, and retail distribution feeding Africa's rapidly growing urban hubs.</li>
      </ul>
      <blockquote>
        "You cannot finance what you cannot measure, and you cannot improve what you do not record. Systematic records convert invisible operational assets into bankable collateral."
      </blockquote>
      <p>
        By equipping producers with digital operating systems—recording vital metrics, parentage, and lifecycle data—enterprise platforms bridge informal trade with institutional capital.
      </p>
    `
  },

  'future-farming': {
    title: 'The Future of Industrial Operations Is Smarter Systems',
    category: 'Systems Architecture',
    date: 'September 2026',
    content: `
      <p>
        For generations, traditional operations relied on memory, sharp intuition, and informal networks. While these approaches sustained early growth, they are encountering unprecedented strain from demographic expansion, supply-chain shocks, and market volatility.
      </p>
      <p>
        Executing commercial operations on the ground proved that dedication alone is insufficient. Without real-time telemetry, automated alerting, and auditable metrics, enterprises bleed margin without knowing where capital was lost.
      </p>
      <h3>Systematic Augmentation</h3>
      <p>
        Modern software does not replace human domain expertise—it scales it. Through tailored enterprise workflows, we introduce:
      </p>
      <ul>
        <li><strong>Automated Telemetry & Alerts:</strong> Scheduled protocols that prevent costly failures before they compound.</li>
        <li><strong>Batch Unit Economics:</strong> Real-time margin and yield tracking across production units.</li>
        <li><strong>Investor & Syndicate Visibility:</strong> Auditable, real-time inventory and health reporting for external capital.</li>
      </ul>
      <p>
        The future belongs to systems that pair boots-on-the-ground operational empathy with uncompromising software engineering.
      </p>
    `
  },

  'hausa-ner-research': {
    title: 'Domain-Adapted Named Entity Recognition for Indigenous African Dialects',
    category: 'Computer Science',
    date: 'October 2026',
    content: `
      <p>
        Critical domain information across West Africa is overwhelmingly communicated in unstructured indigenous speech and text. This linguistic divide has historically excluded millions from modern automated systems and digital advisory platforms.
      </p>
      <h3>Research Methodology & Transformer Fine-Tuning</h3>
      <p>
        Conducted under the academic supervision of Prof. V. T. Odumuyiwa at the University of Lagos (Faculty of Computer Science):
      </p>
      <ul>
        <li><strong>Corpus Engineering:</strong> Curated and annotated a gold-standard benchmark of 2,000 sentences (36,082 tokens and 8,568 named entity mentions).</li>
        <li><strong>10 Semantic Classes:</strong> ANIMAL_TYPE, BREED, QUANTITY, SYMPTOM, DISEASE, MEDICATION, FEED_TYPE, DATE_TIME, LOCATION, and PERSONNEL.</li>
        <li><strong>Model Training:</strong> Fine-tuned the multilingual <strong>Afro-XLM-RoBERTa</strong> transformer using BIO token classification and weighted loss.</li>
        <li><strong>Conversational AI:</strong> Integrated entity extraction with conversational agents to deliver actionable advisory in indigenous languages.</li>
      </ul>
      <blockquote>
        "Trained model weights are published openly on Hugging Face: <code>mustaphaidris/hausa-agri-ner-candidate</code>."
      </blockquote>
    `
  }
};

function initArticleReader() {
  const dialog = document.getElementById('articleDialog');
  const triggers = document.querySelectorAll('.article-reader-trigger');
  const closeBtn = document.getElementById('closeArticleModal');
  const footerCloseBtn = document.getElementById('closeArticleModalFooter');

  const titleEl = document.getElementById('modalArticleTitle');
  const catEl = document.getElementById('modalCategory');
  const dateEl = document.getElementById('modalDate');
  const contentEl = document.getElementById('modalArticleContent');

  if (!dialog) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-article-id');
      const essay = ESSAYS[id];
      if (essay) {
        titleEl.textContent = essay.title;
        catEl.textContent = essay.category;
        dateEl.textContent = essay.date;
        contentEl.innerHTML = essay.content;

        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeReader = () => {
    dialog.close();
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeReader);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeReader);

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // Modern Web Guidance fallback for backdrop click
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInside) closeReader();
    });
  }
}

/* --------------------------------------------------------------------------
   4. Photo Archive & Lightbox
   -------------------------------------------------------------------------- */
function initPhotoArchive() {
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxActiveImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightbox');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  // Filter tabs
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.archive-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  if (!lightbox || !lightboxImg) return;

  triggers.forEach(trig => {
    trig.addEventListener('click', () => {
      const src = trig.getAttribute('data-src');
      const cap = trig.getAttribute('data-caption') || '';

      lightboxImg.src = src;
      lightboxImg.alt = cap;
      lightboxCap.textContent = cap;

      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const dismissLightbox = () => {
    lightbox.close();
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', dismissLightbox);

  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightbox) return;
      const rect = lightbox.getBoundingClientRect();
      const isInside = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInside) dismissLightbox();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Email Copy
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const btn = document.getElementById('copyEmailTrigger');
  const feedback = document.getElementById('copyFeedback');
  const email = 'mustaphaidrissuleiman@gmail.com';

  if (!btn || !feedback) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = 'Copied to Clipboard!';
      btn.style.color = 'var(--accent-brass)';
      btn.style.borderColor = 'var(--accent-brass)';
      setTimeout(() => {
        feedback.textContent = 'Copy Address';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2500);
    } catch {
      feedback.textContent = 'Copied!';
      setTimeout(() => { feedback.textContent = 'Copy Address'; }, 2000);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const nav = document.querySelector('.site-nav');
  const links = document.querySelectorAll('.nav-item');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
