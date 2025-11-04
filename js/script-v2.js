/**
 * CLS Solution Website JavaScript v2.0
 * Enhanced Parallax & Number Animations
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

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  // ========================================
  // Loading Screen
  // ========================================
  function hideLoadingScreen() {
    setTimeout(() => {
      $loadingScreen.addClass('hidden');
    }, 300);
  }

  // ========================================
  // Dark Mode Toggle
  // ========================================
  function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

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
    $hamburger.on('click', function() {
      $(this).toggleClass('active');
      $mobileNav.toggleClass('active');
      $body.toggleClass('menu-open');
    });

    $('.nav-link-mobile').on('click', function() {
      $hamburger.removeClass('active');
      $mobileNav.removeClass('active');
      $body.removeClass('menu-open');
    });

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
    updateHeader();
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
    updateScrollProgress();
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
        }, 1000, 'swing');
      }
    });
  }

  // ========================================
  // Enhanced Number Counter Animation
  // ========================================
  function initNumberCounters() {
    const $counters = $('.stat-value, .number-counter');
    let animated = false;

    function animateNumber($element, target, duration = 2500, decimals = 0) {
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easedProgress = easeOutCubic(progress);
        const current = start + (target - start) * easedProgress;

        if (decimals > 0) {
          $element.text(current.toFixed(decimals));
        } else {
          $element.text(Math.floor(current).toLocaleString());
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (decimals > 0) {
            $element.text(target.toFixed(decimals));
          } else {
            $element.text(target.toLocaleString());
          }
        }
      }

      requestAnimationFrame(update);
    }

    function checkCountersInView() {
      if (animated) return;

      $counters.each(function() {
        const $this = $(this);
        const rect = this.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );

        if (isVisible && !$this.hasClass('counted')) {
          $this.addClass('counted');
          const target = parseFloat($this.data('target'));
          const decimals = $this.data('decimals') || 0;
          const duration = $this.data('duration') || 2500;

          animateNumber($this, target, duration, decimals);
        }
      });

      // Check if all counters are animated
      if ($counters.filter('.counted').length === $counters.length) {
        animated = true;
      }
    }

    $window.on('scroll', debounce(checkCountersInView, 100));
    checkCountersInView();
  }

  // ========================================
  // Enhanced Parallax Effect (DISABLED)
  // ========================================
  function initEnhancedParallax() {
    // Hero parallax disabled - no visible effect and causes layout issues
    // Keeping function for backward compatibility
  }

  // ========================================
  // Section Parallax Effects (DISABLED - caused section overlap)
  // ========================================
  function initSectionParallax() {
    // Parallax disabled - was causing sections to overlap
    // Keeping function for backward compatibility
  }

  // ========================================
  // Parallax for Images and Illustrations (DISABLED)
  // ========================================
  function initImageParallax() {
    // Image parallax disabled - no visible effect
    // Keeping function for backward compatibility
  }

  // ========================================
  // Hero Background Slider (Auto + Swipe)
  // ========================================
  function initHeroBgSlider() {
    const hero = document.querySelector('.hero');
    const slides = Array.from(document.querySelectorAll('.hero .hero-slide'));
    const overlay = document.querySelector('.hero .hero-bg-overlay');
    if (!hero || slides.length === 0) return;

    // Lazy apply site image if data-src exists
    slides.forEach(slide => {
      if (slide.dataset && slide.dataset.src) {
        const url = slide.dataset.src;
        // Preload image (works with svg too)
        const img = new Image();
        img.onload = () => {
          slide.style.backgroundImage = `url('${url}')`;
        };
        img.onerror = () => {
          // Fallback to pattern-like light background
          slide.style.backgroundImage = 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)';
        };
        img.src = url;
      }
    });

    let current = slides.findIndex(s => s.classList.contains('is-active'));
    if (current === -1) current = 0;

    const show = (index) => {
      slides.forEach((s, i) => {
        if (i === index) s.classList.add('is-active');
        else s.classList.remove('is-active');
      });
    };

    const next = () => {
      current = (current + 1) % slides.length;
      show(current);
    };

    const prev = () => {
      current = (current - 1 + slides.length) % slides.length;
      show(current);
    };

    // Auto-rotate
    let timer = setInterval(next, 7000);

    // Pause on interaction
    const pause = () => { clearInterval(timer); };
    const resume = () => { timer = setInterval(next, 7000); };
    hero.addEventListener('mouseenter', pause);
    hero.addEventListener('mouseleave', resume);

    // Touch swipe support (simple)
    let touchStartX = 0;
    let touchEndX = 0;

    hero.addEventListener('touchstart', (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      touchStartX = e.changedTouches[0].screenX;
      pause();
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) { resume(); return; }
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) next(); else prev();
      }
      resume();
    }, { passive: true });
  }

  // ========================================
  // Scroll-triggered Animations with Stagger
  // ========================================
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '-50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          // Stagger animation delay
          setTimeout(() => {
            entry.target.classList.add('fade-in');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.vision-card, .product-card, .tech-card, .partner-card, .ci-card'
    );

    animatedElements.forEach(function(element) {
      observer.observe(element);
    });
  }

  // ========================================
  // Card Hover Effect (Handled by CSS)
  // ========================================
  function init3DCardEffect() {
    // Hover effects are now handled purely by CSS for better performance
    // See CSS for .tech-card:hover, .product-card:hover, etc.
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
      $('html, body').animate({ scrollTop: 0 }, 1000, 'swing');
    });

    $window.on('scroll', debounce(updateBackToTop, 100));
    updateBackToTop();
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
    const WEB_APP_URL = window.CLSSolutionGAS || '';

    function setFieldError($el, hasError, msg) {
      $el.attr('aria-invalid', hasError ? 'true' : 'false');
      let $msg = $el.siblings('.field-error');
      if (hasError) {
        if ($msg.length === 0) {
          $msg = $('<div class="field-error" role="alert"></div>').insertAfter($el);
        }
        $msg.text(msg);
      } else {
        $msg.remove();
      }
    }

    function validateEmail(email) {
      const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return re.test(String(email || '').trim());
    }

    function normalizePhone(raw) {
      let s = String(raw || '').replace(/[^\d+]/g, '');
      if (s.startsWith('+82')) s = '0' + s.slice(3);
      s = s.replace(/[^\d]/g, '');
      return s;
    }

    function validatePhone(phone) {
      if (!phone) return true; // optional
      const n = normalizePhone(phone);
      return n.length >= 10 && n.length <= 11;
    }

    $form.on('submit', function(e) {
      e.preventDefault();

      const $name = $('#name');
      const $email = $('#email');
      const $company = $('#company');
      const $phone = $('#phone');
      const $message = $('#message');
      const $website = $('#website'); // honeypot

      let hasError = false;
      const nameVal = ($name.val() || '').trim();
      const emailVal = ($email.val() || '').trim();
      const phoneVal = ($phone.val() || '').trim();
      const messageVal = ($message.val() || '').trim();

      if (!nameVal || nameVal.length < 2) {
        setFieldError($name, true, '이름을 확인해주세요.');
        hasError = true;
      } else setFieldError($name, false);

      if (!validateEmail(emailVal)) {
        setFieldError($email, true, '이메일 형식을 확인해주세요.');
        hasError = true;
      } else setFieldError($email, false);

      if (phoneVal && !validatePhone(phoneVal)) {
        setFieldError($phone, true, '전화번호를 확인해주세요.');
        hasError = true;
      } else setFieldError($phone, false);

      if (!messageVal || messageVal.length < 5) {
        setFieldError($message, true, '문의 내용을 입력해주세요.');
        hasError = true;
      } else setFieldError($message, false);

      if (hasError) return;
      if ($website && ($website.val() || '').trim()) return; // honeypot filled

      const payload = {
        name: nameVal,
        email: emailVal,
        company: ($company.val() || '').trim(),
        phone: phoneVal,
        message: messageVal,
        website: ($website.val() || '').trim()
      };

      const $btn = $form.find('button[type="submit"]');
      const prevText = $btn.text();
      $btn.prop('disabled', true).text('전송 중...');

      const url = (WEB_APP_URL || '').trim();
      const endpoint = url ? `${url}?ua=${encodeURIComponent(navigator.userAgent)}&ref=${encodeURIComponent(location.href)}` : '';

      const finish = (success) => {
        $btn.prop('disabled', false).text(prevText);
        if (success) {
          alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
          $form[0].reset();
          $('html, body').animate({ scrollTop: 0 }, 800);
        }
      };

      if (!endpoint) {
        console.warn('WEB_APP_URL 미설정 - 전송을 생략합니다.');
        finish(true);
        return;
      }

      setTimeout(async () => {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data && data.ok) finish(true);
          else {
            alert('전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
            finish(false);
          }
        } catch (err) {
          console.error(err);
          alert('네트워크 오류가 발생했습니다.');
          finish(false);
        }
      }, 450 + Math.floor(Math.random() * 400)); // 가벼운 지연
    });
  }

  // ========================================
  // Active Navigation Link Highlighting (Enhanced with Intersection Observer)
  // ========================================
  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id], .hero');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const indicatorItems = document.querySelectorAll('.indicator-item');
    const sectionLabel = document.getElementById('current-section-label');
    const sectionLabelText = sectionLabel ? sectionLabel.querySelector('.section-label-text') : null;

    const sectionNames = {
      'hero': '홈',
      'vision': '회사소개',
      'ci': 'CI',
      'products': '제품',
      'technology': '기술·R&D',
      'partners': '파트너사',
      'ceo-message': 'CEO 메시지',
      'cta': 'CTA',
      'contact': '문의하기',
      'footer': 'Footer'
    };

    let currentSection = 'hero';
    let labelTimeout;

    // Intersection Observer for accurate section tracking
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.classList[0];
          currentSection = sectionId;

          // Update navigation links
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });

          // Update section indicator dots
          indicatorItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
              item.classList.add('active');
            }
          });

          // Update section label (mobile)
          if (sectionLabelText && sectionNames[sectionId]) {
            sectionLabelText.textContent = sectionNames[sectionId];
            sectionLabel.classList.add('show');

            // Auto-hide after 2 seconds
            clearTimeout(labelTimeout);
            labelTimeout = setTimeout(() => {
              sectionLabel.classList.remove('show');
            }, 2000);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
    });

    // Click handlers for smooth scrolling
    const allScrollLinks = [...navLinks, ...indicatorItems];
    allScrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId) || document.querySelector(`.${targetId}`);

        if (targetSection) {
          const headerOffset = 80;
          const elementPosition = targetSection.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Show section label briefly on initial load (mobile)
    if (sectionLabelText) {
      setTimeout(() => {
        sectionLabelText.textContent = sectionNames['hero'];
        sectionLabel.classList.add('show');
        setTimeout(() => {
          sectionLabel.classList.remove('show');
        }, 2000);
      }, 500);
    }
  }

  // ========================================
  // Lazy Loading Images
  // ========================================
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(script);
    }
  }

  // ========================================
  // Accessibility Enhancements
  // ========================================
  function initAccessibility() {
    $('a, button').on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        $(this).trigger('click');
      }
    });

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
        zIndex: 10000
      }
    }).prependTo($body).on('focus', function() {
      $(this).css('top', '0');
    }).on('blur', function() {
      $(this).css('top', '-40px');
    });
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
  // Modal System
  // ========================================
  function initModal() {
    const $modalOverlay = $('#modal-overlay');
    const $modalTitle = $('#modal-title');
    const $modalBody = $('#modal-body');
    const $modalFooter = $('#modal-footer');
    const $modalClose = $('#modal-close');
    let focusableElements = [];
    let firstFocusable;
    let lastFocusable;

    // Modal trigger buttons
    $(document).on('click', '.modal-trigger', function(e) {
      e.preventDefault();
      const modalId = $(this).data('modal');
      openModal(modalId);
    });

    // Close button
    $modalClose.on('click', closeModal);

    // Overlay click to close
    $modalOverlay.on('click', function(e) {
      if ($(e.target).is('#modal-overlay')) {
        closeModal();
      }
    });

    // ESC key to close
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $modalOverlay.hasClass('active')) {
        closeModal();
      }
    });

    // Modal footer links (e.g., "문의하기" button)
    $modalOverlay.on('click', '.modal-footer a[href^="#"]', function(e) {
      const targetId = $(this).attr('href');
      closeModal();

      // Smooth scroll to target section
      setTimeout(() => {
        const $target = $(targetId);
        if ($target.length) {
          $('html, body').animate({
            scrollTop: $target.offset().top - 80
          }, 600, 'easeInOutCubic');
        }
      }, 300); // Wait for modal close animation
    });

    // Focus trap
    $(document).on('keydown', function(e) {
      if (!$modalOverlay.hasClass('active') || e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });

    function openModal(modalId) {
      const content = getModalContent(modalId);

      if (!content) {
        console.error(`Modal content not found for: ${modalId}`);
        return;
      }

      // Set content
      $modalTitle.html(content.title);
      $modalBody.html(content.body);
      $modalFooter.html(content.footer || '');

      // Show modal
      $modalOverlay.addClass('active');
      $('body').addClass('modal-open');

      // Set up focus trap
      setupFocusTrap();

      // Focus first element
      setTimeout(() => {
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);
    }

    function closeModal() {
      $modalOverlay.removeClass('active');
      $('body').removeClass('modal-open');

      // Clear focus trap
      focusableElements = [];
      firstFocusable = null;
      lastFocusable = null;
    }

    function setupFocusTrap() {
      focusableElements = $modalOverlay.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').toArray();
      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];
    }

    function getModalContent(modalId) {
      const modalData = {
        'product-01': {
          title: 'SECOND EYES 01 - AI 기반 자재·차량 자동 구분 시스템',
          body: `
            <div class="modal-section">
              <h3 class="modal-section-title">제품 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>SECOND EYES 01</strong>은 딥러닝 기반 컴퓨터 비전 기술로 건설 현장의 자재와 차량을 실시간으로 인식하고 분류하는 AI 솔루션입니다.
                  사람의 육안으로 확인하기 어려운 부분까지 AI가 정확하게 감지하여 현장 관리의 효율성과 정확성을 극대화합니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">핵심 기능</h3>
              <div class="modal-grid">
                <div class="modal-card">
                  <h4 class="modal-card-title">📦 10종 자재 인식</h4>
                  <div class="modal-card-content">
                    흙, 모래, 암, 철근, 철골, 아스콘, 시멘트, 몰탈, 폐기물, 기타 등 건설 현장의 모든 주요 자재를 98.5% 이상의 정확도로 구분합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🚛 4종 차량 분류</h4>
                  <div class="modal-card-content">
                    레미콘, 트럭, 덤프, 벌크 등 차량 유형을 자동으로 분류하며, 각 차량의 크기(대/중/소)까지 구분합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">⚡ 실시간 처리</h4>
                  <div class="modal-card-content">
                    평균 0.3초 이내에 AI 분석을 완료하여 실시간 현장 관리가 가능합니다. 엣지 컴퓨팅으로 네트워크 지연 없이 즉시 처리됩니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">📊 데이터 자동 기록</h4>
                  <div class="modal-card-content">
                    인식 결과를 자동으로 데이터베이스에 저장하고, 실시간 리포트를 생성하여 현장 관리자에게 제공합니다.
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">기술 사양</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>AI 모델:</strong> CNN 기반 Deep Learning (ResNet, EfficientNet 등)</li>
                  <li><strong>인식 정확도:</strong> 98.5% 이상 (10종 자재, 4종 차량)</li>
                  <li><strong>처리 속도:</strong> 평균 0.3초 (엣지 디바이스 기준)</li>
                  <li><strong>카메라:</strong> Intflow 비전 센싱 카메라 (1080p 이상)</li>
                  <li><strong>통신:</strong> CAS 저울/축중기 프로토콜 연동</li>
                  <li><strong>LPR:</strong> Silicon Bridge 차량번호판 인식 시스템</li>
                  <li><strong>엣지 컴퓨팅:</strong> NVIDIA Jetson 시리즈 또는 동급</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">적용 효과</h3>
              <div class="modal-stats">
                <div class="modal-stat">
                  <span class="modal-stat-value">95%</span>
                  <span class="modal-stat-label">업무 시간 단축</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">99%</span>
                  <span class="modal-stat-label">데이터 정확도</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">80%</span>
                  <span class="modal-stat-label">인력 절감</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">15+</span>
                  <span class="modal-stat-label">현장 적용</span>
                </div>
              </div>
            </div>
            
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        'product-02': {
          title: 'SECOND EYES 02 - AI 기반 속도-무게 자동보정 시스템',
          body: `
            <div class="modal-section">
              <h3 class="modal-section-title">제품 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>SECOND EYES 02</strong>는 회귀분석 알고리즘을 통해 축중기의 저속 주행 오차를 자동으로 보정하여
                  정밀한 중량 측정을 제공하는 AI 솔루션입니다. 차량의 주행 속도에 따라 발생하는 측정 오차를 AI가 실시간으로
                  보정하여 ±2% 이내의 높은 정밀도를 보장합니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">핵심 기능</h3>
              <div class="modal-grid">
                <div class="modal-card">
                  <h4 class="modal-card-title">📊 9개 속도 구간 보정</h4>
                  <div class="modal-card-content">
                    0-40km/h 구간을 5km/h 단위로 9개 구간으로 세분화하여 각 구간별 최적화된 보정 계수를 적용합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🧮 다중 회귀 분석</h4>
                  <div class="modal-card-content">
                    속도, 차량 유형, 적재량 등 다변수 데이터를 분석하여 정밀한 보정값을 산출합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">⏱️ 실시간 보정</h4>
                  <div class="modal-card-content">
                    측정 즉시 AI 보정값을 적용하여 실시간으로 정확한 중량 데이터를 제공합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🔄 학습 모델 업데이트</h4>
                  <div class="modal-card-content">
                    현장 데이터를 기반으로 지속적으로 학습하여 정확도를 개선합니다.
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">회귀분석 알고리즘</h3>
              <div class="modal-section-content">
                <p>
                  SECOND EYES 02는 다중 회귀 분석(Multiple Regression Analysis)을 기반으로 한 AI 모델을 사용합니다.
                </p>
                <ul>
                  <li><strong>입력 변수:</strong> 차량 주행 속도, 차량 유형, 적재 상태, 환경 조건 등</li>
                  <li><strong>출력 값:</strong> 실제 중량에 대한 보정 계수</li>
                  <li><strong>정확도:</strong> ±2% 이내 (표준 축중기 대비)</li>
                  <li><strong>학습 데이터:</strong> 50,000건 이상의 현장 실측 데이터</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">적용 효과</h3>
              <div class="modal-stats">
                <div class="modal-stat">
                  <span class="modal-stat-value">±2%</span>
                  <span class="modal-stat-label">측정 오차</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">70%</span>
                  <span class="modal-stat-label">측정 시간 단축</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">9</span>
                  <span class="modal-stat-label">속도 구간</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">50K+</span>
                  <span class="modal-stat-label">학습 데이터</span>
                </div>
              </div>
            </div>
            
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - CAS
        'partner-cas': {
          title: 'CAS (주식회사 카스)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Tech Partner</span>
                <span class="modal-badge">저울/축중기</span>
                <span class="modal-badge">하드웨어 연동</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>CAS</strong>는 저울 및 축중기 전문 기업으로, SECOND EYES 시스템과의 통신 프로토콜 연동을 담당합니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">협력 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>통신 프로토콜 연동:</strong> CLS Solution의 SECOND EYES 시스템과 CAS 저울/축중기 간의 데이터 통신</li>
                  <li><strong>하드웨어 통합:</strong> 축중기 및 저울 장비의 SECOND EYES 시스템 통합</li>
                  <li><strong>정밀 계량:</strong> 건설 현장 자재 및 차량 중량 측정</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">SECOND EYES 연동</h3>
              <div class="modal-section-content">
                <p>
                  CAS 저울 및 축중기는 SECOND EYES 01 (자재·차량 구분)과 SECOND EYES 02 (속도-무게 자동보정) 시스템에 필수적인 하드웨어 파트너입니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - KICT
        'partner-kict': {
          title: 'KICT (한국건설기술연구원)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Tech Partner</span>
                <span class="modal-badge">공동연구</span>
                <span class="modal-badge">기술검증</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>한국건설기술연구원(KICT)</strong>은 국책 연구기관으로, CLS Solution과 AI 비전센싱 기술 공동 개발 및 현장 검증을 진행하고 있습니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">공동 연구 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>AI 비전센싱 기술 개발:</strong> 건설 현장 자재 및 차량 인식 AI 모델 공동 개발</li>
                  <li><strong>현장 검증:</strong> 실제 건설 현장에서의 기술 검증 및 피드백</li>
                  <li><strong>기술 표준화:</strong> 스마트건설 분야 AI 기술 표준 연구</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">연구 성과</h3>
              <div class="modal-section-content">
                <p>
                  KICT와의 공동연구를 통해 15개 이상의 건설 현장에서 실증이 완료되었으며, 50,000건 이상의 데이터를 처리했습니다.
                  특허 출원도 완료하여 AI 기반 자재/차량 구분 및 무게 보정 알고리즘에 대한 지적재산권을 확보했습니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - Intflow
        'partner-intflow': {
          title: 'Intflow (인트플로우)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Tech Partner</span>
                <span class="modal-badge">비전 센싱</span>
                <span class="modal-badge">카메라</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>Intflow</strong>는 비전 센싱 카메라 전문 기업으로, 고화질 영상 캡처 및 실시간 스트리밍을 지원합니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">협력 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>비전 센싱 카메라:</strong> SECOND EYES 시스템에 최적화된 고화질 카메라 제공</li>
                  <li><strong>실시간 스트리밍:</strong> 건설 현장의 영상을 실시간으로 AI 시스템에 전송</li>
                  <li><strong>영상 품질 관리:</strong> AI 인식에 최적화된 화질 및 프레임레이트 유지</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">SECOND EYES 연동</h3>
              <div class="modal-section-content">
                <p>
                  Intflow 비전 센싱 카메라는 SECOND EYES 01의 자재 및 차량 인식을 위한 핵심 하드웨어로,
                  98.5% 이상의 높은 AI 인식 정확도를 실현하는 데 중요한 역할을 합니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - Silicon Bridge
        'partner-siliconbridge': {
          title: 'Silicon Bridge (실리콘브릿지)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Tech Partner</span>
                <span class="modal-badge">LPR</span>
                <span class="modal-badge">차량인식</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>Silicon Bridge</strong>는 LPR (차량번호판 인식) 전문 기업으로, 차량 진출입 관리 시스템을 제공합니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">협력 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>차량번호판 인식 (LPR):</strong> 건설 현장 출입 차량의 번호판 자동 인식</li>
                  <li><strong>차량 진출입 관리:</strong> 출입 차량 데이터 기록 및 관리</li>
                  <li><strong>SECOND EYES 통합:</strong> 차량 인식 데이터와 SECOND EYES 자재/차량 구분 시스템 연동</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">SECOND EYES 연동</h3>
              <div class="modal-section-content">
                <p>
                  Silicon Bridge LPR 시스템은 SECOND EYES 01의 차량 인식 기능과 연동되어,
                  차량 번호판 정보와 AI 기반 차량 유형 분류를 통합적으로 관리합니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - Ilmani
        'partner-ilmani': {
          title: 'Ilmani (일마니)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Sales Partner</span>
                <span class="modal-badge">자재관리</span>
                <span class="modal-badge">판매파트너</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>Ilmani</strong>는 건설 현장 자재 계측 관리 솔루션 전문 기업으로, SECOND EYES의 주요 판매 파트너입니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">협력 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>SECOND EYES 판매:</strong> 건설 현장에 SECOND EYES 솔루션 공급</li>
                  <li><strong>자재 계측 관리:</strong> 건설 현장 자재 관리 솔루션과의 통합</li>
                  <li><strong>현장 지원:</strong> SECOND EYES 도입 현장에 대한 기술 지원</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">SECOND EYES 판매 채널</h3>
              <div class="modal-section-content">
                <p>
                  Ilmani는 건설 현장에 대한 깊은 이해와 자재 관리 솔루션 경험을 바탕으로,
                  SECOND EYES를 건설 현장에 효과적으로 보급하는 핵심 파트너입니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Partner Modals - The Invention Lab
        'partner-til': {
          title: 'The Invention Lab (더인벤션랩)',
          body: `
            <div class="modal-section">
              <div class="modal-section-content">
                <span class="modal-badge">Sales Partner</span>
                <span class="modal-badge">시드투자</span>
                <span class="modal-badge">전략파트너</span>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">파트너 개요</h3>
              <div class="modal-section-content">
                <p>
                  <strong>The Invention Lab</strong>은 CLS Solution의 초기 시드 투자사로, 기술 개발 및 시장 진출을 지원하고 있습니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">지원 분야</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>시드 투자:</strong> CLS Solution 초기 사업 자금 투자</li>
                  <li><strong>기술 개발 지원:</strong> AI 비전 기술 및 SECOND EYES 개발 지원</li>
                  <li><strong>시장 진출 전략:</strong> 건설 시장 진출 전략 수립 및 실행 지원</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">전략적 파트너십</h3>
              <div class="modal-section-content">
                <p>
                  The Invention Lab은 단순한 투자사를 넘어 CLS Solution의 성장을 위한 전략적 파트너로서,
                  기술 개발부터 시장 진출까지 전 과정을 함께하고 있습니다.
                </p>
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Tech Modals - AI Vision Sensing
        'tech-vision': {
          title: 'AI 비전센싱 기술',
          body: `
            <div class="modal-section">
              <h3 class="modal-section-title">기술 개요</h3>
              <div class="modal-section-content">
                <p>
                  딥러닝 기반 컴퓨터 비전으로 건설 현장의 자재와 차량을 실시간으로 분류하는 AI 기술입니다.
                  CNN 기반 이미지 분류 및 객체 탐지 알고리즘을 통해 98.5% 이상의 높은 인식 정확도를 달성했습니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">핵심 기술 요소</h3>
              <div class="modal-grid">
                <div class="modal-card">
                  <h4 class="modal-card-title">🧠 Computer Vision + Deep Learning</h4>
                  <div class="modal-card-content">
                    CNN 기반 이미지 분류 및 객체 탐지 알고리즘을 사용하여 자재와 차량을 정밀하게 인식합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🎯 고정밀 AI 비전</h4>
                  <div class="modal-card-content">
                    10종 자재와 4종 차량을 98.5% 이상의 정확도로 구분합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🔄 강화학습 모델</h4>
                  <div class="modal-card-content">
                    현장 데이터 기반 지속적 학습 및 정확도 향상을 통해 성능을 개선합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">⚡ 엣지 컴퓨팅</h4>
                  <div class="modal-card-content">
                    실시간 AI 추론으로 평균 처리 시간 0.3초를 달성했습니다.
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">인식 대상</h3>
              <div class="modal-section-content">
                <ul>
                  <li><strong>10종 자재:</strong> 흙, 모래, 암, 철근, 철골, 아스콘, 시멘트, 몰탈, 폐기물, 기타</li>
                  <li><strong>4종 차량:</strong> 레미콘, 트럭, 덤프, 벌크 (각 대/중/소 크기 구분)</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">성능 지표</h3>
              <div class="modal-stats">
                <div class="modal-stat">
                  <span class="modal-stat-value">98.5%</span>
                  <span class="modal-stat-label">인식 정확도</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">0.3초</span>
                  <span class="modal-stat-label">평균 처리 시간</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">10+4</span>
                  <span class="modal-stat-label">자재+차량 종류</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">50K+</span>
                  <span class="modal-stat-label">처리 건수</span>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <div class="modal-section-content" style="text-align: center;">
                <img src="assets/svg/neural-network.svg" alt="AI 비전센싱 기술 다이어그램" style="max-width: 100%; height: auto;" />
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        },
        // Tech Modals - AI Weight Calibration
        'tech-calibration': {
          title: 'AI 속도-무게 자동보정 기술',
          body: `
            <div class="modal-section">
              <h3 class="modal-section-title">기술 개요</h3>
              <div class="modal-section-content">
                <p>
                  회귀분석 알고리즘으로 축중기의 저속 주행 오차를 자동으로 보정하는 AI 기술입니다.
                  0-40km/h 구간을 9개 속도 구간으로 세분화하여 각 구간별 최적화된 보정 계수를 적용, ±2% 이내의 정밀도를 달성했습니다.
                </p>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">핵심 기술 요소</h3>
              <div class="modal-grid">
                <div class="modal-card">
                  <h4 class="modal-card-title">📊 저속 주행 보정</h4>
                  <div class="modal-card-content">
                    0-40km/h 구간의 속도별 오차를 자동으로 보정합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🧮 다중 회귀 분석</h4>
                  <div class="modal-card-content">
                    속도, 차량 유형, 적재량 등 다변수 분석 모델을 사용합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">🎚️ 9개 속도 구간</h4>
                  <div class="modal-card-content">
                    5km/h 단위로 세분화된 보정 계수를 적용합니다.
                  </div>
                </div>
                <div class="modal-card">
                  <h4 class="modal-card-title">⏱️ 실시간 데이터 처리</h4>
                  <div class="modal-card-content">
                    측정 즉시 AI 보정값을 적용하여 ±2% 이내 정밀도를 보장합니다.
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">9개 속도 구간</h3>
              <div class="modal-section-content">
                <p>각 속도 구간별로 최적화된 보정 계수를 적용하여 정확도를 향상시킵니다:</p>
                <ul>
                  <li>0-5 km/h, 5-10 km/h, 10-15 km/h</li>
                  <li>15-20 km/h, 20-25 km/h, 25-30 km/h</li>
                  <li>30-35 km/h, 35-40 km/h, 40+ km/h</li>
                </ul>
              </div>
            </div>

            <div class="modal-section">
              <h3 class="modal-section-title">성능 지표</h3>
              <div class="modal-stats">
                <div class="modal-stat">
                  <span class="modal-stat-value">±2%</span>
                  <span class="modal-stat-label">측정 정밀도</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">9</span>
                  <span class="modal-stat-label">속도 구간</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">0-40</span>
                  <span class="modal-stat-label">보정 범위 (km/h)</span>
                </div>
                <div class="modal-stat">
                  <span class="modal-stat-value">50K+</span>
                  <span class="modal-stat-label">학습 데이터</span>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <div class="modal-section-content" style="text-align: center;">
                <img src="assets/svg/chart.svg" alt="AI 속도-무게 자동보정 차트" style="max-width: 100%; height: auto;" />
              </div>
            </div>
          `,
          footer: `
            <a href="#contact" class="btn btn-primary">문의하기</a>
          `
        }
      };

      return modalData[modalId];
    }
  }

  // ========================================
  // Initialize All Functions
  // ========================================
  function init() {
    console.log('CLS Solution Website v2.0 Initialized');

    // Core functionality
    initDarkMode();
    initMobileMenu();
    initHeaderScroll();
    initScrollProgress();
    initSmoothScroll();
    initBackToTop();

    // Enhanced animations
    initEnhancedParallax();
    initSectionParallax();
    initImageParallax();
    initNumberCounters();
    initScrollAnimations();
    init3DCardEffect();
    initHeroBgSlider();

    // Content & Interactions
    loadSVGIllustrations();
    initContactForm();
    initActiveNavLinks();
    initModal();

    // Performance & Accessibility
    initLazyLoading();
    initAccessibility();
    monitorPerformance();

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
  // Window Load
  // ========================================
  $(window).on('load', function() {
    console.log('All resources loaded');
  });

  // ========================================
  // Expose public API
  // ========================================
  window.CLSSolution = {
    version: '2.0.0',
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
