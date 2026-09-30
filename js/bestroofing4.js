/* Goldenberg Roofing NYC — bestroofing4.html */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Dropdown panels: hover opens on desktop, click toggles everywhere, Escape
     and an outside click close. Only one panel is open at a time. */
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.menu__item--has-panel'));
    if (!items.length) return;

    var hoverable = window.matchMedia('(hover: hover)');
    var timers = new WeakMap();

    function panelOf(item) { return item.querySelector('.panel'); }
    function triggerOf(item) { return item.querySelector('.menu__trigger'); }

    function open(item) {
      items.forEach(function (other) { if (other !== item) close(other); });
      var panel = panelOf(item);
      panel.hidden = false;
      // Next frame, so the transition from hidden has a starting state.
      requestAnimationFrame(function () { panel.classList.add('is-open'); });
      triggerOf(item).setAttribute('aria-expanded', 'true');
    }

    function close(item) {
      var panel = panelOf(item);
      if (panel.hidden) return;
      panel.classList.remove('is-open');
      triggerOf(item).setAttribute('aria-expanded', 'false');
      var done = function () { panel.hidden = true; };
      if (reduced.matches) done(); else setTimeout(done, 170);
    }

    items.forEach(function (item) {
      var trigger = triggerOf(item);

      trigger.addEventListener('click', function () {
        if (trigger.getAttribute('aria-expanded') === 'true') close(item); else open(item);
      });

      if (hoverable.matches) {
        item.addEventListener('mouseenter', function () {
          clearTimeout(timers.get(item));
          open(item);
        });
        item.addEventListener('mouseleave', function () {
          timers.set(item, setTimeout(function () { close(item); }, 140));
        });
      }

      item.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { close(item); trigger.focus(); }
      });

      item.addEventListener('focusout', function (event) {
        if (!item.contains(event.relatedTarget)) close(item);
      });
    });

    document.addEventListener('click', function (event) {
      items.forEach(function (item) { if (!item.contains(event.target)) close(item); });
    });
  }());

  /* FAQ accordion: one answer at a time with measured height animation. */
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq__list .qa'));
    if (!items.length) return;

    function close(item) {
      if (!item.open) return;
      if (reduced.matches || !item.animate) { item.open = false; return; }
      var start = item.offsetHeight;
      var end = item.querySelector('.qa__q').offsetHeight;
      var answer = item.querySelector('.qa__a');
      var motion = item.animate([{ height: start + 'px' }, { height: end + 'px' }], {
        duration: 240,
        easing: 'cubic-bezier(.22,.61,.36,1)'
      });
      var fade = answer ? answer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }) : null;
      motion.onfinish = function () {
        item.open = false;
        item.style.height = '';
        if (fade) fade.cancel();
      };
    }

    function open(item) {
      items.forEach(function (other) { if (other !== item) close(other); });
      if (reduced.matches || !item.animate) { item.open = true; return; }
      item.open = true;
      var start = item.querySelector('.qa__q').offsetHeight;
      var end = item.scrollHeight;
      item.animate([{ height: start + 'px' }, { height: end + 'px' }], {
        duration: 300,
        easing: 'cubic-bezier(.22,.61,.36,1)'
      });
    }

    items.forEach(function (item) {
      var summary = item.querySelector('.qa__q');
      summary.addEventListener('click', function (event) {
        event.preventDefault();
        if (item.open) close(item); else open(item);
      });
    });
  }());

  /* Mobile drawer. */
  (function () {
    var drawer = document.getElementById('drawer');
    var burger = document.querySelector('.bar__burger');
    if (!drawer || !burger) return;

    var lastFocus = null;

    function openDrawer() {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = drawer.querySelector('.drawer__close');
      if (first) first.focus();
    }

    function closeDrawer() {
      drawer.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', openDrawer);
    drawer.querySelectorAll('[data-drawer-close]').forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
    drawer.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeDrawer();
    });
    drawer.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    drawer.querySelectorAll('.drawer__group').forEach(function (button) {
      button.addEventListener('click', function () {
        var sub = button.nextElementSibling;
        var on = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', on ? 'false' : 'true');
        if (sub) sub.hidden = on;
      });
    });
  }());

  /* Hero video: do not autoplay under reduced motion; the poster carries it. */
  (function () {
    var video = document.querySelector('.hero__video');
    if (!video) return;
    if (reduced.matches) { video.removeAttribute('autoplay'); video.pause(); return; }
    var play = video.play();
    if (play && play.catch) play.catch(function () {});
  }());

  /* Estimate form: inline validation, then a done state in place. */
  (function () {
    var form = document.getElementById('estimate-form');
    var done = document.getElementById('estimate-done');
    if (!form || !done) return;

    var MESSAGES = {
      'e-name': 'Enter your name',
      'e-phone': 'Enter your phone number',
      'e-email': 'Enter your email',
      'e-address': 'Enter the property address',
      'e-message': 'Tell us what is happening with the roof'
    };

    function fieldOf(input) { return input.closest('.field'); }
    function errorOf(input) { return form.querySelector('[data-error-for="' + input.id + '"]'); }

    function setError(input, message) {
      var wrap = fieldOf(input), slot = errorOf(input);
      if (!wrap || !slot) return;
      wrap.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      slot.textContent = message || '';
      slot.hidden = !message;
    }

    function validate(input) {
      var value = (input.value || '').trim();
      var message = '';
      if (!value) message = MESSAGES[input.id] || 'Required';
      else if (input.type === 'tel' && value.replace(/\D/g, '').length < 10) message = 'Include the area code';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email';
      setError(input, message);
      return !message;
    }

    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input).classList.contains('is-invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) { if (!validate(input) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }
      // No endpoint is wired yet: POST the collected values from here.
      form.hidden = true;
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus();
    });
  }());


  /* Recent Work photo viewer: the same Swiper lightbox as the Royal projects
     page, with the thumbnail strip. Slides are built from the tiles on open. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  function initLightbox() {
    var box = document.getElementById('lightbox');
    var triggers = [].slice.call(document.querySelectorAll('.bento__trigger'));
    if (!box || !triggers.length || typeof window.Swiper !== 'function') return;

    var wrapper = box.querySelector('.swiper-wrapper');
    var caption = box.querySelector('[data-lightbox-caption]');
    /* Optional: a strip of thumbnails under the caption. Only the projects
       page carries the container, so the homepage viewer is unchanged. */
    var thumbs = box.querySelector('[data-lightbox-thumbs]');
    var indexEl = box.querySelector('[data-lightbox-index]');
    var totalEl = box.querySelector('[data-lightbox-total]');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var lastFocused = null;
    var swiper = null;

    /* Rebuilt per open rather than once at start-up. The gallery is tabbed, so
       "all the triggers on the page" is the wrong set — the viewer should hold
       the panel the user is actually looking at, and nothing else. */
    var shots = [];

    function build(group) {
      shots = group.map(function (trigger) {
        var img = trigger.querySelector('img');
        return {
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt') || '',
          /* The tile's own caption (title, place, date) where it has one. */
          caption: trigger.getAttribute('data-caption') || img.getAttribute('alt') || ''
        };
      });

      totalEl.textContent = shots.length;

      /* swiper-zoom-container is what the zoom module binds to. */
      wrapper.innerHTML = shots.map(function (shot) {
        return '<div class="swiper-slide">' +
                 '<div class="swiper-zoom-container">' +
                   '<img src="' + shot.src + '" alt="' + shot.alt + '">' +
                 '</div>' +
               '</div>';
      }).join('');

      if (thumbs) {
        thumbs.innerHTML = shots.map(function (shot, i) {
          return '<button class="lightbox__thumb" type="button" data-index="' + i + '" ' +
                   'aria-label="Show image ' + (i + 1) + ' of ' + shots.length + '">' +
                   '<img src="' + shot.src + '" alt="" loading="lazy" decoding="async">' +
                 '</button>';
        }).join('');
      }

      if (swiper) swiper.update();
    }

    function sync() {
      if (!swiper || !shots[swiper.activeIndex]) return;
      var active = swiper.activeIndex;
      indexEl.textContent = active + 1;
      caption.textContent = shots[active].caption;

      if (!thumbs) return;
      [].forEach.call(thumbs.children, function (thumb, i) {
        var on = i === active;
        thumb.classList.toggle('is-active', on);
        if (on) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
        /* Keep the active thumbnail in view without scrolling the page. */
        if (on) {
          var left = thumb.offsetLeft - (thumbs.clientWidth - thumb.offsetWidth) / 2;
          thumbs.scrollTo({ left: left, behavior: reduced.matches ? 'auto' : 'smooth' });
        }
      });
    }

    /* Siblings of the clicked trigger — its panel if it is in one, the whole
       page if it is not, so this keeps working on any untabbed gallery. */
    function groupFor(trigger) {
      var scope = trigger.closest('.projects__panel') || document;
      return [].slice.call(scope.querySelectorAll('.bento__trigger'));
    }

    function open(trigger) {
      var group = groupFor(trigger);
      var index = group.indexOf(trigger);
      if (index < 0) index = 0;

      lastFocused = document.activeElement;
      build(group);

      box.hidden = false;
      document.body.classList.add('is-locked');

      if (!swiper) {
        swiper = new window.Swiper(box.querySelector('.lightbox__swiper'), {
          initialSlide: index,
          speed: reduced.matches ? 0 : 350,
          zoom: { maxRatio: 3 },
          keyboard: { enabled: true },
          navigation: {
            prevEl: '.lightbox__nav--prev',
            nextEl: '.lightbox__nav--next'
          },
          on: { slideChange: sync }
        });
      } else {
        swiper.slideTo(index, 0);
      }

      sync();
      box.querySelector('.lightbox__btn--close').focus();
    }

    function close() {
      if (swiper) swiper.zoom.out();
      box.hidden = true;
      document.body.classList.remove('is-locked');
      if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () { open(trigger); });
    });

    box.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    if (thumbs) {
      thumbs.addEventListener('click', function (event) {
        var thumb = event.target.closest('.lightbox__thumb');
        if (!thumb || !swiper) return;
        swiper.zoom.out();
        swiper.slideTo(Number(thumb.getAttribute('data-index')));
      });
    }

    box.querySelector('[data-lightbox-zoom-in]').addEventListener('click', function () {
      if (swiper) swiper.zoom.in();
    });

    box.querySelector('[data-lightbox-zoom-out]').addEventListener('click', function () {
      if (swiper) swiper.zoom.out();
    });

    /* Escape closes; Tab is kept inside the panel while it is open. */
    box.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { close(); return; }
      if (event.key !== 'Tab') return;

      var items = [].slice.call(box.querySelectorAll(FOCUSABLE))
        .filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function bootLightbox() {
    if (typeof window.Swiper === 'function') { initLightbox(); return; }
    var tries = 0;
    var t = setInterval(function () {
      if (typeof window.Swiper === 'function' || ++tries > 40) { clearInterval(t); if (typeof window.Swiper === 'function') initLightbox(); }
    }, 100);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootLightbox);
  else bootLightbox();

}());
