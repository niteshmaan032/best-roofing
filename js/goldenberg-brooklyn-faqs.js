/* ==========================================================================
   Goldenberg Roofing Brooklyn: FAQs page (goldenberg-brooklyn-faqs.html)
   Loaded after js/goldenberg-brooklyn.js. Same behaviour as
   js/bestroofing4-faqs.js:
   - Live search over questions and answers, with "N questions in N topics"
     and the matches highlighted.
   - Topic buttons (rail on desktop, sticky chips on phones) show one topic.
   - Popular-search buttons fill the search box.
   - One answer open at a time across the whole page: every <details> shares
     name="gk-faq", and the kit JS covers browsers without that.
   ========================================================================== */
(function () {
  'use strict';

  var input = document.getElementById('gk-fq-search');
  var groupsWrap = document.getElementById('gk-fq-groups');
  if (!input || !groupsWrap) return;

  var status = document.querySelector('[data-fq-status]');
  var empty = document.querySelector('[data-fq-empty]');
  var clearBtns = Array.prototype.slice.call(document.querySelectorAll('[data-fq-clear]'));
  var heroClear = document.querySelector('.gk-fq-search__clear');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-fq-topic]'));
  var groups = Array.prototype.slice.call(groupsWrap.querySelectorAll('[data-fq-group]'));
  var allItems = Array.prototype.slice.call(groupsWrap.querySelectorAll('details.gk-faq__item'));
  var header = document.querySelector('.gk-header');
  var rail = document.querySelector('.gk-fq-rail');
  var PHONE_RAIL = window.matchMedia('(max-width: 959px)');

  var topic = 'all';

  function norm(s) {
    return s.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  // Each item keeps its original markup so highlights can be undone cleanly.
  var items = allItems.map(function (el) {
    var label = el.querySelector('.gk-fq-label');
    var answer = el.querySelector('.gk-faq__a');
    return {
      el: el,
      group: el.closest('[data-fq-group]'),
      label: label,
      answer: answer,
      labelHTML: label.innerHTML,
      answerHTML: answer.innerHTML,
      text: norm(label.textContent + ' ' + answer.textContent)
    };
  });

  // Wrap matches in <mark>, text nodes only, so links in answers survive.
  function highlight(root, words) {
    if (!words.length) return;
    var re = new RegExp('(' + words.map(escapeRe).join('|') + ')', 'gi');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) return;
      var frag = document.createDocumentFragment();
      var last = 0;
      text.replace(re, function (m, _g, idx) {
        if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
        var mark = document.createElement('mark');
        mark.className = 'gk-fq-mark';
        mark.textContent = m;
        frag.appendChild(mark);
        last = idx + m.length;
        return m;
      });
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function apply() {
    // The query is matched as a phrase ("flat roof" finds "flat roofs" and
    // "flat roofing", not every answer that says "roof").
    var q = norm(input.value.trim());
    var words = q ? [q] : [];
    var perGroup = {};
    var perGroupAll = {};
    var shown = 0;

    items.forEach(function (it) {
      var key = it.group.getAttribute('data-fq-group');
      var match = words.every(function (w) { return it.text.indexOf(w) !== -1; });
      if (match) perGroupAll[key] = (perGroupAll[key] || 0) + 1;
      var visible = match && (topic === 'all' || topic === key);
      it.el.hidden = !visible;
      if (!visible && it.el.open) it.el.open = false;

      it.label.innerHTML = it.labelHTML;
      it.answer.innerHTML = it.answerHTML;
      if (visible && words.length) {
        highlight(it.label, words);
        highlight(it.answer, words);
      }
      if (visible) { perGroup[key] = (perGroup[key] || 0) + 1; shown++; }
    });

    var topicsShown = 0;
    groups.forEach(function (g) {
      var key = g.getAttribute('data-fq-group');
      var n = perGroup[key] || 0;
      g.hidden = n === 0;
      if (n) topicsShown++;
      var count = g.querySelector('[data-fq-group-count]');
      if (count) count.textContent = plural(n, 'question', 'questions');
    });

    // Chip counts follow the search, not the topic, so they say what each
    // topic would show.
    var totalMatches = 0;
    chips.forEach(function (chip) {
      var key = chip.getAttribute('data-fq-topic');
      if (key === 'all') return;
      var c = chip.querySelector('[data-fq-count]');
      var n = perGroupAll[key] || 0;
      totalMatches += n;
      if (c) c.textContent = n;
      chip.classList.toggle('is-empty', n === 0);
    });
    var allCount = document.querySelector('[data-fq-count="all"]');
    if (allCount) allCount.textContent = totalMatches;

    if (status) {
      status.innerHTML = shown
        ? '<strong>' + plural(shown, 'question', 'questions') + '</strong> in ' + plural(topicsShown, 'topic', 'topics')
        : '<strong>No questions</strong> match';
    }
    if (empty) empty.hidden = shown !== 0;
    if (heroClear) heroClear.hidden = !input.value;
  }

  function setTopic(key, scroll) {
    topic = key;
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-fq-topic') === key ? 'true' : 'false');
    });
    apply();

    // Phones: bring the active chip into view in its sideways row.
    var active = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })[0];
    var row = active && active.closest('.gk-fq-chips');
    if (row && row.scrollWidth > row.clientWidth) {
      var pad = parseFloat(getComputedStyle(row).paddingLeft) || 0;
      var delta = active.getBoundingClientRect().left - row.getBoundingClientRect().left - pad;
      row.scrollTo({ left: row.scrollLeft + delta, behavior: 'smooth' });
    }

    if (scroll) {
      var top = groupsWrap.getBoundingClientRect().top;
      var offset = (header ? header.offsetHeight : 0) + (rail && PHONE_RAIL.matches ? rail.offsetHeight : 0) + 16;
      // Only scroll up to the list when its top has gone off-screen.
      if (top < offset) window.scrollBy({ top: top - offset, behavior: 'smooth' });
    }
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(apply, 80);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) { input.value = ''; apply(); }
  });

  clearBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.value = '';
      apply();
      input.focus();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-fq-try]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.value = btn.getAttribute('data-fq-try');
      setTopic('all', false);
      input.focus();
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      setTopic(chip.getAttribute('data-fq-topic'), true);
    });
  });

  // A link to #topic-materials (etc.) opens on that topic.
  var hash = (location.hash || '').replace('#topic-', '');
  if (hash && chips.some(function (c) { return c.getAttribute('data-fq-topic') === hash; })) {
    setTopic(hash, false);
  } else {
    apply();
  }
}());
