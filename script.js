/* =====================================================================
   SHIVALIK RESIDENCY — SCRIPT
   Vanilla JS only. Each block is independent, so you can delete a
   feature by removing its block without breaking the others.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. Mobile nav toggle
     --------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu after tapping a link (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------
     2. Sticky header shadow on scroll
     --------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------------
     3. Scroll-reveal animations (IntersectionObserver)
     --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for very old browsers
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------
     4. FAQ accordion
     --------------------------------------------------------------- */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    const panel = trigger.nextElementSibling;
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels (single-open accordion)
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.style.maxHeight = '0px';
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------------
     5. Gallery lightbox
     --------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocusedElement = null;

  const openLightbox = (src, alt) => {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const alt = item.querySelector('img')?.alt || '';
      openLightbox(fullSrc, alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* ---------------------------------------------------------------
     6. Back-to-top button
     --------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  const onScrollBackToTop = () => {
    if (!backToTop) return;
    backToTop.hidden = window.scrollY < 480;
  };
  window.addEventListener('scroll', onScrollBackToTop, { passive: true });
  onScrollBackToTop();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     7. Contact form submission
     ---------------------------------------------------------------
     Default: relies on the form's native action (e.g. Formspree) —
     no JS required, this just shows a friendly status message.

     To use EmailJS instead:
       1. Include the EmailJS SDK script tag in index.html
       2. Remove the action="..." attribute from #contactForm in index.html
       3. Uncomment the emailjs.sendForm(...) block below and fill in
          your Service ID, Template ID and Public Key.
     --------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Formspree-style forms work without JS. This just gives instant
      // feedback and (optionally) prevents the page reload via fetch.
      const actionUrl = contactForm.getAttribute('action') || '';
      const usesPlaceholder = actionUrl.includes('YOUR_FORM_ID');

      if (usesPlaceholder) {
        // No real endpoint configured yet — don't submit anywhere, just
        // tell the developer/tester what to do.
        e.preventDefault();
        formStatus.textContent = 'Form endpoint not configured yet — set the action URL in index.html.';
        return;
      }

      e.preventDefault();
      formStatus.textContent = 'Sending…';

      fetch(actionUrl, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            formStatus.textContent = 'Thanks! We\'ll get back to you shortly.';
            contactForm.reset();
          } else {
            formStatus.textContent = 'Something went wrong. Please call or WhatsApp us instead.';
          }
        })
        .catch(() => {
          formStatus.textContent = 'Something went wrong. Please call or WhatsApp us instead.';
        });

      /* --- EmailJS alternative (uncomment and configure) ---
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm, 'YOUR_PUBLIC_KEY')
        .then(() => {
          formStatus.textContent = 'Thanks! We\'ll get back to you shortly.';
          contactForm.reset();
        }, () => {
          formStatus.textContent = 'Something went wrong. Please call or WhatsApp us instead.';
        });
      */
    });
  }

  /* ---------------------------------------------------------------
     8. Footer year
     --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
