(function() {
  var el = document.getElementById('site-nav');
  if (!el) return;
  fetch('/nav.html')
    .then(function(r) { return r.text(); })
    .then(function(html) {
      el.innerHTML = html;
      // Mark the current page's link as active
      var path = window.location.pathname;
      var links = el.querySelectorAll('.nav-links a');
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === path) {
          links[i].classList.add('active');
        }
      }
      // Close menu when any nav link is clicked
      links.forEach(function(a) {
        a.addEventListener('click', function() {
          var btn = document.querySelector('.nav-hamburger');
          var menu = document.querySelector('.nav-links');
          if (btn) btn.classList.remove('open');
          if (menu) menu.classList.remove('open');
        });
      });
      // index.html: use #pricing anchor instead of Stripe link
      if (path === '/' || path === '/index.html') {
        var cta = el.querySelector('.nav-cta');
        if (cta) cta.setAttribute('href', '#pricing');
        var ctaMobile = el.querySelector('.nav-cta-mobile');
        if (ctaMobile) ctaMobile.setAttribute('href', '#pricing');
      }
    })
    .catch(function() {
      el.innerHTML = '<nav><a href="/index.html" class="nav-logo">ArtDrop™</a></nav>';
    });
})();
