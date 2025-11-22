document.addEventListener('DOMContentLoaded', function () {
  // Search Results Page - Specific functionality only
  // (General search and navigation functionality is handled by main script.js)

  // Registration modal functionality for results page
  const modal = document.getElementById('registrationModal');
  const registrationTriggers = document.querySelectorAll('.registration-trigger, a[href="#registrace"]');
  const closeModal = document.querySelector('.modal__close');
  const modalBackdrop = document.querySelector('.modal__backdrop');
  const cancelButton = document.getElementById('cancelRegistration');

  // Calendar functionality
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Available time slots - only appointment hours (13:00-16:00)
  const timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  
  // Fake occupied time slots (for demo purposes)
  const occupiedSlots = ['13:30', '14:30', '15:00'];

  // Open modal function
  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
      modal.setAttribute('aria-hidden', 'false');
      generateCalendar();
      
      // Focus first input
      const firstInput = modal.querySelector('.form-input');
      if (firstInput) firstInput.focus();
    }
  }

  // Close modal function
  function closeRegistrationModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
      modal.setAttribute('aria-hidden', 'true');
      resetForm();
    }
  }

  // Reset form
  function resetForm() {
    const form = document.getElementById('registrationForm');
    if (form) form.reset();
    selectedDate = null;
    selectedTime = null;
    const timeSlots = document.getElementById('timeSlots');
    if (timeSlots) timeSlots.style.display = 'none';
    const selectedDateTime = document.getElementById('selectedDateTime');
    if (selectedDateTime) selectedDateTime.value = '';
  }

  // Generate calendar
  function generateCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarDays = document.getElementById('calendarDays');
    
    if (!calendarTitle || !calendarDays) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const months = [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
    ];
    
    calendarTitle.textContent = `${months[month]} ${year}`;
    
    // Clear previous days
    calendarDays.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      const dayElement = createDayElement(day, true);
      calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayElement = createDayElement(date, false);
      calendarDays.appendChild(dayElement);
    }
    
    // Add next month's leading days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      const dayElement = createDayElement(date, true);
      calendarDays.appendChild(dayElement);
    }
  }

  // Create day element
  function createDayElement(date, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = date.getDate();
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today && !isToday;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    if (isOtherMonth) {
      dayElement.classList.add('other-month');
    } else if (isPast) {
      dayElement.classList.add('disabled');
    } else if (isWeekend) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.classList.add('available');
      dayElement.addEventListener('click', () => selectDate(date, dayElement));
    }
    
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      dayElement.classList.add('selected');
    }
    
    return dayElement;
  }

  // Select date
  function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
      day.classList.remove('selected');
    });
    
    // Add selection to clicked day
    element.classList.add('selected');
    selectedDate = date;
    selectedTime = null;
    
    // Show time slots
    showTimeSlots();
  }

  // Show time slots
  function showTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    
    if (!timeSlotsContainer || !timeSlotsGrid) return;
    
    timeSlotsGrid.innerHTML = '';
    
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      const isOccupied = occupiedSlots.includes(time);
      
      timeSlot.className = isOccupied ? 'time-slot time-slot--occupied' : 'time-slot';
      timeSlot.textContent = time;
      
      if (isOccupied) {
        timeSlot.title = 'Tento čas je již obsazený';
      } else {
        timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
      }
      
      timeSlotsGrid.appendChild(timeSlot);
    });
    
    timeSlotsContainer.style.display = 'block';
  }

  // Select time
  function selectTime(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Add selection to clicked time
    element.classList.add('selected');
    selectedTime = time;
    
    // Update hidden input
    const selectedDateTime = document.getElementById('selectedDateTime');
    if (selectedDateTime && selectedDate) {
      const dateStr = selectedDate.toLocaleDateString('cs-CZ');
      selectedDateTime.value = `${dateStr} ${time}`;
    }
  }

  // Calendar navigation
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      generateCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      generateCalendar();
    });
  }

  // Add click listeners for registration triggers
  registrationTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Registration triggered on results page:', this);
      openModal();
    });
  });

  // Add close modal listeners
  if (closeModal) {
    closeModal.addEventListener('click', closeRegistrationModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeRegistrationModal);
  }
  if (cancelButton) {
    cancelButton.addEventListener('click', closeRegistrationModal);
  }

  // Close modal on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeRegistrationModal();
    }
  });

  // Form validation functions
  function showCheckboxError() {
    const checkboxLabel = document.querySelector('.checkbox-label');
    const errorElement = document.getElementById('checkboxError');
    
    if (checkboxLabel) checkboxLabel.classList.add('error');
    if (errorElement) errorElement.classList.add('show');
  }
  
  function hideCheckboxError() {
    const checkboxLabel = document.querySelector('.checkbox-label');
    const errorElement = document.getElementById('checkboxError');
    
    if (checkboxLabel) checkboxLabel.classList.remove('error');
    if (errorElement) errorElement.classList.remove('show');
  }

  // Reset all form errors
  function resetFormErrors() {
    hideCheckboxError();
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.classList.remove('error');
    });
  }

  // GDPR Checkbox validation on change
  const gdprCheckbox = document.getElementById('gdprConsent');
  if (gdprCheckbox) {
    gdprCheckbox.addEventListener('change', function() {
      if (this.checked) {
        hideCheckboxError();
      }
    });
  }

  // Form submission
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset previous errors
      resetFormErrors();
      
      // Validate required fields
      const firstName = document.getElementById('firstName')?.value;
      const lastName = document.getElementById('lastName')?.value;
      const email = document.getElementById('email')?.value;
      const phone = document.getElementById('phone')?.value;
      const gdprConsent = document.getElementById('gdprConsent')?.checked;
      
      let hasErrors = false;
      
      // Validate basic required fields
      if (!firstName || !lastName || !email || !phone) {
        alert('Prosím vyplňte všechna povinná pole.');
        hasErrors = true;
      }
      
      // Validate GDPR consent specifically
      if (!gdprConsent) {
        showCheckboxError();
        hasErrors = true;
      }
      
      if (hasErrors) {
        return;
      }
      
      // Get optional appointment details
      const selectedDateTime = document.getElementById('selectedDateTime')?.value;
      let successMessage = `Registrace byla úspěšná!\n\nJméno: ${firstName} ${lastName}\nE-mail: ${email}\nTelefon: ${phone}`;
      
      if (selectedDateTime) {
        successMessage += `\nTermín: ${selectedDateTime}`;
      } else {
        successMessage += `\nTermín: Nevybrán (budeme vás kontaktovat pro domluvení)`;
      }
      
      successMessage += `\n\nBrzy vás budeme kontaktovat.`;
      
      // Success message (in real app, send data to server)
      alert(successMessage);
      
      closeRegistrationModal();
    });
  }

  // Filter functionality for search results
  const filterButtons = document.querySelectorAll('.search-filter');
  const searchResults = document.querySelectorAll('.search-result');
  
  // Initialize filter counts on page load
  updateFilterCounts();
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('search-filter--active'));
      
      // Add active class to clicked button
      this.classList.add('search-filter--active');
      
      const filterType = this.dataset.filter;
      
      // Filter search results based on category
      filterSearchResults(filterType);
      
      // Update result count display
      updateResultsCount();
    });
  });

  // Filter search results based on category
  function filterSearchResults(filterType) {
    const resultsContainer = document.querySelector('.search-results__list');
    let visibleCount = 0;
    
    if (filterType === 'all') {
      // Show all results
      searchResults.forEach(result => {
        result.style.display = 'block';
        visibleCount++;
      });
    } else {
      // Filter by specific category
      searchResults.forEach(result => {
        const categories = result.dataset.category ? result.dataset.category.split(' ') : [];
        if (categories.includes(filterType)) {
          result.style.display = 'block';
          visibleCount++;
        } else {
          result.style.display = 'none';
        }
      });
    }
    
    // Show empty state message if no results for this filter
    showEmptyStateIfNeeded(filterType, visibleCount, resultsContainer);
  }

  // Update filter button counts based on available results
  function updateFilterCounts() {
    const allCount = searchResults.length;
    
    // Count results by category
    const categoryCounts = {
      all: allCount,
      news: 0,
      services: 0,
      doctors: 0
    };
    
    searchResults.forEach(result => {
      const categories = result.dataset.category ? result.dataset.category.split(' ') : [];
      
      categories.forEach(category => {
        if (categoryCounts.hasOwnProperty(category)) {
          categoryCounts[category]++;
        }
      });
    });
    
    // Update filter button texts with counts
    filterButtons.forEach(button => {
      const filterType = button.dataset.filter;
      const count = categoryCounts[filterType] || 0;
      
      // Get the original text without count
      let buttonText = button.textContent.replace(/\s*\(\d+\)$/, '');
      
      // Map filter types to display names
      const displayNames = {
        all: 'Vše',
        news: 'Novinky',
        services: 'Služby',
        doctors: 'Lékaři'
      };
      
      if (displayNames[filterType]) {
        buttonText = displayNames[filterType];
      }
      
      // Update button text with count
      button.textContent = `${buttonText} (${count})`;
    });
  }
  
  // Get display name for filter type
  function getFilterDisplayName(filterType) {
    const filterNames = {
      'all': 'Vše',
      'news': 'Novinky',
      'services': 'Služby',
      'doctors': 'Lékaři'
    };
    return filterNames[filterType] || filterType;
  }
  
  // Show empty state message when filter has no results
  function showEmptyStateIfNeeded(filterType, visibleCount, container) {
    // Remove existing empty state message
    const existingEmptyState = container.querySelector('.empty-state');
    if (existingEmptyState) {
      existingEmptyState.remove();
    }
    
    // Show empty state if no visible results and not "all" filter
    if (visibleCount === 0 && filterType !== 'all') {
      const emptyStateDiv = document.createElement('div');
      emptyStateDiv.className = 'empty-state';
      
      const filterDisplayName = getFilterDisplayName(filterType);
      emptyStateDiv.innerHTML = `
        <p class="empty-state__message">
          Kategorie "${filterDisplayName}" je prázdná.
        </p>
      `;
      
      container.appendChild(emptyStateDiv);
    }
  }

  // Update main results count display
  function updateResultsCount() {
    const visibleResults = Array.from(searchResults).filter(result => 
      result.style.display !== 'none'
    );
    const resultsCount = document.querySelector('.search-results__number');
    
    if (resultsCount) {
      resultsCount.textContent = visibleResults.length;
    }
  }

  // Keyboard navigation for filters
  filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', function(event) {
      let targetIndex = index;
      
      switch(event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          targetIndex = index > 0 ? index - 1 : filterButtons.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          targetIndex = index < filterButtons.length - 1 ? index + 1 : 0;
          break;
        default:
          return; // Exit for other keys
      }
      
      filterButtons[targetIndex].focus();
    });
  });
});