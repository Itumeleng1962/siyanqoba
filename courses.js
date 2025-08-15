// Courses page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initCourseFilter();
    initCourseSearch();
    initEnrollmentModal();
    initMobileMenu();
});

// Initialize course filtering
function initCourseFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseItems = document.querySelectorAll('.course-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter courses
            const filterValue = this.getAttribute('data-filter');
            filterCourses(filterValue, courseItems);
        });
    });
}

// Filter courses based on category
function filterCourses(category, courseItems) {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.classList.add('loading');
    
    setTimeout(() => {
        courseItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.classList.remove('hidden');
                item.classList.add('fade-in');
            } else {
                item.classList.add('hidden');
                item.classList.remove('fade-in');
            }
        });
        
        coursesGrid.classList.remove('loading');
    }, 300);
}

// Initialize course search
function initCourseSearch() {
    const searchInput = document.getElementById('courseSearch');
    const courseItems = document.querySelectorAll('.course-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        searchCourses(searchTerm, courseItems);
    });
}

// Search courses by title and description
function searchCourses(searchTerm, courseItems) {
    courseItems.forEach(item => {
        const courseCard = item.querySelector('.course-card');
        const title = courseCard.querySelector('h3').textContent.toLowerCase();
        const description = courseCard.querySelector('p').textContent.toLowerCase();
        const category = courseCard.querySelector('.course-category').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm) || 
                            description.includes(searchTerm) || 
                            category.includes(searchTerm);
        
        if (matchesSearch || searchTerm === '') {
            item.classList.remove('hidden');
            item.classList.add('fade-in');
        } else {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        }
    });
}

// Initialize enrollment modal
function initEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('enrollmentForm');
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeEnrollmentModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEnrollmentModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', handleEnrollmentSubmit);
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeEnrollmentModal();
        }
    });
}

// Open enrollment modal
function openEnrollmentModal(courseName) {
    const modal = document.getElementById('enrollmentModal');
    const courseNameElement = document.getElementById('modalCourseName');
    
    courseNameElement.textContent = courseName;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('enrollFirstName').focus();
    }, 100);
}

// Close enrollment modal
function closeEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    const form = document.getElementById('enrollmentForm');
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    form.reset(); // Clear form
    
    // Remove any validation states
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Handle enrollment form submission
function handleEnrollmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const enrollmentData = {
        courseName: document.getElementById('modalCourseName').textContent,
        firstName: formData.get('firstName') || document.getElementById('enrollFirstName').value,
        lastName: formData.get('lastName') || document.getElementById('enrollLastName').value,
        email: formData.get('email') || document.getElementById('enrollEmail').value,
        phone: formData.get('phone') || document.getElementById('enrollPhone').value,
        company: formData.get('company') || document.getElementById('enrollCompany').value,
        experience: formData.get('experience') || document.getElementById('enrollExperience').value,
        preference: formData.get('preference') || document.getElementById('enrollPreference').value,
        comments: formData.get('comments') || document.getElementById('enrollComments').value
    };
    
    if (validateEnrollmentForm(enrollmentData)) {
        submitEnrollment(enrollmentData);
    }
}

// Validate enrollment form
function validateEnrollmentForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name is required (minimum 2 characters)');
        highlightField('enrollFirstName', false);
    } else {
        highlightField('enrollFirstName', true);
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name is required (minimum 2 characters)');
        highlightField('enrollLastName', false);
    } else {
        highlightField('enrollLastName', true);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
        highlightField('enrollEmail', false);
    } else {
        highlightField('enrollEmail', true);
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Valid phone number is required');
        highlightField('enrollPhone', false);
    } else {
        highlightField('enrollPhone', true);
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Submit enrollment
function submitEnrollment(data) {
    const submitButton = document.querySelector('#enrollmentForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(
            `Thank you ${data.firstName}! Your enrollment request for "${data.courseName}" has been submitted successfully. Our team will contact you within 24 hours to confirm your enrollment.`,
            'success'
        );
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Close modal
        closeEnrollmentModal();
        
        // Optional: Log enrollment data for tracking
        console.log('Enrollment submitted:', data);
        
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
    
    // Auto remove after 6 seconds for longer messages
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
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

// Qualification details functionality
function toggleQualificationDetails(qualificationType) {
    // Close any open details first
    const allSections = document.querySelectorAll('.qualification-detail-section');
    allSections.forEach(section => {
        if (section.id !== `${qualificationType}-details`) {
            section.classList.remove('active');
        }
    });
    
    // Toggle the clicked section
    const targetSection = document.getElementById(`${qualificationType}-details`);
    if (targetSection) {
        targetSection.classList.toggle('active');
        
        // Scroll to the section if it's being opened
        if (targetSection.classList.contains('active')) {
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
}

function closeQualificationDetails(qualificationType) {
    const targetSection = document.getElementById(`${qualificationType}-details`);
    if (targetSection) {
        targetSection.classList.remove('active');
    }
}

// Make functions globally available
window.openEnrollmentModal = openEnrollmentModal;
window.closeEnrollmentModal = closeEnrollmentModal;
window.toggleQualificationDetails = toggleQualificationDetails;
window.closeQualificationDetails = closeQualificationDetails;

// Add styles for form validation
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
    
    #enrollmentForm input.error,
    #enrollmentForm select.error,
    #enrollmentForm textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    #enrollmentForm input.success,
    #enrollmentForm select.success,
    #enrollmentForm textarea.success {
        border-color: var(--light-green);
        box-shadow: 0 0 0 3px rgba(144, 238, 144, 0.1);
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