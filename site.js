// Glasshouse Collective — shared interactions
(function () {
  // Mark JS active so the fail-safe reveal styles engage (content stays visible without JS)
  document.documentElement.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  // Sticky header state
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealAll() { els.forEach(function (el) { el.classList.add('in'); }); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: if anything hasn't revealed shortly after load, show it.
    window.addEventListener('load', function () {
      setTimeout(function () {
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add('in');
        });
      }, 300);
    });
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }
})();
