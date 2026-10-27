/* Goldenberg Roofing NYC: Blog page (bestroofing4-blog.html). Loaded after
   js/bestroofing4.js. Topic chips and the search box filter the article grid.
   With no filter, the featured card shows on its own and the grid shows the
   first PAGE posts behind a "Show more" button; any filter or search hides the
   featured card and lists every match (the featured post included). */
(function () {
  'use strict';

  var PAGE = 9;
  var grid = document.querySelector('[data-blog-grid]');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.bcard'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.bchip[data-filter]'));
  var featured = document.querySelector('[data-featured-section]');
  var count = document.querySelector('[data-blog-count]');
  var empty = document.querySelector('[data-blog-empty]');
  var moreBtn = document.querySelector('[data-blog-more]');
  var moreWrap = moreBtn ? moreBtn.parentNode : null;
  var input = document.getElementById('blog-search');
  var clearBtn = document.querySelector('.bsearch__clear');
  var reset = document.querySelector('[data-blog-reset]');
  var total = cards.length;
  var topics = chips.length - 1;

  // Search text per card: title, excerpt and topic, lower-cased once.
  function norm(s) {
    return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9& ]+/g, ' ');
  }
  var hay = cards.map(function (card) {
    return norm(['.bmeta__topic', '.bcard__title a', '.bcard__excerpt'].map(function (sel) {
      var el = card.querySelector(sel);
      return el ? el.firstChild.nodeValue || el.textContent : '';
    }).join(' '));
  });
  var regular = cards.filter(function (card) { return !card.hasAttribute('data-featured'); });

  var state = { topic: 'all', query: '', expanded: false };

  function words(q) { return norm(q).split(/\s+/).filter(Boolean); }

  function render() {
    var q = words(state.query);
    var filtering = state.topic !== 'all' || q.length > 0;
    var shown = 0;

    cards.forEach(function (card, i) {
      var show;
      if (!filtering) {
        show = !card.hasAttribute('data-featured') &&
          (state.expanded || regular.indexOf(card) < PAGE);
      } else {
        var topicOk = state.topic === 'all' || card.getAttribute('data-topic') === state.topic;
        var textOk = q.every(function (w) { return hay[i].indexOf(w) !== -1; });
        show = topicOk && textOk;
      }
      card.hidden = !show;
      if (show) shown += 1;
    });

    if (featured) featured.hidden = filtering;
    if (empty) empty.hidden = shown > 0;
    if (moreWrap) {
      var rest = regular.length - PAGE;
      moreWrap.hidden = filtering || state.expanded || rest <= 0;
      moreBtn.firstChild.nodeValue = 'Show ' + rest + ' More Articles';
    }

    if (count) {
      count.innerHTML = filtering
        ? 'Showing <strong>' + shown + '</strong> of <strong>' + total + '</strong> articles'
        : '<strong>' + total + '</strong> articles in <strong>' + topics + '</strong> topics';
    }
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  function setTopic(topic) {
    state.topic = topic;
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-filter') === topic ? 'true' : 'false');
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      setTopic(chip.getAttribute('data-filter'));
      render();
    });
  });

  if (input) {
    input.addEventListener('input', function () {
      state.query = input.value.trim();
      render();
    });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        var list = document.getElementById('articles');
        if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      state.query = '';
      render();
      input.focus();
    });
  }

  if (reset) {
    reset.addEventListener('click', function () {
      if (input) input.value = '';
      state.query = '';
      setTopic('all');
      render();
    });
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var firstNew = regular[PAGE];
      state.expanded = true;
      render();
      // Move focus to the first newly shown article for keyboard users.
      var link = firstNew && firstNew.querySelector('a');
      if (link) link.focus({ preventScroll: true });
    });
  }

  render();
})();
