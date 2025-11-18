document.addEventListener('DOMContentLoaded', function () {
  // Get search term from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q') || '';

  // Elements
  const searchTermElement = document.querySelector('.search-results__term');
  const searchInputs = document.querySelectorAll('input[name="q"]');

  // Update search term display
  if (searchTerm) {
    // Update search term display
    if (searchTermElement) {
      searchTermElement.textContent = `"${searchTerm}"`;
    }

    // Fill search inputs with the search term
    searchInputs.forEach(input => {
      input.value = searchTerm;
    });

    // Update page title
    document.title = `${searchTerm} - Výsledek vyhledávání - Praktický lékař`;
  } else {
    // If no search term, show default state
    if (searchTermElement) {
      searchTermElement.textContent = 'Počet výsledků:';
    }
  }

  // Search button functionality - simple demo redirect
  const searchButtons = document.querySelectorAll('.nav__search-btn, .nav-panel__search-btn, .search-form__btn');
  
  // Add event listeners for search buttons to demonstrate functionality
  searchButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Get search input value if available
      const searchContainer = button.closest('.nav__search, .nav-panel__search, .search-form');
      const searchInput = searchContainer ? searchContainer.querySelector('input') : null;
      const searchTerm = searchInput ? searchInput.value.trim() : '';
      
      // Reload page with new search term
      if (searchTerm) {
        window.location.href = `./results.html?q=${encodeURIComponent(searchTerm)}`;
      } else {
        window.location.href = './results.html';
      }
    });
  });

  // Filter functionality (basic demo)
  const filterButtons = document.querySelectorAll('.search-filter');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('search-filter--active'));
      
      // Add active class to clicked button
      this.classList.add('search-filter--active');
      
      // Simple visual demo - no actual filtering
      console.log('Filter clicked:', this.dataset.filter);
    });
  });

  // Navigation functionality
  const toggle = document.querySelector('.nav__toggle');
  const navDrawer = document.getElementById('navDrawer');
  const toggleIcon = document.querySelector('.nav__toggle-icon');

  if (toggle && navDrawer && toggleIcon) {
    function openDrawer() {
      navDrawer.classList.add('open');
      document.body.classList.add('no-scroll');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Zavřít menu');
      navDrawer.setAttribute('aria-hidden', 'false');
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-times');
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
  }
});