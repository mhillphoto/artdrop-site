(function() {
  var el = document.getElementById('site-footer');
  if (!el) return;
  fetch('/footer.html')
    .then(function(r) { return r.text(); })
    .then(function(html) { el.innerHTML = html; })
    .catch(function() {
      el.innerHTML = '<footer><div class="footer-copy">© 2026 STANHATTIE LLC · ArtDrop™ · <a href="mailto:support@getartdrop.com">support@getartdrop.com</a></div></footer>';
    });
})();
