/* ==========================================================================
   Goldenberg Roofing Brooklyn: Blog page (goldenberg-brooklyn-blog.html)
   Loaded after js/goldenberg-brooklyn.js. Same behaviour as
   js/bestroofing4-blog.js:
   - Topic chips and the hero search filter the article grid.
   - With no filter, the featured guide shows on its own and the grid shows
     the first PAGE posts behind a "Show more" button.
   - With a filter, every matching post is listed. The featured guide stays
     in view only while it matches (it is not repeated inside the grid, so
     its photo appears once on the page).
   ========================================================================== */
(function () {
  'use strict';

  var PAGE = 9;
  var grid = document.querySelector('[data-blog-grid]');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.gk-bl-item'));
  var featured = document.querySelector('[data-blog-featured]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.gk-bl-chip[data-filter]'));
  var count = document.querySelector('[data-blog-count]');
  var empty = document.querySelector('[data-blog-empty]');
  var emptyTitle = empty ? empty.querySelector('.gk-bl-empty__title') : null;
  var moreBtn = document.querySelector('[data-blog-more]');
  var moreWrap = moreBtn ? moreBtn.parentNode : null;
  var input = document.getElementById('gk-blog-search');
  var clearBtn = document.querySelector('.gk-bl-search__clear');
  var reset = document.querySelector('[data-blog-reset]');
  var total = items.length + (featured ? 1 : 0);
  var topics = chips.length - 1;

  // Search text per article: topic, title and excerpt, lower-cased once.
  function norm(s) {
    return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9& ]+/g, ' ');
  }
  function textOf(root, selectors) {
    return norm(selectors.map(function (sel) {
      var el = root.querySelector(sel);
      return el ? (el.firstChild && el.firstChild.nodeValue) || el.textContent : '';
    }).join(' '));
  }
  var hay = items.map(function (item) { return textOf(item, ['.gk-post__topic', '.gk-post__title', '.gk-bl-card__excerpt']); });
  var featuredHay = featured ? textOf(featured, ['.gk-post__topic', '.gk-bl-feature__title', '.gk-bl-feature__excerpt']) : '';

  var state = { topic: 'all', query: '', expanded: false };

  function words(q) { return norm(q).split(/\s+/).filter(Boolean); }
  function matches(topic, text, q) {
    var topicOk = state.topic === 'all' || topic === state.topic;
    return topicOk && q.every(function (w) { return text.indexOf(w) !== -1; });
  }

  function render() {
    var q = words(state.query);
    var filtering = state.topic !== 'all' || q.length > 0;
    var shown = 0;

    items.forEach(function (item, i) {
      var show = filtering
        ? matches(item.getAttribute('data-topic'), hay[i], q)
        : (state.expanded || i < PAGE);
      item.hidden = !show;
      if (show) shown += 1;
    });

    var featuredShown = !!featured && (!filtering || matches(featured.getAttribute('data-topic'), featuredHay, q));
    if (featured) featured.hidden = !featuredShown;

    if (empty) {
      empty.hidden = shown > 0;
      if (emptyTitle) emptyTitle.textContent = featuredShown ? 'Only the featured guide above matches.' : 'No articles match your search.';
    }

    if (moreWrap) {
      var rest = items.length - PAGE;
      moreWrap.hidden = filtering || state.expanded || rest <= 0;
      moreBtn.firstChild.nodeValue = 'Show ' + rest + ' More Articles';
    }

    if (count) {
      var found = shown + (filtering && featuredShown ? 1 : 0);
      count.innerHTML = filtering
        ? 'Showing <strong>' + found + '</strong> of <strong>' + total + '</strong> articles'
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
      if (event.key === 'Escape' && input.value) {
        input.value = '';
        state.query = '';
        render();
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
      var firstNew = items[PAGE];
      state.expanded = true;
      render();
      // Move focus to the first newly shown article for keyboard users.
      var link = firstNew && firstNew.querySelector('a');
      if (link) link.focus({ preventScroll: true });
    });
  }

  render();
}());
