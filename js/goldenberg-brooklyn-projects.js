/* ==========================================================================
   Goldenberg Roofing Brooklyn: Projects page (goldenberg-brooklyn-projects.html)
   Loaded after js/goldenberg-brooklyn.js. Same behaviour as
   js/bestroofing4-projects.js:
     1. Filter chips + pagination: six tiles per page; the count line
        ("Showing 1-6 of N") and the Prev / 1..N / Next buttons follow the
        current filter.
     2. Photo dialog: one native <dialog>. Opens from a gallery tile, steps
        through every tile in the current filter, across pages (buttons,
        arrow keys, swipe). Esc or the backdrop closes it and focus returns
        to the tile. The hero mosaic does not open it.
   ========================================================================== */
(function () {
  'use strict';

  var items = [].slice.call(document.querySelectorAll('.gk-pj-item'));
  if (!items.length) return;

  /* 1. Filter + pages ------------------------------------------------------ */
  var PER_PAGE = 6;
  var chips = [].slice.call(document.querySelectorAll('.gk-pj-chip'));
  var countEl = document.querySelector('[data-pj-count]');
  var pager = document.querySelector('[data-pj-pager]');
  var gallery = document.getElementById('gallery');
  var header = document.querySelector('.gk-header');
  var filterKey = 'all';
  var filterLabel = '';
  var page = 1;

  function matching() {
    return items.filter(function (item) {
      return filterKey === 'all' || item.getAttribute('data-service') === filterKey;
    });
  }

  function pagerButton(html, label, target, opts) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gk-pj-pager__btn';
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

    items.forEach(function (item) { item.hidden = true; });
    list.slice(from, to).forEach(function (item) { item.hidden = false; });

    if (countEl) {
      var what = filterKey === 'all' ? 'projects' : filterLabel + (list.length === 1 ? ' project' : ' projects');
      countEl.textContent = list.length <= PER_PAGE
        ? 'Showing ' + (filterKey === 'all' ? 'all ' : '') + list.length + ' ' + what
        : 'Showing ' + (from + 1) + '–' + to + ' of ' + list.length + ' ' + what;
    }

    if (pager) {
      pager.innerHTML = '';
      pager.hidden = pages < 2;
      if (pages > 1) {
        pager.appendChild(pagerButton('<i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>Prev</span>', 'Previous page', page - 1, { disabled: page === 1 }));
        for (var n = 1; n <= pages; n++) {
          pager.appendChild(pagerButton(String(n), 'Page ' + n, n, { current: n === page }));
        }
        pager.appendChild(pagerButton('<span>Next</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>', 'Next page', page + 1, { disabled: page === pages }));
      }
    }

    if (scroll && gallery) {
      var offset = (header ? header.offsetHeight : 0) + 12;
      var top = gallery.getBoundingClientRect().top + window.pageYOffset - offset;
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


  /* 2. Photo dialog -------------------------------------------------------- */
  var box = document.getElementById('gk-pj-lightbox');
  if (!box || typeof box.showModal !== 'function') return;

  var img = box.querySelector('[data-lb-img]');
  var tag = box.querySelector('[data-lb-tag]');
  var title = box.querySelector('[data-lb-title]');
  var alt = box.querySelector('[data-lb-alt]');
  var count = box.querySelector('[data-lb-count]');
  var list = [];
  var index = 0;
  var opener = null;

  function dataOf(item) {
    var thumb = item.querySelector('img');
    return {
      src: item.getAttribute('data-full') || thumb.currentSrc || thumb.src,
      alt: thumb.getAttribute('alt') || '',
      w: thumb.getAttribute('width'),
      h: thumb.getAttribute('height'),
      tag: item.querySelector('.gk-tile__tag').textContent,
      title: item.querySelector('.gk-tile__title').textContent
    };
  }

  function preload(i) {
    var item = list[(i + list.length) % list.length];
    if (item) { var p = new Image(); p.src = dataOf(item).src; }
  }

  function show(i) {
    index = (i + list.length) % list.length;
    var d = dataOf(list[index]);
    img.src = d.src;
    img.alt = d.alt;
    if (d.w && d.h) { img.width = +d.w; img.height = +d.h; }
    tag.textContent = d.tag;
    title.textContent = d.title;
    alt.textContent = d.alt;
    count.textContent = (index + 1) + ' / ' + list.length;
    preload(index + 1);
    preload(index - 1);
  }

  function open(item, from) {
    var inFilter = matching();
    list = inFilter.indexOf(item) > -1 ? inFilter : items.slice();
    opener = from;
    show(list.indexOf(item));
    document.documentElement.style.overflow = 'hidden';
    box.showModal();
  }

  function close() { if (box.open) box.close(); }

  box.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  });

  items.forEach(function (item) {
    var btn = item.querySelector('.gk-pj-tile__open');
    if (btn) btn.addEventListener('click', function () { open(item, btn); });
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
}());
