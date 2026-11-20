/* ==========================================================================
   Goldenberg Roofing Brooklyn: shared behaviour (every page)
   No dependencies. Each block looks for its own hooks and does nothing on
   pages that do not have them.

     1. Desktop dropdowns             .gk-nav__link[aria-controls]
     2. Mobile drawer                 .gk-burger / #gk-drawer
     3. Quote forms                   form[data-gk-form] + [data-gk-form-done]
     4. FAQ one open at a time        details.gk-faq__item[name]
   ========================================================================== */
(function () {
  'use strict';

  var DESKTOP = window.matchMedia('(min-width: 88.01rem)');   // nav shows above 1408px, as on Bronx
  var HOVER = window.matchMedia('(hover: hover) and (pointer: fine)');
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };


  /* 1. Desktop dropdowns ---------------------------------------------------
     Click/keyboard toggle through aria-expanded + hidden. With a mouse,
     hovering the item opens it too. Escape, a click outside or tabbing out
     closes it. */
  (function dropdowns() {
    var triggers = $$('.gk-nav__link[aria-controls]');
    if (!triggers.length) return;

    function panelOf(trigger) { return document.getElementById(trigger.getAttribute('aria-controls')); }
    function set(trigger, open) {
      var panel = panelOf(trigger);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (panel) panel.hidden = !open;
    }
    function closeAll(except) { triggers.forEach(function (t) { if (t !== except) set(t, false); }); }

    triggers.forEach(function (trigger) {
      var item = trigger.closest('.gk-nav__item');
      var timer = null;
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        var open = trigger.getAttribute('aria-expanded') !== 'true';
        closeAll(trigger);
        set(trigger, open);
      });
      if (!item) return;
      item.addEventListener('mouseenter', function () {
        if (!HOVER.matches || !DESKTOP.matches) return;
        window.clearTimeout(timer);
        closeAll(trigger);
        set(trigger, true);
      });
      item.addEventListener('mouseleave', function () {
        if (!HOVER.matches || !DESKTOP.matches) return;
        timer = window.setTimeout(function () { set(trigger, false); }, 140);
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.gk-nav__item')) closeAll();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      triggers.forEach(function (t) {
        var inside = t.closest('.gk-nav__item').contains(document.activeElement);
        if (t.getAttribute('aria-expanded') === 'true') {
          set(t, false);
          if (inside) t.focus();
        }
      });
    });
    document.addEventListener('focusin', function (event) {
      triggers.forEach(function (t) {
        if (!t.closest('.gk-nav__item').contains(event.target)) set(t, false);
      });
    });
    DESKTOP.addEventListener('change', function () { closeAll(); });
  }());


  /* 2. Mobile drawer -------------------------------------------------------
     The drawer sits inside the header and drops down under it (as on the
     Bronx site). The menu button turns into an X while it is open. Escape,
     a click outside the header or any link inside closes it. */
  (function drawer() {
    var toggle = document.querySelector('.gk-burger');
    var root = document.getElementById('gk-drawer');
    if (!toggle || !root) return;
    var header = toggle.closest('.gk-header') || document.body;

    function set(open) {
      root.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    function isOpen() { return !root.hidden; }

    toggle.addEventListener('click', function () { set(!isOpen()); });
    document.addEventListener('click', function (event) {
      if (isOpen() && !header.contains(event.target)) set(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) { set(false); toggle.focus(); }
    });
    // Links (including same-page anchors) close the drawer.
    $$('a[href]', root).forEach(function (link) { link.addEventListener('click', function () { set(false); }); });

    // Roofing / Siding groups: collapsed by default, one open at a time.
    var groupBtns = $$('.gk-drawer__link[aria-controls]', root);
    groupBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var willOpen = btn.getAttribute('aria-expanded') !== 'true';
        groupBtns.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          var sub = document.getElementById(other.getAttribute('aria-controls'));
          if (sub) sub.hidden = true;
        });
        if (willOpen) {
          btn.setAttribute('aria-expanded', 'true');
          var mine = document.getElementById(btn.getAttribute('aria-controls'));
          if (mine) mine.hidden = false;
        }
      });
    });

    DESKTOP.addEventListener('change', function (e) { if (e.matches) set(false); });
  }());


  /* 3. Quote forms ---------------------------------------------------------
     Every field is required. Errors appear under the field; a valid form is
     swapped for the thank-you block that sits right after it. */
  (function forms() {
    var forms = $$('form[data-gk-form]');
    if (!forms.length) return;

    var MESSAGES = {
      name: 'Please enter your name.',
      phone: 'Please enter your phone number.',
      phoneBad: 'Please enter a 10-digit phone number.',
      address: 'Please enter the property address.',
      email: 'Please enter your email.',
      emailBad: 'Please enter a valid email address.',
      message: 'Please tell us about the job.'
    };

    function errorEl(field) {
      var wrap = field.closest('.gk-field');
      return wrap ? wrap.querySelector('.gk-field__error') : null;
    }
    function problem(field) {
      var v = field.value.trim();
      if (!v) return MESSAGES[field.name] || 'Please fill in this field.';
      if (field.type === 'tel' && v.replace(/\D/g, '').length < 10) return MESSAGES.phoneBad;
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MESSAGES.emailBad;
      return '';
    }
    function show(field, msg) {
      var err = errorEl(field);
      if (!err) return;
      if (!err.id) err.id = field.id + '-error';
      if (msg) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', err.id);
        err.textContent = msg;
        err.hidden = false;
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        err.textContent = '';
        err.hidden = true;
      }
    }

    forms.forEach(function (form) {
      var fields = $$('input[required], textarea[required], select[required]', form);
      var done = form.parentElement.querySelector('[data-gk-form-done]');

      fields.forEach(function (field) {
        field.addEventListener('blur', function () { if (field.value.trim()) show(field, problem(field)); });
        field.addEventListener('input', function () {
          if (field.getAttribute('aria-invalid') === 'true') show(field, problem(field));
        });
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var firstBad = null;
        fields.forEach(function (field) {
          var msg = problem(field);
          show(field, msg);
          if (msg && !firstBad) firstBad = field;
        });
        if (firstBad) { firstBad.focus(); return; }
        form.hidden = true;
        if (done) { done.hidden = false; done.focus({ preventScroll: true }); }
        form.reset();
      });
    });
  }());


  /* 4. FAQ: one open at a time --------------------------------------------
     <details name="..."> already does this in current browsers; this is the
     fallback for browsers without exclusive accordions. */
  (function faq() {
    var items = $$('details.gk-faq__item[name]');
    if (!items.length) return;
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        var name = item.getAttribute('name');
        items.forEach(function (other) {
          if (other !== item && other.open && other.getAttribute('name') === name) other.open = false;
        });
      });
    });
  }());

}());
