(function () {
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  var links = document.getElementById('navlinks');
  var forceSolid = nav && nav.classList.contains('page');

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('solid', forceSolid || window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    if (!menu || !links) return;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('open', open);
    nav.classList.toggle('open', open);
  }
  if (menu) {
    menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Lifecycle: light each stage in turn while the list is on screen.
  var chain = document.getElementById('chain');
  if (chain) {
    var steps = chain.querySelectorAll('li');
    if (reduce) { steps.forEach(function (s) { s.classList.add('on'); }); return; }
    var i = 0, timer = null;
    function tick() {
      if (i >= steps.length) { steps.forEach(function (s) { s.classList.remove('on'); }); i = 0; }
      steps[i].classList.add('on'); i++;
    }
    var co = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { if (!timer) timer = setInterval(tick, 650); }
      else { clearInterval(timer); timer = null; }
    });
    co.observe(chain);
  }
})();
