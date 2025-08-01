// Resources page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initFAQSection();
    initPromotionModal();
    initDownloadButtons();
    initCategoryNavigation();
    initMobileMenu();
});

// Initialize FAQ section
function initFAQSection() {
    // FAQ category switching
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding category
            const category = this.getAttribute('data-category');
            faqCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.getAttribute('data-category') === category) {
                    cat.classList.add('active');
                }
            });
        });
    });
    
    // FAQ item toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close other open items in the same category
            const parentCategory = item.closest('.faq-category');
            const otherItems = parentCategory.querySelectorAll('.faq-item');
            otherItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize promotion modal
function initPromotionModal() {
    const modal = document.getElementById('promotionModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('promotionForm');
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closePromotionModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePromotionModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', handlePromotionSubmit);
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closePromotionModal();
        }
    });
}

// Open promotion modal
function openPromotionModal(promotionName) {
    const modal = document.getElementById('promotionModal');
    const nameElement = document.getElementById('modalPromotionName');
    const descriptionElement = document.getElementById('modalPromotionDescription');
    
    // Set promotion details based on name
    nameElement.textContent = promotionName;
    
    const promotionDescriptions = {
        'Early Bird Special': 'Save 15% on all course fees when you book and pay 30 days before the course start date. This offer applies to all public scheduled courses and is valid until December 31, 2024.',
        'Group Training Discount': 'Bring your team and save! Groups of 3-5 people get 15% off, groups of 6-10 get 20% off, and groups of 11+ get 25% off. Perfect for corporate training and team development.',
        'Student Discount': 'Full-time students with valid student ID cards are eligible for a 20% discount on all courses. Proof of current enrollment required at time of booking.'
    };
    
    descriptionElement.textContent = promotionDescriptions[promotionName] || 'Contact us for more details about this special offer.';
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('promoName').focus();
    }, 100);
}

// Close promotion modal
function closePromotionModal() {
    const modal = document.getElementById('promotionModal');
    const form = document.getElementById('promotionForm');
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    form.reset();
    
    // Remove validation states
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Handle promotion form submission
function handlePromotionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const promotionData = {
        promotionName: document.getElementById('modalPromotionName').textContent,
        name: formData.get('name') || document.getElementById('promoName').value,
        email: formData.get('email') || document.getElementById('promoEmail').value,
        phone: formData.get('phone') || document.getElementById('promoPhone').value,
        course: formData.get('course') || document.getElementById('promoCourse').value
    };
    
    if (validatePromotionForm(promotionData)) {
        submitPromotionRequest(promotionData);
    }
}

// Validate promotion form
function validatePromotionForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter your full name');
        highlightField('promoName', false);
    } else {
        highlightField('promoName', true);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        highlightField('promoEmail', false);
    } else {
        highlightField('promoEmail', true);
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Please enter a valid phone number');
        highlightField('promoPhone', false);
    } else {
        highlightField('promoPhone', true);
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Submit promotion request
function submitPromotionRequest(data) {
    const submitButton = document.querySelector('#promotionForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(
            `Thank you ${data.name}! Your request for "${data.promotionName}" has been submitted. Our team will contact you within 24 hours with detailed information and next steps.`,
            'success'
        );
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Close modal
        closePromotionModal();
        
        // Log promotion request
        console.log('Promotion request submitted:', data);
        
    }, 2000);
}

// Initialize download buttons
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const downloadItem = this.closest('.download-item');
            const fileName = downloadItem.querySelector('h3').textContent;
            
            // Simulate download
            showNotification(`Downloading "${fileName}"...`, 'info');
            
            // In a real application, you would trigger the actual download here
            console.log(`Download initiated for: ${fileName}`);
            
            // Show success after a delay
            setTimeout(() => {
                showNotification(`"${fileName}" downloaded successfully!`, 'success');
            }, 2000);
        });
    });
}

// Initialize category navigation
function initCategoryNavigation() {
    // Add smooth scroll offset for fixed navbar
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 100; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };
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

// Utility functions
function highlightField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error', 'success');
        field.classList.add(isValid ? 'success' : 'error');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    
    // Auto remove after 6 seconds
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

// Make functions globally available
window.openPromotionModal = openPromotionModal;
window.closePromotionModal = closePromotionModal;
window.scrollToSection = scrollToSection;

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
    
    #promotionForm input.error,
    #promotionForm select.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    #promotionForm input.success,
    #promotionForm select.success {
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
    
    /* Smooth scroll animation for category cards */
    .category-card {
        scroll-margin-top: 100px;
    }
    
    /* FAQ animation improvements */
    .faq-item {
        scroll-margin-top: 100px;
    }
    
    .faq-answer {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .faq-item.active .faq-answer {
        border-top: 1px solid var(--gray-200);
    }
    
    /* Download button loading state */
    .btn-download.loading {
        pointer-events: none;
        opacity: 0.7;
    }
    
    .btn-download.loading::after {
        content: '';
        width: 12px;
        height: 12px;
        border: 2px solid transparent;
        border-top: 2px solid var(--dark-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: var(--spacing-2);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);