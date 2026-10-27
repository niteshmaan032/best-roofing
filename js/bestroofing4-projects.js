/* Goldenberg Roofing NYC — bestroofing4-projects.html
   1. Filter chips + pagination: six cards per page; the count line and the
      page buttons follow the current filter.
   2. Lightbox: one native <dialog>. Opens from a card, steps through every
      card in the current filter, across pages (buttons, arrow keys,
      swipe), Esc or the backdrop closes, focus returns to what opened it. */
(function () {
  'use strict';

  var cards = [].slice.call(document.querySelectorAll('.pj-card'));
  if (!cards.length) return;

  /* 1. Filter + pages (six cards per page) ------------------------------ */
  var PER_PAGE = 6;
  var chips = [].slice.call(document.querySelectorAll('.pj-chip'));
  var countEl = document.querySelector('[data-pj-count]');
  var pager = document.querySelector('[data-pj-pager]');
  var gallery = document.getElementById('gallery');
  var filterKey = 'all';
  var filterLabel = '';
  var page = 1;

  function matching() {
    return cards.filter(function (card) {
      return filterKey === 'all' || card.getAttribute('data-service') === filterKey;
    });
  }

  function pagerButton(html, label, target, opts) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pj-pager__btn' + (opts && opts.step ? ' pj-pager__btn--step' : '');
    b.innerHTML = html;
    b.setAttribute('aria-label', label);
    if (opts && opts.current) b.setAttribute('aria-current', 'page');
    if (opts && opts.disabled) b.disabled = true;
    b.addEventListener('click', function () { render(target, true); });
    return b;
  }

  function render(newPage, scroll) {
    var list = matching();
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    page = Math.min(Math.max(1, newPage), pages);
    var from = (page - 1) * PER_PAGE;
    var to = Math.min(from + PER_PAGE, list.length);

    cards.forEach(function (card) { card.hidden = true; });
    list.slice(from, to).forEach(function (card) { card.hidden = false; });

    if (countEl) {
      var what = filterKey === 'all' ? 'projects' : filterLabel + (list.length === 1 ? ' project' : ' projects');
      countEl.textContent = list.length <= PER_PAGE
        ? 'Showing ' + (filterKey === 'all' ? 'all ' : '') + list.length + ' ' + what
        : 'Showing ' + (from + 1) + '\u2013' + to + ' of ' + list.length + ' ' + what;
    }

    if (pager) {
      pager.innerHTML = '';
      pager.hidden = pages < 2;
      if (pages > 1) {
        pager.appendChild(pagerButton('<i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>Previous</span>', 'Previous page', page - 1, { step: true, disabled: page === 1 }));
        for (var n = 1; n <= pages; n++) {
          pager.appendChild(pagerButton(String(n), 'Page ' + n, n, { current: n === page }));
        }
        pager.appendChild(pagerButton('<span>Next</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>', 'Next page', page + 1, { step: true, disabled: page === pages }));
      }
    }

    if (scroll && gallery) {
      var top = gallery.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterKey = chip.getAttribute('data-filter');
      filterLabel = chip.childNodes[0].textContent.trim();
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      render(1, false);
    });
  });
  render(1, false);

  /* 2. Lightbox ---------------------------------------------------------- */
  var box = document.getElementById('pj-lightbox');
  if (!box || typeof box.showModal !== 'function') return;

  var img = box.querySelector('[data-lb-img]');
  var tag = box.querySelector('[data-lb-tag]');
  var title = box.querySelector('[data-lb-title]');
  var alt = box.querySelector('[data-lb-alt]');
  var count = box.querySelector('[data-lb-count]');
  var list = [];
  var index = 0;
  var opener = null;

  function dataOf(card) {
    var thumb = card.querySelector('img');
    return {
      src: card.getAttribute('data-full') || thumb.currentSrc || thumb.src,
      alt: thumb.getAttribute('alt') || '',
      tag: card.querySelector('.work__tag').textContent,
      title: card.querySelector('.work__title').textContent
    };
  }

  function preload(i) {
    var card = list[(i + list.length) % list.length];
    if (card) { var p = new Image(); p.src = dataOf(card).src; }
  }

  function show(i) {
    index = (i + list.length) % list.length;
    var d = dataOf(list[index]);
    img.src = d.src;
    img.alt = d.alt;
    tag.textContent = d.tag;
    title.textContent = d.title;
    alt.textContent = d.alt;
    count.textContent = (index + 1) + ' / ' + list.length;
    preload(index + 1);
    preload(index - 1);
  }

  function open(card, from) {
    var inFilter = matching();
    list = inFilter.indexOf(card) > -1 ? inFilter : cards.slice();
    opener = from;
    show(list.indexOf(card));
    document.documentElement.style.overflow = 'hidden';
    box.showModal();
  }

  function close() { if (box.open) box.close(); }

  box.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  });

  cards.forEach(function (card) {
    var btn = card.querySelector('.pj-card__open');
    btn.addEventListener('click', function () { open(card, btn); });
  });

  box.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
  box.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });
  box.querySelector('[data-lb-close]').addEventListener('click', close);

  box.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });

  // A click on the backdrop lands on the <dialog> itself, outside its box.
  box.addEventListener('click', function (event) {
    if (event.target !== box) return;
    var r = box.getBoundingClientRect();
    var inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) close();
  });

  // Swipe on touch screens.
  var startX = null;
  box.addEventListener('touchstart', function (event) { startX = event.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (event) {
    if (startX === null) return;
    var dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
