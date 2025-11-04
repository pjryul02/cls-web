/**
 * CLS Solution Website JavaScript
 * Dependencies: jQuery 3.7.1+
 */

(function($) {
  'use strict';

  // ========================================
  // Global Variables
  // ========================================
  const $window = $(window);
  const $document = $(document);
  const $body = $('body');
  const $header = $('#header');
  const $hamburger = $('#hamburger');
  const $mobileNav = $('#mobile-nav');
  const $darkModeToggle = $('#dark-mode-toggle');
  const $backToTop = $('#back-to-top');
  const $scrollProgress = $('#scroll-progress');
  const $loadingScreen = $('#loading-screen');

  // ========================================
  // Utility Functions
  // ========================================

  /**
   * Debounce function to limit event handler execution
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Easing function for smooth animations
   */
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  // ========================================
  // Loading Screen
  // ========================================
  function hideLoadingScreen() {
    setTimeout(() => {
      $loadingScreen.addClass('hidden');
    }, 500);
  }

  // ========================================
  // Dark Mode Toggle
  // ========================================
  function initDarkMode() {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Toggle dark mode
    $darkModeToggle.on('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ========================================
  // Hamburger Menu & Mobile Navigation
  // ========================================
  function initMobileMenu() {
    // Toggle hamburger menu
    $hamburger.on('click', function() {
      $(this).toggleClass('active');
      $mobileNav.toggleClass('active');
      $body.toggleClass('menu-open');
    });

    // Close menu when clicking on a link
    $('.nav-link-mobile').on('click', function() {
      $hamburger.removeClass('active');
      $mobileNav.removeClass('active');
      $body.removeClass('menu-open');
    });

    // Close menu when clicking outside
    $document.on('click', function(e) {
      if ($mobileNav.hasClass('active') &&
          !$(e.target).closest('#mobile-nav, #hamburger').length) {
        $hamburger.removeClass('active');
        $mobileNav.removeClass('active');
        $body.removeClass('menu-open');
      }
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeaderScroll() {
    const scrollThreshold = 50;

    function updateHeader() {
      const scrollTop = $window.scrollTop();

      if (scrollTop > scrollThreshold) {
        $header.addClass('scrolled');
      } else {
        $header.removeClass('scrolled');
      }
    }

    $window.on('scroll', debounce(updateHeader, 10));
    updateHeader(); // Initial check
  }

  // ========================================
  // Scroll Progress Bar
  // ========================================
  function initScrollProgress() {
    function updateScrollProgress() {
      const windowHeight = $window.height();
      const documentHeight = $document.height();
      const scrollTop = $window.scrollTop();
      const scrollPercent = (scrollTop / (documentHeight - windowHeight));

      $scrollProgress.css('transform', `scaleX(${scrollPercent})`);
    }

    $window.on('scroll', debounce(updateScrollProgress, 10));
    updateScrollProgress(); // Initial check
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
      const target = $(this.getAttribute('href'));

      if (target.length) {
        e.preventDefault();

        const headerHeight = $header.outerHeight();
        const targetPosition = target.offset().top - headerHeight;

        $('html, body').stop().animate({
          scrollTop: targetPosition
        }, 800, 'swing');
      }
    });
  }

  // ========================================
  // Stats Counter Animation
  // ========================================
  function initStatsCounter() {
    const $statValues = $('.stat-value');
    let animated = false;

    function animateCounter($element, target, duration = 2000) {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        // Handle decimal numbers
        if (target % 1 !== 0) {
          $element.text(current.toFixed(1));
        } else {
          $element.text(Math.floor(current));
        }
      }, 16);
    }

    function checkStatsInView() {
      if (animated) return;

      const $statsSection = $('#stats');
      if ($statsSection.length === 0) return;

      const rect = $statsSection[0].getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
      );

      if (isVisible) {
        animated = true;
        $statValues.each(function() {
          const $this = $(this);
          const target = parseFloat($this.data('target'));
          animateCounter($this, target, 2000);
        });
      }
    }

    $window.on('scroll', debounce(checkStatsInView, 100));
    checkStatsInView(); // Initial check
  }

  // ========================================
  // Back to Top Button
  // ========================================
  function initBackToTop() {
    const scrollThreshold = 300;

    function updateBackToTop() {
      const scrollTop = $window.scrollTop();

      if (scrollTop > scrollThreshold) {
        $backToTop.addClass('visible');
      } else {
        $backToTop.removeClass('visible');
      }
    }

    $backToTop.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 800);
    });

    $window.on('scroll', debounce(updateBackToTop, 100));
    updateBackToTop(); // Initial check
  }

  // ========================================
  // Load SVG Illustrations
  // ========================================
  function loadSVGIllustrations() {
    const svgMappings = {
      'svg-neural-network': 'assets/svg/neural-network.svg',
      'svg-detection-frame': 'assets/svg/detection-frame.svg',
      'svg-chart': 'assets/svg/chart.svg',
      'svg-camera-eye': 'assets/svg/camera-eye.svg',
      'svg-scale': 'assets/svg/scale.svg'
    };

    Object.keys(svgMappings).forEach(function(elementId) {
      const $container = $(`#${elementId}`);
      if ($container.length) {
        $.ajax({
          url: svgMappings[elementId],
          dataType: 'html',
          success: function(data) {
            $container.html(data);
          },
          error: function() {
            console.warn(`Failed to load SVG: ${svgMappings[elementId]}`);
          }
        });
      }
    });
  }

  // ========================================
  // Contact Form Handling
  // ========================================
  function initContactForm() {
    const $form = $('#contact-form');

    $form.on('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        company: $('#company').val(),
        phone: $('#phone').val(),
        message: $('#message').val()
      };

      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
      }

      // In a real application, you would send this data to a server
      console.log('Form submitted:', formData);

      // Show success message
      alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');

      // Reset form
      $form[0].reset();

      // Scroll to top
      $('html, body').animate({ scrollTop: 0 }, 800);
    });
  }

  // ========================================
  // Fade In on Scroll Animation
  // ========================================
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
      '.value-card, .product-card, .tech-card, .innovation-card, .partner-card'
    );

    animatedElements.forEach(function(element) {
      observer.observe(element);
    });
  }

  // ========================================
  // Lazy Loading Images (if any)
  // ========================================
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(script);
    }
  }

  // ========================================
  // Parallax Effect (Improved)
  // ========================================
  function initParallax() {
    const $heroSection = $('.hero');

    if ($heroSection.length === 0) return;

    function updateParallax() {
      const scrollTop = $window.scrollTop();
      const windowHeight = $window.height();
      const heroHeight = $heroSection.outerHeight();

      // 히어로 섹션이 화면에 보이는 동안만 패럴랙스 적용
      if (scrollTop < heroHeight) {
        // 0.3배 속도로 천천히 이동 (원래 0.5보다 더 부드럽게)
        const parallaxOffset = scrollTop * 0.3;
        $heroSection.css('transform', `translateY(${parallaxOffset}px)`);

        // 스크롤에 따라 히어로 섹션 투명도 조정 (선택사항)
        const opacity = 1 - (scrollTop / heroHeight) * 0.3;
        $heroSection.css('opacity', Math.max(opacity, 0.7));
      }
    }

    $window.on('scroll', debounce(updateParallax, 10));
    updateParallax(); // 초기 실행
  }

  // ========================================
  // Active Navigation Link Highlighting
  // ========================================
  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    $window.on('scroll', debounce(updateActiveLink, 100));
    updateActiveLink(); // Initial check
  }

  // ========================================
  // Performance Monitoring
  // ========================================
  function monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          console.log(`Page Load Time: ${pageLoadTime}ms`);
        }, 0);
      });
    }
  }

  // ========================================
  // Prevent Flash of Unstyled Content
  // ========================================
  function preventFOUC() {
    $body.css('visibility', 'visible');
  }

  // ========================================
  // Accessibility Enhancements
  // ========================================
  function initAccessibility() {
    // Add keyboard navigation support
    $('a, button').on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        $(this).trigger('click');
      }
    });

    // Skip to main content link
    $('<a>', {
      href: '#main',
      class: 'skip-link',
      text: '메인 콘텐츠로 건너뛰기',
      css: {
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#1E40AF',
        color: 'white',
        padding: '8px',
        textDecoration: 'none',
        zIndex: 100
      }
    }).prependTo($body).on('focus', function() {
      $(this).css('top', '0');
    }).on('blur', function() {
      $(this).css('top', '-40px');
    });
  }

  // ========================================
  // Error Handling
  // ========================================
  window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, e.filename, e.lineno);
  });

  // ========================================
  // Initialize All Functions
  // ========================================
  function init() {
    console.log('CLS Solution Website Initialized');

    // Core functionality
    initDarkMode();
    initMobileMenu();
    initHeaderScroll();
    initScrollProgress();
    initSmoothScroll();
    initBackToTop();

    // Content & Animations
    loadSVGIllustrations();
    initStatsCounter();
    initScrollAnimations();
    initParallax();

    // Forms & Interactions
    initContactForm();

    // Navigation
    initActiveNavLinks();

    // Performance & Accessibility
    initLazyLoading();
    initAccessibility();
    monitorPerformance();
    preventFOUC();

    // Hide loading screen
    hideLoadingScreen();
  }

  // ========================================
  // Document Ready
  // ========================================
  $(document).ready(function() {
    init();
  });

  // ========================================
  // Window Load (for images and external resources)
  // ========================================
  $(window).on('load', function() {
    console.log('All resources loaded');
  });

  // ========================================
  // Expose public API (if needed)
  // ========================================
  window.CLSSolution = {
    version: '1.0.0',
    init: init,
    darkMode: {
      toggle: function() {
        $darkModeToggle.trigger('click');
      },
      get: function() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      }
    }
  };

})(jQuery);
