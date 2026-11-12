/**
 * Michael Mariscal — Portfolio Scripts
 * Handles theme toggle, scroll spy, smooth scroll, and year update
 */

(function () {
  'use strict';

  // ========================================
  // Theme Toggle
  // ========================================
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;

  // Initialize theme from localStorage or system preference
  function initTheme() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  // Toggle theme and persist
  function toggleTheme() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var newTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }

  // Listen for system theme changes (only if user hasn't set explicit preference)
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  initTheme();

  // ========================================
  // Current Year in Footer
  // ========================================
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ========================================
  // Scroll Spy (Active Nav Link)
  // ========================================
  var navLinks = [].slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var sectionMap = {};

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionMap[href.slice(1)] = link;
    }
  });

  if ('IntersectionObserver' in window && Object.keys(sectionMap).length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.remove('on');
          });
          var activeLink = sectionMap[entry.target.id];
          if (activeLink) {
            activeLink.classList.add('on');
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    document.querySelectorAll('section[id]').forEach(function (section) {
      observer.observe(section);
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  // Progressive enhancement: only intercept if smooth scroll is supported
  if ('scrollBehavior' in document.documentElement.style) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return; // Skip "back to top" if it's just #

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without page jump
          history.pushState(null, '', href);
        }
      });
    });
  }

  // ========================================
  // Optional: Keyboard Navigation for Details
  // ========================================
  // Ensure summary elements are keyboard accessible (they are by default)
  // But we can add Enter/Space handling for custom markers if needed
  document.querySelectorAll('details summary').forEach(function (summary) {
    summary.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        // Let browser handle it naturally
        return;
      }
    });
  });

})();