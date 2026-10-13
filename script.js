/**
 * MUSTAPHA IDRIS SULEIMAN — PORTFOLIO CLIENT JAVASCRIPT
 * Modern vanilla JS for theme management, interactive terminal, project modal, filters & contact form
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. THEME MANAGEMENT (Light / Dark / System)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('mustapha_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('mustapha_theme', theme);
  };

  // Initial theme set
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme} mode`);
    });
  }

  // React to system changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mustapha_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================
  // 2. MOBILE NAVIGATION MENU
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 3. COPY EMAIL TO CLIPBOARD & TOAST
  // ==========================================
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.copy-email-btn, .copy-small-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'mustapha5th@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard!`);
      } catch (err) {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied ${email} to clipboard!`);
      }
    });
  });

  // ==========================================
  // 4. PROJECT FILTERING TABS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ==========================================
  // 5. INTERACTIVE TERMINAL PLAYGROUND
  // ==========================================
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termChips = document.querySelectorAll('.term-chip');

  const COMMANDS = {
    help: `Available commands:
  • whoami    : Learn about Mustapha Idris Suleiman
  • projects  : List key production Agri-Tech & AI systems
  • skills    : View technical & agronomic stack
  • impact    : Quantified agricultural & AI reach
  • contact   : Get in touch & social links
  • date      : Current local time in Lagos, Nigeria
  • clear     : Clear terminal history`,

    whoami: `Mustapha Idris Suleiman
Role: Techno Farmer • CEO @ Herdbase Africa • AI & NLP Researcher
Location: Lagos State & Kano State, Nigeria
Specialization: Low-resource African NLP (Hausa), Multimodal Agricultural AI, and high-load livestock ERP systems.`,

    projects: `Flagship Systems:
1. CropScan      - Multimodal AI leaf diagnosis on Cassava, Maize, Yam, Tomato (React 19 + Gemini).
2. Herdbase360   - Distributed livestock ERP & veterinary platform (Laravel 11 + Vue 3).
3. Hausa Chatbot - Small-ruminant veterinary advisor for sheep/goats (Afro-XLM-RoBERTa + FAO).
4. Hausa NER     - Named entity recognition for low-resource agricultural Hausa dialects.
5. Livestock Ec. - Value chain research mapping Africa's $1.7T livestock economy.`,

    skills: `Technical Stack:
• AI / NLP: PyTorch, Transformers, Afro-XLM-RoBERTa, Gemini Vision, NER BIO Tagging.
• Backend:  Laravel 11 (PHP 8.3), Python (FastAPI), MySQL, SQLite, Queue Architecture.
• Frontend: React 19, Vue.js 3, TypeScript, Leaflet Maps, Modern Responsive CSS.
• Domain:   FAO Animal Production, Small-Ruminant Pathology, Crop Disease Management.`,

    impact: `Quantified Scope:
• 55M+ Cattle & 200M+ Sheep/Goats in Nigerian market ecosystem addressed.
• 4 Crops targeted with real-time AI computer vision diagnostics.
• 1st dedicated Hausa agricultural token classification candidate model on Hugging Face.`,

    contact: `Reach Out:
• Email:    mustapha5th@gmail.com
• GitHub:   https://github.com/mustaphaidrissuleiman
• HF Hub:   https://huggingface.co/mustaphaidris
• Location: Lagos & Northern Nigeria Agricultural Hubs`,

    date: () => {
      const now = new Date();
      return `Lagos (WAT, GMT+1): ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`;
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    // Append Command Echo
    const entryDiv = document.createElement('div');
    entryDiv.className = 'term-entry';

    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-cmd-echo';
    echoDiv.textContent = `mustapha@nigeria:~$ ${rawCmd}`;
    entryDiv.appendChild(echoDiv);

    // Compute Output
    let outputText = '';
    if (COMMANDS[cmd]) {
      outputText = typeof COMMANDS[cmd] === 'function' ? COMMANDS[cmd]() : COMMANDS[cmd];
    } else {
      outputText = `zsh: command not found: ${rawCmd}. Type 'help' for valid commands.`;
    }

    const outDiv = document.createElement('div');
    outDiv.className = 'term-output';
    outDiv.textContent = outputText;
    entryDiv.appendChild(outDiv);

    terminalOutput.appendChild(entryDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  termChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // Run initial welcome command
  setTimeout(() => {
    executeCommand('whoami');
  }, 400);

  // ==========================================
  // 6. PROJECT DEEP DIVE MODAL
  // ==========================================
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const PROJECT_DETAILS = {
    cropscan: {
      title: "CropScan — Multimodal AI Agronomist",
      category: "Computer Vision & Agricultural Health",
      content: `
        <p><strong>System Objective:</strong> Empower smallholder farmers across Nigeria to diagnose crop pathology instantly using mobile phone photography, eliminating the barrier of expensive agronomist field visits.</p>

        <div class="modal-diagram-box">
[Mobile Camera Viewfinder]
         │
         ▼
[Image Preprocessing & Compression]
         │
         ▼
[Google Gemini Multimodal Vision API] ──► [Structured JSON Diagnosis]
                                                │
                                                ├─► Disease: Cassava Mosaic Virus (94%)
                                                ├─► Risk Level: HIGH
                                                └─► Step-by-Step Pruning & Spray Plan
         │
         ▼
[Leaflet Map Integration] ──► Verified Agrochemical Input Dealers in Oyo State
        </div>

        <h4>Key Technical Highlights:</h4>
        <ul style="padding-left: 1.25rem;">
          <li>Target Crops: Cassava, Maize, Yam, and Tomato.</li>
          <li>Real-time leaf framing heuristics with adaptive lighting cues.</li>
          <li>Integrated with OpenStreetMap & Leaflet for input dealer geolocation.</li>
          <li>Built with React 19, TypeScript, and responsive editorial CSS.</li>
        </ul>
      `
    },

    herdbase360: {
      title: "Herdbase360 — Livestock Enterprise SaaS",
      category: "Full-Stack Distributed System",
      content: `
        <p><strong>System Objective:</strong> Digitize commercial and pastoral livestock management across Nigeria, tracking herd genetics, vaccination schedules, feed rations, and meat value chains.</p>

        <div class="modal-diagram-box">
[Vue.js Web Portal]     [Vue Backoffice Admin]     [Mobile Progressive App]
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                   [Laravel 11 RESTful Microservice]
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
     [MySQL / SQLite Relational]             [Async Queue Workers]
     (Animal ID, Lineage, Health)            (Automated Alerts & Sync)
        </div>

        <h4>Key Technical Highlights:</h4>
        <ul style="padding-left: 1.25rem;">
          <li>Multi-species architecture supporting Cattle, Sheep, Goats, Poultry, and Aquaculture.</li>
          <li>Pedigree lineage and reproduction cycle management.</li>
          <li>Automated veterinary withdrawal period enforcement before slaughter.</li>
          <li>Tailored for offline resilience and low-bandwidth environments.</li>
        </ul>
      `
    },

    'hausa-chatbot': {
      title: "Hausa Small-Ruminant Farming Chatbot",
      category: "Low-Resource African Language NLP",
      content: `
        <p><strong>System Objective:</strong> Provide an intelligent conversational interface for smallholder sheep (*tumaki*) and goat (*awaki*) farmers in their native Hausa dialect, bridging the gap between clinical veterinary standards and indigenous pastoral practices.</p>

        <div class="modal-diagram-box">
[Hausa User Query] ("Awakiyata ba ta cin abinci kuma tana gudawa")
         │
         ▼
[Dialectal Normalization & Intent Classifier]
         │
         ▼
[Afro-XLM-RoBERTa Token Classification] ──► Entities: SYMPTOM(kin cin abinci), SYMPTOM(gudawa)
         │
         ▼
[FAO Knowledge Base Retrieval] ──► Contextual First-Aid Veterinary Response in Hausa
        </div>

        <h4>Key Technical Highlights:</h4>
        <ul style="padding-left: 1.25rem;">
          <li>Strict ethical boundaries: gracefully triages non-ruminant or human health queries as out of scope.</li>
          <li>Handles code-switched Hausa-English agricultural terminology.</li>
          <li>Gradio interactive sandbox with Gradio 6 and Hugging Face Transformers.</li>
        </ul>
      `
    },

    'hausa-ner': {
      title: "Hausa Agri-NER Candidate Model",
      category: "Named Entity Recognition & PyTorch",
      content: `
        <p><strong>System Objective:</strong> Train and open-source a domain-specific token classification model capable of extracting livestock symptoms, species, medications, and agricultural terms from unformatted text.</p>

        <div class="modal-diagram-box">
Base Checkpoint: Davlan/afro-xlmr-base (Multilingual African representation)
                      │
                      ▼
Fine-Tuning Data: Annotated Hausa Small-Ruminant & Agricultural Corpus
                      │
                      ▼
Model Checkpoint: mustaphaidris/hausa-agri-ner-candidate
                      │
                      ▼
Subword Boundary Merging & Word-Span Alignment Pipeline
        </div>

        <h4>Key Technical Highlights:</h4>
        <ul style="padding-left: 1.25rem;">
          <li>BIO tagging scheme specifically optimized for animal husbandry entities.</li>
          <li>Robust handling of Hausa hooked consonants (ɓ, ɗ, ƙ) and apostrophes.</li>
          <li>Hosted publicly on the Hugging Face Model Hub under <code>mustaphaidris/hausa-agri-ner-candidate</code>.</li>
        </ul>
      `
    },

    'livestock-economy': {
      title: "Understanding The African Livestock Economy",
      category: "Macroeconomic Research & Value Chains",
      content: `
        <p><strong>System Objective:</strong> Map out the entire economic value chain of Nigeria's 55M cattle, 139M goats, and 65M sheep, transforming abstract statistics into actionable data architecture for tech solutions.</p>

        <div class="modal-diagram-box">
[Inputs & Genetics] ──► [On-Farm Production] ──► [Collection & Transport]
                                                        │
                                                        ▼
[Retail & Export]  ◄── [Cold-Chain Logistics]  ◄── [Slaughter & Value Add]
        </div>

        <h4>Key Insights:</h4>
        <ul style="padding-left: 1.25rem;">
          <li>Livestock represents over 40% of global agricultural GDP and $1.7T globally.</li>
          <li>In Nigeria, smallholder pastoralists manage 7 out of 10 animals.</li>
          <li>Identifying digitization bottlenecks in veterinary care, feed supplies, and transit logistics.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const details = PROJECT_DETAILS[projectId];
      if (details && modal) {
        modalTitle.textContent = details.title;
        modalCategory.textContent = details.category;
        modalContent.innerHTML = details.content;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================================
  // 7. REAL-TIME LAGOS CLOCK (WAT / GMT+1)
  // ==========================================
  const lagosTimeText = document.getElementById('lagosTimeText');
  function updateLagosTime() {
    if (!lagosTimeText) return;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    lagosTimeText.textContent = `🕒 Lagos Local Time (WAT): ${formatter.format(now)}`;
  }
  updateLagosTime();
  setInterval(updateLagosTime, 1000);

  // Set Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================
  // 8. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value.trim();

      let hasError = false;

      // Validation
      if (!name) {
        document.getElementById('nameError').textContent = 'Please enter your name.';
        hasError = true;
      } else {
        document.getElementById('nameError').textContent = '';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        hasError = true;
      } else {
        document.getElementById('emailError').textContent = '';
      }

      if (!subject) {
        document.getElementById('subjectError').textContent = 'Please select a topic.';
        hasError = true;
      } else {
        document.getElementById('subjectError').textContent = '';
      }

      if (!message || message.length < 10) {
        document.getElementById('messageError').textContent = 'Message should be at least 10 characters.';
        hasError = true;
      } else {
        document.getElementById('messageError').textContent = '';
      }

      if (hasError) return;

      // Prepare mailto link & visual feedback
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Preparing your message draft to mustapha5th@gmail.com...';

      const mailtoLink = `mailto:mustapha5th@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`)}&body=${encodeURIComponent(`Hi Mustapha,\n\nName: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}\n\nBest regards,\n${name}`)}`;

      setTimeout(() => {
        window.location.href = mailtoLink;
        formStatus.textContent = '✓ Message launched in your email client! Thank you for reaching out.';
        showToast('Message launched in your email client!');
        contactForm.reset();
      }, 700);
    });
  }

});
