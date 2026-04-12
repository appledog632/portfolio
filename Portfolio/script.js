/* script.js — Disha Rathore Portfolio
   Initialised per phase — stubs first, filled in as sections are added */

document.addEventListener('DOMContentLoaded', () => {

  // ── PHASE 1: Nav scroll shadow + hamburger ──────────────────
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ── PHASE 2: Typing animation ───────────────────────────────
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const roles = [
      'Problem Solver',
      'UI/UX Designer',
      'Data Analyst',
      'Frontend Developer'
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = roles[roleIdx];
      if (!deleting) {
        typingEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true; type(); }, 1800);
          return;
        }
        setTimeout(type, 95);
      } else {
        typingEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, 55);
      }
    }
    type();
  }


  // ── PHASE 2/10: IntersectionObserver fade-up ────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  // ── PHASE 6: Scroll-driven designs cards ────────────────────
  const scrollOuter = document.getElementById('designsScrollOuter');
  const progressFill = document.getElementById('designsProgressFill');
  const designCardEls = document.querySelectorAll('.design-card');
  const N = designCardEls.length;

  function setActiveDesignCard(idx) {
    designCardEls.forEach((card, i) => {
      const isActive = i === idx;
      card.classList.toggle('active', isActive);
      const toggle = card.querySelector('.design-toggle');
      const body   = card.querySelector('.design-card-body');
      if (toggle) toggle.setAttribute('aria-expanded', isActive);
      if (body)   body.setAttribute('aria-hidden', !isActive);
    });
  }

  if (scrollOuter && N > 0) {
    window.addEventListener('scroll', () => {
      const rect = scrollOuter.getBoundingClientRect();
      const totalScroll = scrollOuter.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));
      progressFill.style.width = (progress * 100) + '%';
      const activeIdx = Math.min(N - 1, Math.floor(progress * N));
      setActiveDesignCard(activeIdx);
    }, { passive: true });

    // Click toggle
    designCardEls.forEach((card, i) => {
      card.querySelector('.design-card-header').addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        setActiveDesignCard(isActive ? -1 : i);
      });
    });

    // Initialise first card
    setActiveDesignCard(0);
  }



  // ── PHASE 7: Stats bar animate on scroll ────────────────────
  const statsBarFill = document.getElementById('statsBarFill');
  if (statsBarFill) {
    const barObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        statsBarFill.style.width = statsBarFill.parentElement
          ? statsBarFill.style.width || '78%' : '78%';
        statsBarFill.style.width = '78%';
        barObs.disconnect();
      }
    }, { threshold: 0.5 });
    barObs.observe(statsBarFill);
  }


  // ── PHASE 9: Contact form ────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSubmit  = document.getElementById('formSubmit');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('formName').value.trim();
      const email   = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      if (!name || !email || !message) return;

      // Simulate send (replace with fetch to backend if needed)
      formSubmit.textContent = '✓ Sent!';
      contactForm.classList.add('form-success');
      setTimeout(() => {
        contactForm.reset();
        formSubmit.textContent = 'Send Message ↗';
        contactForm.classList.remove('form-success');
      }, 3000);
    });
  }


  // ── PHASE 10: Active nav link on scroll ─────────────────────
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');
  const sections   = Array.from(navLinkEls)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active',
        link.getAttribute('href') === '#' + current.id);
    });
  }

  if (sections.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // ── PHASE 11: Projects Slider ───────────────────────────────
  const track = document.getElementById('projectsSliderTrack');
  if (track) {
    const slides = track.querySelectorAll('.project-featured');
    const dots = document.querySelectorAll('#sliderDots .dot');
    const nextBtn = document.getElementById('sliderNextBtn');
    const prevBtn = document.getElementById('sliderPrevBtn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      
      // Move track
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    // Event Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Reset timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Reset timer
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        startAutoPlay(); // Reset timer
      });
    });

    // Pause hover
    const sliderWrapper = document.querySelector('.projects-slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
      sliderWrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Init
    startAutoPlay();
  }

});
