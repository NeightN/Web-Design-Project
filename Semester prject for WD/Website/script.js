document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav__toggle');
  const navDrawer = document.getElementById('navDrawer');
  const searchInput = document.querySelector('.nav-panel__search input');

  if (!toggle || !navDrawer) return;

  function openDrawer() {
    navDrawer.classList.add('open');
    document.body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    // focus search input if present
    if (searchInput) searchInput.focus();
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (navDrawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });

  // close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
});