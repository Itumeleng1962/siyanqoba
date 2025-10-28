// Public Schedule page JavaScript functionality

let currentDate = new Date();
let scheduleData = []; // Will store schedule data for calendar view

document.addEventListener('DOMContentLoaded', function() {
    initSchedulePage();
    initViewToggle();
    initLocationFilter();
    initMonthNavigation();
    initBookingModal();
    initMobileMenu();
    generateCalendarView();
    extractScheduleData();
});

// Initialize schedule page
function initSchedulePage() {
    updateCurrentMonthDisplay();
}

// Initialize view toggle
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const listView = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle views
            const view = this.getAttribute('data-view');
            if (view === 'list') {
                listView.classList.add('active');
                calendarView.classList.remove('active');
            } else {
                listView.classList.remove('active');
                calendarView.classList.add('active');
                generateCalendarView(); // Regenerate calendar when switched to
            }
        });
    });
}

// Initialize location filter
function initLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    const scheduleItems = document.querySelectorAll('.schedule-item');
    
    locationFilter.addEventListener('change', function() {
        const selectedLocation = this.value;
        filterScheduleByLocation(selectedLocation, scheduleItems);
    });
}

// Filter schedule by location
function filterScheduleByLocation(location, scheduleItems) {
    scheduleItems.forEach(item => {
        if (location === 'all' || item.getAttribute('data-location') === location) {
            item.classList.remove('hidden');
            item.classList.add('fade-in');
        } else {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        }
    });
}

// Initialize month navigation
function initMonthNavigation() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    prevBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCurrentMonthDisplay();
        generateCalendarView();
    });
    
    nextBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCurrentMonthDisplay();
        generateCalendarView();
    });
}

// Update current month display
function updateCurrentMonthDisplay() {
    const monthElement = document.getElementById('currentMonth');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    monthElement.textContent = `${monthName} ${year}`;
}

// Extract schedule data from DOM for calendar view
function extractScheduleData() {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleData = [];
    
    scheduleItems.forEach(item => {
        const dateStr = item.getAttribute('data-date');
        const courseName = item.querySelector('h3').textContent;
        const location = item.querySelector('.detail:nth-child(3) span').textContent;
        
        scheduleData.push({
            date: new Date(dateStr),
            course: courseName,
            location: location,
            element: item
        });
    });
}

// Generate calendar view
function generateCalendarView() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Create header row
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'calendar-header';
        headerCell.textContent = day;
        calendarGrid.appendChild(headerCell);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + i);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        if (cellDate.getMonth() !== currentMonth) {
            dayCell.style.opacity = '0.3';
        }
        
        // Check for events on this date
        const dayEvents = scheduleData.filter(event => 
            event.date.getDate() === cellDate.getDate() &&
            event.date.getMonth() === cellDate.getMonth() &&
            event.date.getFullYear() === cellDate.getFullYear()
        );
        
        if (dayEvents.length > 0) {
            dayCell.classList.add('has-event');
        }
        
        dayCell.innerHTML = `
            <div class="day-number">${cellDate.getDate()}</div>
            <div class="day-events">
                ${dayEvents.map(event => `
                    <div class="calendar-event" title="${event.course} - ${event.location}">
                        ${event.course.substring(0, 15)}${event.course.length > 15 ? '...' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add click handler for days with events
        if (dayEvents.length > 0) {
            dayCell.addEventListener('click', function() {
                // Switch to list view and scroll to first event
                document.querySelector('[data-view="list"]').click();
                setTimeout(() => {
                    dayEvents[0].element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    dayEvents[0].element.style.outline = '3px solid var(--light-green)';
                    setTimeout(() => {
                        dayEvents[0].element.style.outline = 'none';
                    }, 2000);
                }, 300);
            });
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

// Initialize booking modal
function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('bookingForm');
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeBookingModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', handleBookingSubmit);
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeBookingModal();
        }
    });
}

// Open booking modal
function openBookingModal(courseName, date, location, price) {
    const modal = document.getElementById('bookingModal');
    
    // Set course details
    document.getElementById('modalCourseName').textContent = courseName;
    document.getElementById('modalDate').textContent = date;
    document.getElementById('modalLocation').textContent = location;
    document.getElementById('modalPrice').textContent = price;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('bookFirstName').focus();
    }, 100);
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    form.reset();
    
    // Remove validation states
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        courseName: document.getElementById('modalCourseName').textContent,
        date: document.getElementById('modalDate').textContent,
        location: document.getElementById('modalLocation').textContent,
        price: document.getElementById('modalPrice').textContent,
        firstName: formData.get('firstName') || document.getElementById('bookFirstName').value,
        lastName: formData.get('lastName') || document.getElementById('bookLastName').value,
        email: formData.get('email') || document.getElementById('bookEmail').value,
        phone: formData.get('phone') || document.getElementById('bookPhone').value,
        company: formData.get('company') || document.getElementById('bookCompany').value,
        dietary: formData.get('dietary') || document.getElementById('bookDietary').value,
        comments: formData.get('comments') || document.getElementById('bookComments').value
    };
    
    if (validateBookingForm(bookingData)) {
        submitBooking(bookingData);
    }
}

// Validate booking form
function validateBookingForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name is required (minimum 2 characters)');
        highlightField('bookFirstName', false);
    } else {
        highlightField('bookFirstName', true);
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name is required (minimum 2 characters)');
        highlightField('bookLastName', false);
    } else {
        highlightField('bookLastName', true);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
        highlightField('bookEmail', false);
    } else {
        highlightField('bookEmail', true);
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Valid phone number is required');
        highlightField('bookPhone', false);
    } else {
        highlightField('bookPhone', true);
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Submit booking
function submitBooking(data) {
    const submitButton = document.querySelector('#bookingForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(
            `Excellent! Your booking for "${data.courseName}" starting ${data.date} has been confirmed. You will receive a confirmation email shortly with payment details and joining instructions.`,
            'success'
        );
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Close modal
        closeBookingModal();
        
        // Log booking data
        console.log('Booking confirmed:', data);
        
    }, 2000);
}

// Highlight form field
function highlightField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error', 'success');
        field.classList.add(isValid ? 'success' : 'error');
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        max-width: 450px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 16px;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 7 seconds for longer messages
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 7000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#90EE90';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Make functions globally available
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;

// Add styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
    }
    
    .notification-close:hover {
        background-color: #f3f4f6;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-item {
            margin: 1rem 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

document.head.appendChild(style);