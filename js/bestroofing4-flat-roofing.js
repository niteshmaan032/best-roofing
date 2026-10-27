/* Goldenberg Roofing NYC — flat roofing page.
   Systems tabs: click or arrow keys switch the panel (WAI-ARIA tabs pattern).
   The FAQ accordion and the estimate form run on the shared js/bestroofing4.js. */
(function () {
  'use strict';

  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); select(next, true); }
      });
    });
  });

  /* Recent projects lightbox: a modal dialog with previous/next, Escape to
     close, arrow keys to move, focus kept inside and returned to the tile. */
  (function () {
    var box = document.getElementById('fr-lightbox');
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.fr-work__open'));
    if (!box || !tiles.length) return;

    var img = box.querySelector('.fr-lightbox__img');
    var cap = box.querySelector('[data-lb-caption]');
    var count = box.querySelector('[data-lb-count]');
    var closeBtn = box.querySelector('.fr-lightbox__btn--close');
    var index = 0;
    var opener = null;

    function show(i) {
      index = (i + tiles.length) % tiles.length;
      var tile = tiles[index];
      var thumb = tile.querySelector('img');
      var text = tile.querySelector('.fr-work__cap');
      img.src = tile.getAttribute('data-full') || thumb.src;
      img.alt = thumb.alt;
      cap.textContent = text ? text.lastChild.textContent.trim() : thumb.alt;
      count.textContent = (index + 1) + ' / ' + tiles.length;
    }

    function open(i, trigger) {
      opener = trigger;
      show(i);
      box.hidden = false;
      document.documentElement.classList.add('fr-lightbox-open');
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      document.documentElement.classList.remove('fr-lightbox-open');
      if (opener) opener.focus();
    }

    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function () { open(i, tile); });
    });
    box.querySelectorAll('[data-lb-close]').forEach(function (el) { el.addEventListener('click', close); });
    box.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
    box.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });

    box.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); return; }
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); return; }
      if (event.key === 'Tab') {
        var focusable = Array.prototype.slice.call(box.querySelectorAll('button'));
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }());
}());
