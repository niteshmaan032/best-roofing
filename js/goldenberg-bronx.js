/* Goldenberg Roofing Bronx: shared behaviour for every Bronx page.
   Same behaviour as the approved sister-site script (header dropdowns, mobile
   drawer, hero photo crossfade, estimate-form validation), with the Bronx
   phone number, a thank-you state, a one-at-a-time FAQ fallback and the
   Trustindex fallback switch. Every block checks for its own markup first. */
(function () {
  'use strict';
  var PHONE = '(718) 663-4786';
  var TEL = 'tel:+17186634786';
  var header = document.querySelector('.header');
  var menuButton = document.querySelector('.menu-btn');
  var drawer = document.getElementById('drawer');
  var desktop = window.matchMedia('(min-width: 88.01rem)');

  /* ---------- Header surface: solid white from the top ---------- */
  if (header) header.classList.add('is-scrolled');

  /* ---------- Homepage hero photo slider (goldenberg-bronx.html) ----------
     Crossfades .gx-shero__slide every 6 s. Stops on mouse hover, keyboard
     focus inside the hero, a hidden tab, and prefers-reduced-motion. Pages
     without .gx-shero skip this block. Optional .gx-shero__dot buttons are
     wired if they are ever added. */
  var shero = document.querySelector('.gx-shero');
  var sheroSlides = shero ? Array.prototype.slice.call(shero.querySelectorAll('.gx-shero__slide')) : [];
  var sheroDots = shero ? Array.prototype.slice.call(shero.querySelectorAll('.gx-shero__dot')) : [];
  if (shero && sheroSlides.length > 1 && (!sheroDots.length || sheroDots.length === sheroSlides.length) && window.matchMedia) {
    var sheroIndex = 0, sheroTimer = null, sheroHover = false;
    var sheroCalm = window.matchMedia('(prefers-reduced-motion: reduce)');
    var showShero = function (index) {
      sheroIndex = index;
      sheroSlides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === index); });
      sheroDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-pressed', String(i === index));
      });
    };
    var stopShero = function () { if (sheroTimer) { window.clearInterval(sheroTimer); sheroTimer = null; } };
    var startShero = function () {
      stopShero();
      if (sheroCalm.matches || document.hidden || sheroHover || shero.contains(document.activeElement)) return;
      sheroTimer = window.setInterval(function () { showShero((sheroIndex + 1) % sheroSlides.length); }, 6000);
    };
    sheroDots.forEach(function (dot, i) { dot.addEventListener('click', function () { showShero(i); startShero(); }); });
    shero.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { sheroHover = true; stopShero(); } });
    shero.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { sheroHover = false; startShero(); } });
    shero.addEventListener('focusin', stopShero);
    shero.addEventListener('focusout', function (e) { if (!shero.contains(e.relatedTarget)) startShero(); });
    document.addEventListener('visibilitychange', startShero);
    if (sheroCalm.addEventListener) sheroCalm.addEventListener('change', startShero); else if (sheroCalm.addListener) sheroCalm.addListener(startShero);
    startShero();
  }

  /* ---------- Mobile drawer ---------- */
  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    if (menuButton) { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); }
  }
  if (menuButton && drawer) {
    menuButton.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    drawer.querySelectorAll('.drawer__group').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        // One group open at a time keeps About and Contact on screen.
        drawer.querySelectorAll('.drawer__group[aria-expanded="true"]').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }

  /* ---------- Desktop dropdowns: hover + click + keyboard ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item.has-menu'));
  function setOpen(item, open) {
    var btn = item.querySelector('.nav__link'), panel = item.querySelector('.dropdown');
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }
  function closeAll(except) { items.forEach(function (it) { if (it !== except) setOpen(it, false); }); }
  items.forEach(function (item) {
    var btn = item.querySelector('.nav__link'), timer;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(item);
      setOpen(item, !open);
    });
    item.addEventListener('mouseenter', function () { clearTimeout(timer); closeAll(item); setOpen(item, true); });
    item.addEventListener('mouseleave', function () { timer = setTimeout(function () { setOpen(item, false); }, 140); });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) setOpen(item, false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeDrawer(); } });
  document.addEventListener('click', function (e) { if (header && !header.contains(e.target)) { closeAll(); closeDrawer(); } });
  var onChange = function () { closeAll(); closeDrawer(); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange); else desktop.addListener(onChange);

  /* ---------- Read more toggles (text stays in the DOM for SEO) ---------- */
  document.querySelectorAll('[data-clamp-toggle]').forEach(function (btn) {
    var scope = btn.closest('.card__body, .editorial__inner > div, .section') || document;
    var box = scope.querySelector('[data-clamp]');
    if (!box) return;
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Read less' : 'Read more';
    });
  });

  /* ---------- FAQ: one answer open at a time ----------
     <details name="..."> does this natively; this covers older browsers. */
  document.querySelectorAll('.gx-faq').forEach(function (list) {
    var all = Array.prototype.slice.call(list.querySelectorAll('details'));
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        all.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
  });

  /* ---------- Trustindex slot: hide the Google fallback once the widget renders ---------- */
  document.querySelectorAll('.gx-ti-slot').forEach(function (slot) {
    var loaded = function () { return slot.querySelector('.ti-widget, [class*="ti-widget"], iframe[src*="trustindex"]'); };
    if (loaded()) { slot.classList.add('is-loaded'); return; }
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function () { if (loaded()) { slot.classList.add('is-loaded'); mo.disconnect(); } });
    mo.observe(slot, { childList: true, subtree: true });
  });

  /* ---------- Forms: inline validation + thank-you ----------
     Every form.quote-card: all fields required (name, phone, address, email,
     message). A valid submit replaces the fields with a thank-you note. */
  function setError(field, msg) {
    var wrap = field.closest('.field'); if (!wrap) return;
    var err = wrap.querySelector('.field-error');
    if (!err) { err = document.createElement('span'); err.className = 'field-error'; err.setAttribute('role', 'alert'); wrap.appendChild(err); }
    err.textContent = msg; wrap.classList.add('has-error'); field.setAttribute('aria-invalid', 'true');
  }
  function clearError(field) {
    var wrap = field.closest('.field'); if (!wrap) return;
    var err = wrap.querySelector('.field-error'); if (err) err.remove();
    wrap.classList.remove('has-error'); field.removeAttribute('aria-invalid');
  }
  document.querySelectorAll('form.quote-card').forEach(function (form) {
    form.querySelectorAll('input,textarea').forEach(function (el) { el.addEventListener('input', function () { clearError(el); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      var name = form.querySelector('[name="name"]'), phone = form.querySelector('[name="phone"]'), email = form.querySelector('[name="email"]'), address = form.querySelector('[name="address"]');
      if (name && name.value.trim().length < 2) { setError(name, 'Enter your full name.'); ok = false; first = first || name; }
      if (phone) { var digits = phone.value.replace(/\D/g, ''); if (digits.length < 10 || digits.length > 11) { setError(phone, 'Enter a valid phone number.'); ok = false; first = first || phone; } }
      if (address && address.value.trim().length < 4) { setError(address, 'Enter the property address.'); ok = false; first = first || address; }
      if (email && (!email.value.trim() || !email.checkValidity())) { setError(email, 'Enter a valid email address.'); ok = false; first = first || email; }
      var message = form.querySelector('[name="message"]');
      if (message && !message.value.trim()) { setError(message, 'Tell us how we can help.'); ok = false; first = first || message; }
      if (!ok) { if (first) first.focus(); return; }
      var title = form.querySelector('.quote-card__title');
      Array.prototype.slice.call(form.children).forEach(function (el) { if (el !== title) el.hidden = true; });
      var notice = document.createElement('div');
      notice.className = 'form-thanks'; notice.setAttribute('role', 'status'); notice.setAttribute('tabindex', '-1');
      notice.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6"/></svg>' +
        '<strong>Thanks, we have your request.</strong>' +
        '<p>We&rsquo;ll call you back within the hour. Need us sooner? <a href="' + TEL + '">Call ' + PHONE + '</a>.</p>';
      form.appendChild(notice);
      notice.focus();
    });
  });

})();
