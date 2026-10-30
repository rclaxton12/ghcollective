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
  // Netlify Forms: submit in the background and show a thank-you message in place.
  document.querySelectorAll('form[data-netlify]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.URLSearchParams) return; // fall back to a normal post
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending...'; }
      var old = form.parentNode.querySelector('.form-message--error');
      if (old) old.remove();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        var msg = document.createElement('p');
        msg.className = 'form-message';
        msg.setAttribute('role', 'status');
        msg.textContent = form.getAttribute('data-success') || 'Thank you. We will be in touch soon.';
        form.replaceWith(msg);
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        var err = document.createElement('p');
        err.className = 'form-message form-message--error';
        err.setAttribute('role', 'alert');
        err.textContent = 'Sorry, something went wrong. Please try again or call (602) 571-5538.';
        form.insertAdjacentElement('afterend', err);
      });
    });
  });
})();
