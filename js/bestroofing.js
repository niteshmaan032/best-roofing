/* Goldenberg Roofing NYC — bestroofing.html */
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
      'e-address': 'Enter the property address'
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

    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[required]'));

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

}());
