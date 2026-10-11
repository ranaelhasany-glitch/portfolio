/**
 * ============================================================================
 * RANA ELHASANY — GRAPHIC DESIGN PORTFOLIO
 * Vanilla JavaScript (ES6+) Interactions & Application Logic
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC FOOTER YEAR
  // --------------------------------------------------------------------------
  const initFooterYear = () => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  };

  // --------------------------------------------------------------------------
  // 2. SCROLL PROGRESS INDICATOR & HEADER STATE
  // --------------------------------------------------------------------------
  const initScrollProgressAndHeader = () => {
    const progressBar = document.getElementById('scrollProgressBar');
    const header = document.getElementById('siteHeader');
    const backToTopBtn = document.getElementById('backToTopBtn');

    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Scroll progress
      if (progressBar && docHeight > 0) {
        const scrolledPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(scrolledPercent, 100)}%`;
      }

      // Header background blur on scroll
      if (header) {
        if (scrollTop > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Back-to-top button visibility
      if (backToTopBtn) {
        if (scrollTop > 400) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Back to top click handler
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Run once on initial load
    handleScroll();
  };

  // --------------------------------------------------------------------------
  // 3. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const initMobileNav = () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer__btn');

    if (!hamburgerBtn || !mobileDrawer) return;

    const openDrawer = () => {
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (drawerCloseBtn) drawerCloseBtn.focus();
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburgerBtn.focus();
    };

    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  };

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK TRACKING (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const initActiveNavObserver = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  };

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.fade-up');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  };

  // --------------------------------------------------------------------------
  // 6. CUSTOM CURSOR & SPOTLIGHT (DESKTOP FINE POINTER ONLY)
  // --------------------------------------------------------------------------
  const initCustomCursor = () => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const cursorDot = document.getElementById('cursorDot');
    const cursorFollower = document.getElementById('cursorFollower');

    if (!cursorDot || !cursorFollower) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth follower lerp loop
    const animateFollower = () => {
      const ease = 0.18;
      followerX += (mouseX - followerX) * ease;
      followerY += (mouseY - followerY) * ease;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    };
    requestAnimationFrame(animateFollower);

    // Hover scale effects on interactive elements
    const interactiveSelectors = 'a, button, input, select, textarea, .project-card, .skill-category-card, .service-card, .poster-canvas';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    interactiveElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  };

  // --------------------------------------------------------------------------
  // 7. PROJECT FILTERING FUNCTIONALITY
  // --------------------------------------------------------------------------
  const initProjectFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        // Update active filter state
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('is-hidden');
            // Re-trigger reveal animation if hidden
            card.classList.add('is-revealed');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  };

  // --------------------------------------------------------------------------
  // 8. PROJECT DETAIL MODAL / LIGHTBOX
  // --------------------------------------------------------------------------
  const initProjectModal = () => {
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDynamicContent = document.getElementById('modalDynamicContent');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    if (!modal || !modalDynamicContent) return;

    // Detailed project data repository
    const projectDetails = {
      via: {
        category: 'Brand Identity & Visual Design',
        title: 'VIA TRAVEL',
        description: 'A complete visual identity project for a travel agency, including logo design, color palette, typography, social media designs, promotional materials, and brand applications.',
        type: 'Visual Identity System',
        scope: 'Branding, Guidelines & Collateral',
        tools: 'Adobe Illustrator, Adobe Photoshop',
        deliverables: [
          'Primary & Secondary Logo Marks',
          'Curated Color Palette & Typography Specifications',
          'Social Media Announcement Templates',
          'Boarding Pass & Ticket Collateral Mockups',
          'Promotional Travel Guides & Stationery',
          'Comprehensive Brand Guidelines'
        ],
        visualSummary: `
          <div class="project-canvas project-canvas--via" style="border-radius: var(--radius-md); padding: 3rem 1.5rem;">
            <div class="canvas-artwork">
              <div class="via-badge">
                <span class="via-plane-icon">✈</span>
                <span class="via-tag">TRAVEL &bull; EXPLORE &bull; DISCOVER</span>
              </div>
              <h3 class="via-brand-title">VIA TRAVEL</h3>
              <p class="via-brand-sub">Curated Journeys &bull; Visual Identity System</p>
              <div class="via-assets-row" style="margin-top: 1.5rem;">
                <div class="via-mockup-card">
                  <span class="card-caption">IDENTITY SYSTEM // SPEC</span>
                  <div class="card-code">PALETTE: #A14646 / #DA6556 / #EB895B</div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      rafeeq: {
        category: 'Visual & Digital Project',
        title: 'RAFEEQ',
        description: 'A digital project where visual communication and user-centered design were used to create a clear and accessible experience.',
        type: 'Digital Interface & Experience',
        scope: 'Visual Hierarchy & UI Systems',
        tools: 'Adobe Illustrator, Photoshop, Canva',
        deliverables: [
          'Design System Typography Hierarchy',
          'Accessible High-Contrast Color System',
          'Component Visual Guides & Cards',
          'Mobile & Tablet Interface Presentation Mockups',
          'Iconography & Visual Communication Badges'
        ],
        visualSummary: `
          <div class="project-canvas project-canvas--rafeeq" style="border-radius: var(--radius-md); padding: 3rem 1.5rem;">
            <div class="canvas-artwork">
              <div class="rafeeq-header">
                <span class="rafeeq-dot"></span>
                <span class="rafeeq-tag">DIGITAL EXPERIENCE</span>
              </div>
              <h3 class="rafeeq-logo-title">RAFEEQ</h3>
              <p class="rafeeq-subtitle">Visual &amp; Accessible Digital Project</p>
            </div>
          </div>
        `
      },
      collection: {
        category: 'Graphic Design Collection',
        title: 'Selected Design Work',
        description: 'A collection of selected branding concepts, social media designs, presentations, promotional materials, and visual compositions developed throughout my design training and projects.',
        type: 'Creative Design Showcase',
        scope: 'Multi-Discipline Graphic Works',
        tools: 'Adobe Illustrator, Adobe Photoshop, Canva',
        deliverables: [
          'Editorial Typography Posters',
          'Multi-slide Social Media Educational Carousels',
          'Structured Presentation Pitch Decks',
          'Print-Ready Promotional Flyers & Posters',
          'Logo Exploration & Symbol Sketches'
        ],
        visualSummary: `
          <div class="project-canvas project-canvas--collection" style="border-radius: var(--radius-md); padding: 3rem 1.5rem;">
            <div class="canvas-artwork">
              <div class="collection-mosaic">
                <div class="mosaic-box box-1"><span>POSTER</span></div>
                <div class="mosaic-box box-2"><span>SOCIAL</span></div>
                <div class="mosaic-box box-3"><span>LAYOUT</span></div>
                <div class="mosaic-box box-4"><span>TYPE</span></div>
              </div>
              <h3 class="collection-title">Selected Design Work</h3>
              <p class="collection-caption">Branding &bull; Social &bull; Presentations &bull; Print</p>
            </div>
          </div>
        `
      }
    };

    let previousFocusedElement = null;

    const openModal = (projectId) => {
      const data = projectDetails[projectId];
      if (!data) return;

      previousFocusedElement = document.activeElement;

      // Populate dynamic content
      modalDynamicContent.innerHTML = `
        <div class="modal-hero-banner">
          ${data.visualSummary}
        </div>

        <div class="modal-header-info">
          <span class="modal-eyebrow">${data.category}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>

        <p class="modal-description">${data.description}</p>

        <div class="modal-details-grid">
          <div class="modal-detail-block">
            <span class="detail-label">Project Type</span>
            <span class="detail-value">${data.type}</span>
          </div>
          <div class="modal-detail-block">
            <span class="detail-label">Scope</span>
            <span class="detail-value">${data.scope}</span>
          </div>
          <div class="modal-detail-block">
            <span class="detail-label">Tools Leveraged</span>
            <span class="detail-value">${data.tools}</span>
          </div>
        </div>

        <h3 class="modal-deliverables-title">Key Deliverables &amp; Applications</h3>
        <div class="modal-tags">
          ${data.deliverables.map(item => `<span class="modal-tag">${item}</span>`).join('')}
        </div>

        <div class="modal-footer-cta">
          <span style="font-size:0.875rem; color:var(--text-secondary);">Interested in a similar design solution?</span>
          <a href="#contact" class="btn btn--primary btn--sm modal-inquire-btn">
            <span>Inquire About This Service</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `;

      // Setup close action on inquire button
      const inquireBtn = modalDynamicContent.querySelector('.modal-inquire-btn');
      if (inquireBtn) {
        inquireBtn.addEventListener('click', closeModal);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (modalCloseBtn) modalCloseBtn.focus();
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (previousFocusedElement) {
        previousFocusedElement.focus();
      }
    };

    openModalButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        openModal(projectId);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  };

  // --------------------------------------------------------------------------
  // 9. SERVICE INQUIRY PRE-FILLER
  // --------------------------------------------------------------------------
  const initServiceInquiryButtons = () => {
    const serviceLinks = document.querySelectorAll('.service-link');
    const serviceSelect = document.getElementById('contactService');

    if (!serviceSelect || serviceLinks.length === 0) return;

    serviceLinks.forEach(link => {
      link.addEventListener('click', () => {
        const targetService = link.getAttribute('data-service');
        if (targetService) {
          for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === targetService) {
              serviceSelect.selectedIndex = i;
              break;
            }
          }
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // 10. CLIENT-SIDE CONTACT FORM VALIDATION
  // --------------------------------------------------------------------------
  const initContactFormValidation = () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const serviceSelect = document.getElementById('contactService');
    const messageInput = document.getElementById('contactMessage');
    const feedbackBanner = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (field, errorId, message) => {
      field.classList.add('is-invalid');
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.textContent = message;
    };

    const clearError = (field, errorId) => {
      field.classList.remove('is-invalid');
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.textContent = '';
    };

    // Real-time input clearing
    nameInput?.addEventListener('input', () => clearError(nameInput, 'nameError'));
    emailInput?.addEventListener('input', () => clearError(emailInput, 'emailError'));
    serviceSelect?.addEventListener('change', () => clearError(serviceSelect, 'serviceError'));
    messageInput?.addEventListener('input', () => clearError(messageInput, 'messageError'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'nameError', 'Please enter your name.');
        isValid = false;
      } else {
        clearError(nameInput, 'nameError');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        showError(emailInput, 'emailError', 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'emailError', 'Please provide a valid email format.');
        isValid = false;
      } else {
        clearError(emailInput, 'emailError');
      }

      // Validate Service
      if (!serviceSelect.value) {
        showError(serviceSelect, 'serviceError', 'Please select a design service.');
        isValid = false;
      } else {
        clearError(serviceSelect, 'serviceError');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'messageError', 'Please describe your project or inquiry.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'messageError', 'Message should be at least 10 characters.');
        isValid = false;
      } else {
        clearError(messageInput, 'messageError');
      }

      if (isValid) {
        // Show success state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Message Received</span> ✓';
        }

        if (feedbackBanner) {
          feedbackBanner.removeAttribute('hidden');
          // Prepare fallback mailto link with encoded user inputs
          const mailBtn = document.getElementById('feedbackMailBtn');
          if (mailBtn) {
            const subject = encodeURIComponent(`Design Inquiry: ${serviceSelect.value} - ${nameInput.value.trim()}`);
            const body = encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\nService: ${serviceSelect.value}\n\nProject Details:\n${messageInput.value.trim()}`);
            mailBtn.setAttribute('href', `mailto:[Your Email]?subject=${subject}&body=${body}`);
          }
        }

        // Reset inputs gracefully after brief timeout
        setTimeout(() => {
          form.reset();
        }, 1200);
      }
    });
  };

  // --------------------------------------------------------------------------
  // INITIALIZE ALL MODULES
  // --------------------------------------------------------------------------
  initFooterYear();
  initScrollProgressAndHeader();
  initMobileNav();
  initActiveNavObserver();
  initScrollReveal();
  initCustomCursor();
  initProjectFilters();
  initProjectModal();
  initServiceInquiryButtons();
  initContactFormValidation();
});
