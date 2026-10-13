/**
 * Mustapha Idris Suleiman — Official Public Profile
 * Client Logic: Article Reader Modal, Lightbox, Lagos WAT Clock, Theme Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initLagosClock();
  initArticleReader();
  initPhotoArchive();
  initEmailCopy();
  initMobileNav();
});

/* ==========================================================================
   1. Theme Engine (Light / Dark with System Preference & LocalStorage)
   ========================================================================== */
function initThemeEngine() {
  const toggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  // Check saved preference or system default
  const savedTheme = localStorage.getItem('mis_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('mis_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0c0e0d' : '#faf8f5');
    }
  }

  // React to system theme change if not explicitly overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mis_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* ==========================================================================
   2. Live Lagos Time (West Africa Time — UTC+1)
   ========================================================================== */
function initLagosClock() {
  const clockDisplay = document.getElementById('clockDisplay');
  if (!clockDisplay) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const lagosTime = new Intl.DateTimeFormat('en-GB', options).format(new Date());
      clockDisplay.textContent = `${lagosTime} WAT`;
    } catch {
      // Fallback
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const watTime = new Date(utc + (3600000 * 1));
      const hours = String(watTime.getHours()).padStart(2, '0');
      const mins = String(watTime.getMinutes()).padStart(2, '0');
      clockDisplay.textContent = `${hours}:${mins} WAT`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. Authentic Article Archive & Modal Reader
   Full transcripts scraped & compiled from Mustapha's original publications
   ========================================================================== */
const ARTICLES_DATABASE = {
  'leadership-ai': {
    title: 'What Value Leaders Bring to Organizations in the AI Era',
    category: 'Executive Monograph',
    date: 'July 2026',
    source: 'Nigerian University of Technology and Management (NUTM) / LinkedIn',
    content: `
      <p class="dialog-lead">
        Artificial intelligence has evolved rapidly over the past few years. What began as simple chatbots 
        and recommendation systems has developed into powerful engines capable of drafting complex reports, 
        auditing financial statements, generating production software, and analyzing market signals with minimal human supervision.
      </p>

      <p>
        For generations, organizational leaders derived their authority because they possessed specialized information, 
        technical acumen, and procedural expertise that others did not. They were the individuals with the answers—the ones 
        teams relied upon for guidance and technical direction. Today, artificial intelligence has fundamentally disrupted that reality. 
        Access to synthesis, quantitative analysis, and tactical problem-solving is instantly accessible to anyone with an internet connection. 
        Consequently, the raw information advantage that leaders once leaned on is evaporating.
      </p>

      <h3>The Five Irreplaceable Functions of Leadership</h3>
      <p>
        This seismic shift does not diminish the imperative for leadership; rather, it unmasks what leadership has truly always been. 
        Leadership is fundamentally about people, judgment, and purpose. From an operational perspective, leadership rests on five foundational functions:
      </p>

      <ul>
        <li>
          <strong>1. Directing:</strong> Setting priority and deciding which problems merit institutional attention. 
          Every enterprise has finite capital, time, and human energy. While AI can analyze vast alternatives, 
          it cannot determine what aligns best with an organization’s mission, core values, and long-term societal role.
        </li>
        <li>
          <strong>2. Developing Talent:</strong> Leadership is not merely delegating work; it is cultivating human potential. 
          Mentoring individuals through setbacks, inspiring confidence, and identifying latent potential cannot be simulated by algorithms.
        </li>
        <li>
          <strong>3. Planning:</strong> Translating lofty aspirations into concrete milestones while coordinating across diverse horizons. 
          Crucially, planning requires securing deep emotional commitment from employees and external stakeholders.
        </li>
        <li>
          <strong>4. Organizing:</strong> Uniting individuals with disparate talents, dissolving inter-departmental friction, 
          and fostering genuine trust. Conflict resolution and team coherence remain stubborn, irreplaceable human responsibilities.
        </li>
        <li>
          <strong>5. Envisioning the Future:</strong> Great leaders look beyond existing balance sheets to imagine new possibilities. 
          While machine learning forecasts from historical precedent, vision originates from human values, courage, and moral ambition.
        </li>
      </ul>

      <blockquote>
        "AI replaces the routine analytical task, not the executive function. When computation becomes ubiquitous, 
        the premium on human courage, ethical judgment, and authentic empathy rises exponentially."
      </blockquote>

      <h3>The Mandate for the Next Decade</h3>
      <p>
        Before modern AI, leaders spent countless hours compiling summaries, crunching basic spreadsheets, and drafting updates. 
        As technology automates repetitive cognitive tasks, leaders must step up into higher-order judgment. 
        The leaders who will shape Africa and global industry in the next decade are not those who hoard answers, 
        but those who possess the moral clarity to ask the right questions, unite divided teams, and build institutions resilient enough to withstand uncertainty.
      </p>
    `
  },

  'livestock-economy': {
    title: 'Understanding the Livestock Economy (Part 1): Structure, Inputs & Value Chains',
    category: 'Agri-Economics',
    date: 'August 2026',
    source: 'Herdbase Africa Insights / LinkedIn',
    content: `
      <p class="dialog-lead">
        Across the African continent, livestock represents one of our most ubiquitous forms of store-of-wealth, 
        rural livelihood, and nutritional sovereignty. Yet, despite an estimated continental value exceeding $1.7 trillion, 
        the sector remains overwhelmingly informal, under-capitalized, and invisible to traditional financial institutions.
      </p>

      <h3>The Three Pillars of the Livestock Value Chain</h3>
      <p>
        To transform this critical economy, we must dissect its structure into three interconnected operational layers:
      </p>

      <ul>
        <li>
          <strong>1. Upstream Inputs:</strong> The foundations of animal productivity—genetics and breeding lines, 
          nutritional feedstocks, pasture management, and veterinary therapeutics. In Nigeria alone, seasonal feed scarcity 
          and preventable diseases cost pastoralists up to 30% of potential herd biomass annually.
        </li>
        <li>
          <strong>2. Midstream Production:</strong> The management of cattle, sheep, goats, and poultry across ranches, 
          semi-intensive holdings, and pastoral grazing routes. Historically, production records have existed exclusively 
          in the memories of farmers, rendering operations un-insurable and ineligible for commercial debt.
        </li>
        <li>
          <strong>3. Downstream Processing & Distribution:</strong> The transit, cold-chain logistics, abattoir operations, 
          and retail distribution channels delivering protein to Africa's rapidly urbanizing megacities (Lagos, Kano, Nairobi, Cairo).
        </li>
      </ul>

      <blockquote>
        "You cannot finance what you cannot measure, and you cannot improve what you do not record. 
        Systematizing individual animal records is the bridge between informal pastoralism and institutional capital."
      </blockquote>

      <h3>Why Digital Systems are the Catalyst</h3>
      <p>
        By giving farmers digital identity frameworks for each animal—capturing vaccination history, daily weight gains, 
        and parent lineage—we convert an invisible asset into a bankable, auditable instrument. 
        This is the core thesis behind Herdbase Africa.
      </p>
    `
  },

  'future-farming': {
    title: 'The Future of Livestock Farming Is Smarter Systems',
    category: 'Systems & Infrastructure',
    date: 'September 2026',
    source: 'Herdbase Africa Thought Leadership',
    content: `
      <p class="dialog-lead">
        For centuries, animal husbandry in sub-Saharan Africa relied on oral traditions, keen observation, 
        and informal networks. While these traditions sustained generations, they are facing unprecedented headwinds: 
        accelerating urban demand, climate variability, rising feed costs, and demographic pressure on land.
      </p>

      <p>
        When our team at Herdbase operated commercial livestock cycles in Katsina, we realized firsthand that hard work alone 
        is insufficient. Without real-time data on average daily gain (ADG), feed conversion ratios (FCR), and scheduled vaccination reminders, 
        even experienced livestock managers hemorrhage margin.
      </p>

      <h3>Moving from Intuition to Systematic SaaS</h3>
      <p>
        Modern livestock systems do not replace the wisdom of the herdsman; they augment it. 
        With Herdbase360, we have introduced species-specific parameters:
      </p>

      <ul>
        <li><strong>Automated Veterinary Triage:</strong> Timely notifications before endemic diseases spread through closed herds.</li>
        <li><strong>Feed & Mortality Optimization:</strong> Tracking batch performance across sheep, goats, cattle, and poultry.</li>
        <li><strong>Capital Visibility:</strong> Enabling external investors to inspect herd inventory, health audits, and balance sheets in real time.</li>
      </ul>

      <p>
        The future belongs to agricultural systems that pair the deep intimacy of field operations with modern software engineering. 
        Africa's livestock producers will no longer be left behind.
      </p>
    `
  },

  'hausa-ner-research': {
    title: 'Domain-Adapted Hausa Named Entity Recognition for Small Ruminant Production Systems',
    category: 'Peer Research',
    date: 'October 2026',
    source: 'University of Lagos (UNILAG) Faculty of Computer Science',
    content: `
      <p class="dialog-lead">
        Information regarding small-ruminant (sheep and goat) production across West Africa is predominantly 
        communicated in informal, unstructured Hausa text and audio. This linguistic barrier prevents millions of pastoralists 
        from integrating with automated digital records and veterinary advisory services.
      </p>

      <h3>Research Methodology & Supervised Fine-Tuning</h3>
      <p>
        Conducted under the academic supervision of Prof. V. T. Odumuyiwa at the University of Lagos, this research 
        constructed the first domain-adapted Named Entity Recognition (NER) architecture specifically tailored for agricultural Hausa:
      </p>

      <ul>
        <li>
          <strong>Corpus Construction:</strong> Curated and annotated a gold-standard benchmark of 2,000 sentences 
          (36,082 tokens and 8,568 named entity mentions).
        </li>
        <li>
          <strong>Semantic Schema:</strong> Established 10 essential agricultural entity classes:
          <code>ANIMAL_TYPE</code>, <code>BREED</code>, <code>QUANTITY</code>, <code>SYMPTOM</code>, <code>DISEASE</code>, 
          <code>MEDICATION</code>, <code>FEED_TYPE</code>, <code>DATE_TIME</code>, <code>LOCATION</code>, and <code>PERSONNEL</code>.
        </li>
        <li>
          <strong>Architecture:</strong> Fine-tuned the multilingual <strong>Afro-XLM-RoBERTa</strong> transformer 
          using BIO token classification and weighted cross-entropy loss.
        </li>
        <li>
          <strong>Conversational Deployment:</strong> Integrated entity extractions with a neuro-symbolic diagnostic chatbot, 
          allowing Hausa-speaking herdsmen to describe symptoms and receive verified veterinary guidance.
        </li>
      </ul>

      <blockquote>
        "Published model checkpoints are publicly hosted on Hugging Face at 
        <code>mustaphaidris/hausa-agri-ner-candidate</code>, providing a reusable foundation for African language agricultural AI."
      </blockquote>
    `
  }
};

function initArticleReader() {
  const modal = document.getElementById('articleModal');
  const triggers = document.querySelectorAll('.article-modal-trigger');
  const closeBtn = document.getElementById('closeArticleDialog');
  const footerCloseBtn = document.getElementById('closeArticleFooterBtn');

  const titleEl = document.getElementById('dialogArticleTitle');
  const categoryEl = document.getElementById('dialogArticleCategory');
  const dateEl = document.getElementById('dialogArticleDate');
  const sourceEl = document.getElementById('dialogArticleSource');
  const contentEl = document.getElementById('dialogArticleContent');

  if (!modal) return;

  // Open modal on trigger click
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = trigger.getAttribute('data-article-id');
      const article = ARTICLES_DATABASE[articleId];

      if (article) {
        titleEl.textContent = article.title;
        categoryEl.textContent = article.category;
        dateEl.textContent = article.date;
        sourceEl.textContent = article.source;
        contentEl.innerHTML = article.content;

        modal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close handlers
  const closeModal = () => {
    modal.close();
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // Modern Web Guidance fallback for light-dismiss on browsers without native closedby="any"
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    modal.addEventListener('click', (event) => {
      if (event.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) closeModal();
    });
  }
}

/* ==========================================================================
   4. Photo Archive & Lightbox System
   ========================================================================= */
function initPhotoArchive() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('dialogLightboxCaption');
  const closeBtn = document.getElementById('closeLightboxDialog');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  // Filter tabs
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  if (!lightbox || !lightboxImg) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-img-src');
      const caption = trigger.getAttribute('data-caption') || '';

      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;

      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.close();
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // Modern Web Guidance fallback for light dismiss
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    lightbox.addEventListener('click', (event) => {
      if (event.target !== lightbox) return;
      const rect = lightbox.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) closeLightbox();
    });
  }
}

/* ==========================================================================
   5. Email Copy Helper
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyText = document.getElementById('copyEmailText');
  const email = 'mustaphaidrissuleiman@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyText.textContent = 'Copied!';
      copyBtn.style.color = 'var(--accent-emerald-light)';
      setTimeout(() => {
        copyText.textContent = 'Copy';
        copyBtn.style.color = '';
      }, 2500);
    } catch {
      // Fallback
      copyText.textContent = 'Copied!';
      setTimeout(() => { copyText.textContent = 'Copy'; }, 2000);
    }
  });
}

/* ==========================================================================
   6. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('mobile-active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
