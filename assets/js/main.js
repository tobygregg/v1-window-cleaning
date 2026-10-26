/* V1 Window Cleaning — vanilla JS: header, menu, reveal, counters, bubbles,
   services explorer, before/after, lightbox, FAQ, form. No libraries. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid on scroll, mobile bar, active nav, hero parallax ---------- */
  var hdr = $('#hdr'), mbar = $('#mbar'), hero = $('#top');
  var parallax = $('[data-parallax] img');
  var navLinks = $$('.nav-link');
  var secs = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('solid', y > 24);
    var heroH = hero ? hero.offsetHeight : 600;
    if (mbar) mbar.classList.toggle('show', y > heroH * 0.55);
    if (parallax && !reduce && y < heroH) parallax.style.transform = 'translate3d(0,' + (y * 0.08).toFixed(1) + 'px,0)';
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
    var steps = $('[data-steps]');
    if (steps) {
      var r = steps.getBoundingClientRect();
      var g = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / (r.height + 40)));
      steps.style.setProperty('--grow', g.toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = $('#burger'), sheet = $('#sheet');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a,[data-close]', sheet).forEach(function (el) { el.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) { setMenu(false); burger.focus(); } });

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // steps: light up number discs as they arrive
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  $$('.step').forEach(function (s) {
    if (!('IntersectionObserver' in window) || reduce) { s.classList.add('in'); return; }
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { s.classList.add('in'); o.disconnect(); } }); }, { threshold: 0.6 }).observe(s);
  });

  /* ---------- Counters (real numbers only) ---------- */
  $$('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = end; return; }
    el.textContent = '0';
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; o.disconnect();
        var t0 = performance.now(), dur = 1400;
        (function step(t) {
          var p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 }).observe(el);
  });

  /* ---------- Bubbles ---------- */
  $$('[data-bubbles]').forEach(function (box) {
    var n = parseInt(box.getAttribute('data-bubbles'), 10) || 10;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('span');
      b.className = 'bub';
      var s = 10 + Math.random() * 42;
      b.style.cssText = '--x:' + (Math.random() * 100).toFixed(1) + '%;--s:' + s.toFixed(0) + 'px;--w:' + ((Math.random() * 60 - 30)).toFixed(0) + 'px;--d:' + (9 + Math.random() * 12).toFixed(1) + 's;--dl:-' + (Math.random() * 18).toFixed(1) + 's';
      box.appendChild(b);
    }
  });

  /* ---------- Services explorer ---------- */
  var svc = $('[data-svc]');
  if (svc) {
    var tabs = $$('.svc-tab', svc), panels = $$('.svc-panel', svc);
    var activate = function (i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      var img = $('img', panels[i]); if (img) img.loading = 'eager';
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length;
        if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); activate((i + 1) % n, true); }
        else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); activate((i - 1 + n) % n, true); }
        else if (k === 'Home') { e.preventDefault(); activate(0, true); }
        else if (k === 'End') { e.preventDefault(); activate(n - 1, true); }
      });
    });
    // the "see the before & afters" buttons filter the slider
    $$('a[href="#work"]', svc).forEach(function (a) {
      a.addEventListener('click', function () {
        var map = { 'p-soft': 'soft', 'p-pvc': 'pvc' };
        var panel = a.closest('.svc-panel'); var f = panel && map[panel.id];
        var btn = f && $('#ba-filters [data-f="' + f + '"]'); if (btn) btn.click();
      });
    });
  }

  /* ---------- Before / after showpiece ---------- */
  var baSec = $('[data-ba]');
  if (baSec) {
    var ba = $('#ba'), imgA = $('#ba-after'), imgB = $('#ba-before');
    var thumbs = $$('.thumb', baSec), idx = 0, pos = 50, touched = false;
    var title = $('#ba-title'), cap = $('#ba-cap'), count = $('#ba-count');
    var visible = function () { return thumbs.filter(function (t) { return !t.hidden; }); };
    var setPos = function (p, anim) {
      pos = Math.max(0, Math.min(100, p));
      ba.classList.toggle('anim', !!anim);
      ba.style.setProperty('--p', pos + '%');
      ba.setAttribute('aria-valuenow', Math.round(pos));
    };
    var load = function (t, fromUser) {
      var list = visible(); idx = Math.max(0, list.indexOf(t));
      thumbs.forEach(function (x) { x.removeAttribute('aria-current'); });
      t.setAttribute('aria-current', 'true');
      var w = +t.dataset.w, h = +t.dataset.h;
      ba.style.setProperty('--r', w + ' / ' + h); ba.style.setProperty('--rn', (w / h).toFixed(3));
      var big = window.innerWidth > 700;
      var src = function (n) { return 'images/work/' + n + (big ? '' : '-sm') + '.webp'; };
      imgA.src = src(t.dataset.after); imgB.src = src(t.dataset.before);
      imgA.width = imgB.width = w; imgA.height = imgB.height = h;
      title.textContent = t.dataset.title; cap.textContent = t.dataset.cap;
      count.textContent = (idx + 1) + ' of ' + list.length;
      ba.classList.remove('ba-swap'); void ba.offsetWidth; ba.classList.add('ba-swap');
      setPos(50, false);
      if (fromUser) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    };
    thumbs.forEach(function (t) { t.setAttribute('role', 'listitem'); t.addEventListener('click', function () { load(t, true); }); });
    var step = function (d) { var l = visible(); load(l[(idx + d + l.length) % l.length], true); };
    $('#ba-prev').addEventListener('click', function () { step(-1); });
    $('#ba-next').addEventListener('click', function () { step(1); });
    $$('#ba-filters .fchip').forEach(function (c) {
      c.addEventListener('click', function () {
        $$('#ba-filters .fchip').forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
        var f = c.dataset.f;
        thumbs.forEach(function (t) { t.hidden = !(f === 'all' || t.dataset.cat === f); });
        load(visible()[0], false);
        $('#ba-thumbs').scrollLeft = 0;
      });
    });
    // dragging
    var dragging = false;
    var move = function (x) { var r = ba.getBoundingClientRect(); setPos((x - r.left) / r.width * 100, false); };
    var mark = function () { if (!touched) { touched = true; ba.classList.add('touched'); } };
    ba.addEventListener('pointerdown', function (e) { dragging = true; mark(); ba.classList.add('drag'); ba.setPointerCapture(e.pointerId); move(e.clientX); });
    ba.addEventListener('pointermove', function (e) { if (dragging) move(e.clientX); });
    var end = function () { dragging = false; ba.classList.remove('drag'); };
    ba.addEventListener('pointerup', end); ba.addEventListener('pointercancel', end);
    ba.addEventListener('keydown', function (e) {
      var k = e.key, d = e.shiftKey ? 15 : 5;
      if (k === 'ArrowLeft') { e.preventDefault(); mark(); setPos(pos - d); }
      else if (k === 'ArrowRight') { e.preventDefault(); mark(); setPos(pos + d); }
      else if (k === 'Home') { e.preventDefault(); setPos(0); }
      else if (k === 'End') { e.preventDefault(); setPos(100); }
    });
    // first-view nudge so people know it moves
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return; o.disconnect();
          setTimeout(function () { if (!touched) setPos(78, true); }, 500);
          setTimeout(function () { if (!touched) setPos(24, true); }, 1300);
          setTimeout(function () { if (!touched) setPos(50, true); }, 2100);
        });
      }, { threshold: 0.5 }).observe(ba);
    }
    load(thumbs[0], false);
  }

  /* ---------- Lightbox (gallery) ---------- */
  var lb = $('#lb');
  if (lb) {
    var items = $$('.gal-item'), cur = 0, opener = null;
    var lbImg = $('img', lb), lbCap = $('figcaption', lb);
    var show = function (i) {
      cur = (i + items.length) % items.length;
      var it = items[cur];
      lbImg.src = it.dataset.full; lbImg.alt = $('img', it).alt; lbCap.textContent = it.dataset.cap;
      lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    };
    var open = function (i, el) { opener = el; lb.hidden = false; lb.classList.add('open'); document.body.style.overflow = 'hidden'; show(i); $('.lb-x', lb).focus(); };
    var close = function () { lb.classList.remove('open'); lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); };
    items.forEach(function (it, i) { it.addEventListener('click', function () { open(i, it); }); });
    $('.lb-x', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'Tab') { // focus trap
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = 0, sy = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  $$('[data-faq] .faq-item').forEach(function (item) {
    var q = $('.faq-q', item);
    q.addEventListener('click', function () {
      var open = !item.classList.contains('open');
      $$('[data-faq] .faq-item.open').forEach(function (o) { o.classList.remove('open'); $('.faq-q', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
    });
  });

  /* ---------- Form: inline validation + animated submit ---------- */
  var form = $('[data-form]');
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length > 1; },
      phone: function (v) { return v.replace(/\D/g, '').length >= 6; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      service: function (v) { return v !== ''; }
    };
    var check = function (el) {
      var r = rules[el.name]; if (!r) return true;
      var ok = r(el.value), f = el.closest('.field');
      f.classList.toggle('bad', !ok); f.classList.toggle('ok', ok);
      el.setAttribute('aria-invalid', !ok);
      return ok;
    };
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.closest('.bad')) check(el); });
      el.addEventListener('input', function () { if (el.closest('.bad')) check(el); });
    });
    form.addEventListener('submit', function (e) {
      var bad = $$('input,select,textarea', form).filter(function (el) { return rules[el.name] && !check(el); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
      $('.submit', form).classList.add('loading');
    });
  }

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
