/* ==========================================================================
   HomeGoods — Shared site interactivity
   Loaded on every page. Each block guards for the elements it needs so the
   same file works across pages that don't include every component.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------------
     1. FIXED NAV — shadow on scroll + active link highlight
  ---------------------------------------------------------------- */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    var toggleNavShadow = function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    toggleNavShadow();
    window.addEventListener('scroll', toggleNavShadow, { passive: true });
  }

  /* ----------------------------------------------------------------
     2. RESPONSIVE HAMBURGER MENU
  ---------------------------------------------------------------- */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close the mobile menu whenever a nav link is tapped */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------------
     3. SMOOTH SCROLL for in-page anchor links (e.g. "#how-it-works")
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    var href = link.getAttribute('href');
    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var hash = href.slice(hashIndex + 1);
    var pathPart = href.slice(0, hashIndex);
    var isSamePage = pathPart === '' || pathPart === window.location.pathname.split('/').pop();

    if (!isSamePage || !hash) return;

    link.addEventListener('click', function (e) {
      var target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      var navOffset = navbar ? navbar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navOffset - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------------
     4. SCROLL REVEAL — slide-up on scroll with staggered delays
     Elements opt in with [data-reveal]. Optional [data-reveal-group]
     staggers children automatically; otherwise use data-delay="0.15".
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length && 'IntersectionObserver' in window) {
    /* Auto-stagger: within each group container, index children by 0.1s */
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      var children = group.querySelectorAll('[data-reveal]');
      children.forEach(function (child, i) {
        child.style.setProperty('--reveal-delay', (i * 0.12) + 's');
      });
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* No IntersectionObserver support — just show everything */
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------------
     5. ANIMATED STATISTICS COUNTER
     Counts up from 0 to [data-count-to] once the block scrolls in view.
  ---------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count-to]');

  if (counters.length && 'IntersectionObserver' in window) {
    var animateCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var start = null;

      var step = function (timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        /* ease-out-quad for a natural deceleration */
        var eased = 1 - (1 - progress) * (1 - progress);
        var value = Math.round(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ----------------------------------------------------------------
     6. TESTIMONIAL CAROUSEL
  ---------------------------------------------------------------- */
  var carousel = document.querySelector('.carousel');

  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.testimonial-slide');
    var prevBtn = carousel.querySelector('.carousel-btn--prev');
    var nextBtn = carousel.querySelector('.carousel-btn--next');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var current = 0;
    var autoplayId = null;

    /* Build dots dynamically so markup stays lean */
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach(function (d, i) {
          d.classList.toggle('is-active', i === current);
        });
      }
    }

    function resetAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = setInterval(function () { goTo(current + 1); }, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

    /* Swipe support for touch devices */
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 40) { goTo(current - 1); resetAutoplay(); }
      else if (diff < -40) { goTo(current + 1); resetAutoplay(); }
    }, { passive: true });

    if (slides.length > 1) resetAutoplay();
  }

  /* ----------------------------------------------------------------
     7. BACK TO TOP BUTTON
  ---------------------------------------------------------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    var toggleBackToTop = function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------------
     8. NEWSLETTER SUBSCRIPTION FORM
  ---------------------------------------------------------------- */
  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var msg = newsletterForm.parentElement.querySelector('.form-msg');
      var email = emailInput.value.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!msg) return;

      if (isValid) {
        msg.textContent = 'You\'re on the list! Watch your inbox for weekly deals.';
        msg.className = 'form-msg success';
        newsletterForm.reset();
      } else {
        msg.textContent = 'Please enter a valid email address.';
        msg.className = 'form-msg error';
      }
    });
  }

  /* ----------------------------------------------------------------
     9. CONTACT FORM (client-side validation + simulated submit)
  ---------------------------------------------------------------- */
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = contactForm.querySelector('.form-msg');
      var name = contactForm.querySelector('#name');
      var email = contactForm.querySelector('#email');
      var message = contactForm.querySelector('#message');

      var isValid = name.value.trim().length > 1 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
        message.value.trim().length > 5;

      if (!msg) return;

      if (isValid) {
        msg.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] + '! Our team will reply within one business day.';
        msg.className = 'form-msg success';
        contactForm.reset();
      } else {
        msg.textContent = 'Please fill in your name, a valid email, and a short message.';
        msg.className = 'form-msg error';
      }
    });
  }

  /* ----------------------------------------------------------------
     10. SET CURRENT YEAR IN FOOTER
  ---------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------------
     11. SHOP PAGE — category filter (guarded, only runs on shop.html)
  ---------------------------------------------------------------- */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var filterBtns = filterBar.querySelectorAll('[data-filter]');
    var productCards = document.querySelectorAll('[data-category]');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter');

        productCards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

});
