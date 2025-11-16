document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav__toggle');
  const navDrawer = document.getElementById('navDrawer');
  const searchInput = document.querySelector('.nav-panel__search input');
  const toggleIcon = document.querySelector('.nav__toggle-icon');

  if (!toggle || !navDrawer || !toggleIcon) return;

  function openDrawer() {
    navDrawer.classList.add('open');
    document.body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Zavřít menu');
    navDrawer.setAttribute('aria-hidden', 'false');
    toggleIcon.classList.remove('fa-bars');
    toggleIcon.classList.add('fa-times');
    // focus search input if present
    if (searchInput) searchInput.focus();
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otevřít menu');
    navDrawer.setAttribute('aria-hidden', 'true');
    toggleIcon.classList.remove('fa-times');
    toggleIcon.classList.add('fa-bars');
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