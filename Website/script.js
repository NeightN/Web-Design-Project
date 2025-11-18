document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav__toggle');
  const navDrawer = document.getElementById('navDrawer');
  const searchInput = document.querySelector('.nav-panel__search input');
  const toggleIcon = document.querySelector('.nav__toggle-icon');

  if (!toggle || !navDrawer || !toggleIcon) return;

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
      
      // Determine the correct path based on current location
      const isInSubfolder = window.location.pathname.includes('/pages/');
      const resultsPath = isInSubfolder ? './results.html' : './pages/search/results.html';
      
      // Redirect to results page (with search term if provided)
      if (searchTerm) {
        window.location.href = `${resultsPath}?q=${encodeURIComponent(searchTerm)}`;
      } else {
        window.location.href = resultsPath;
      }
    });
  });

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

  // Registration Modal Functionality
  const modal = document.getElementById('registrationModal');
  const registrationButtons = document.querySelectorAll('a[href="#registrace"], .header__cta');
  const closeModal = document.querySelector('.modal__close');
  const modalBackdrop = document.querySelector('.modal__backdrop');
  const cancelButton = document.getElementById('cancelRegistration');

  // Calendar functionality
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Available time slots
  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  // Open modal
  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
    modal.setAttribute('aria-hidden', 'false');
    generateCalendar();
    document.querySelector('.form-input').focus();
  }

  // Close modal
  function closeRegistrationModal() {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    modal.setAttribute('aria-hidden', 'true');
    resetForm();
  }

  // Reset form
  function resetForm() {
    document.getElementById('registrationForm').reset();
    selectedDate = null;
    selectedTime = null;
    document.getElementById('timeSlots').style.display = 'none';
    document.getElementById('selectedDateTime').value = '';
  }

  // Generate calendar
  function generateCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarDays = document.getElementById('calendarDays');
    
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
    
    timeSlotsGrid.innerHTML = '';
    
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.textContent = time;
      timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
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
    const dateStr = selectedDate.toLocaleDateString('cs-CZ');
    selectedDateTime.value = `${dateStr} ${time}`;
  }

  // Calendar navigation
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
  });

  // Event listeners for modal
  registrationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModal.addEventListener('click', closeRegistrationModal);
  modalBackdrop.addEventListener('click', closeRegistrationModal);
  cancelButton.addEventListener('click', closeRegistrationModal);

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeRegistrationModal();
    }
  });

  // Form submission
  // Form validation functions
  function showCheckboxError() {
    const checkboxLabel = document.querySelector('.checkbox-label');
    const errorElement = document.getElementById('checkboxError');
    
    checkboxLabel.classList.add('error');
    if (errorElement) {
      errorElement.classList.add('show');
    }
  }
  
  function hideCheckboxError() {
    const checkboxLabel = document.querySelector('.checkbox-label');
    const errorElement = document.getElementById('checkboxError');
    
    checkboxLabel.classList.remove('error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  // Reset all form errors
  function resetFormErrors() {
    hideCheckboxError();
    // Remove error states from other fields if any
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

  document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset previous errors
    resetFormErrors();
    
    // Validate required fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const gdprConsent = document.getElementById('gdprConsent').checked;
    
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
    const selectedDateTime = document.getElementById('selectedDateTime').value;
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
});