// Authentication JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggle();
    initPasswordStrength();
    initFormValidation();
});

// Password visibility toggle
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password strength indicator
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updateStrengthIndicator(strengthIndicator, strength);
        });
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('One uppercase letter');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('One lowercase letter');
    
    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('One number');
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('One special character');
    
    return {
        score: score,
        feedback: feedback,
        level: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong'
    };
}

// Update strength indicator
function updateStrengthIndicator(indicator, strength) {
    const strengthBar = indicator.querySelector('.strength-bar');
    const strengthText = indicator.querySelector('.strength-text');
    
    // Remove existing classes
    strengthBar.className = 'strength-bar';
    
    // Add strength class
    if (strength.score > 0) {
        strengthBar.classList.add(`strength-${strength.level}`);
    }
    
    // Update text
    const strengthLabels = {
        weak: 'Weak password',
        medium: 'Medium password',
        strong: 'Strong password'
    };
    
    strengthText.textContent = strength.score === 0 ? 'Password strength' : strengthLabels[strength.level];
}

// Form validation
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
        
        // Real-time validation for signup
        const confirmPassword = document.getElementById('confirmPassword');
        const password = document.getElementById('password');
        
        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', function() {
                validatePasswordMatch(password.value, this.value, this);
            });
        }
    }
}

// Handle login form submission
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };
    
    if (validateLoginForm(loginData)) {
        submitLogin(loginData);
    }
}

// Handle signup form submission
function handleSignupSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.get('terms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };
    
    if (validateSignupForm(signupData)) {
        submitSignup(signupData);
    }
}

// Validate login form
function validateLoginForm(data) {
    const errors = [];
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
        highlightField('email', false);
    } else {
        highlightField('email', true);
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
        highlightField('password', false);
    } else {
        highlightField('password', true);
    }
    
    if (errors.length > 0) {
        showAuthNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Validate signup form
function validateSignupForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name is required');
        highlightField('firstName', false);
    } else {
        highlightField('firstName', true);
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name is required');
        highlightField('lastName', false);
    } else {
        highlightField('lastName', true);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
        highlightField('email', false);
    } else {
        highlightField('email', true);
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Valid phone number is required');
        highlightField('phone', false);
    } else {
        highlightField('phone', true);
    }
    
    const passwordStrength = calculatePasswordStrength(data.password);
    if (passwordStrength.score < 3) {
        errors.push('Password is too weak. Please use a stronger password.');
        highlightField('password', false);
    } else {
        highlightField('password', true);
    }
    
    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
        highlightField('confirmPassword', false);
    } else {
        highlightField('confirmPassword', true);
    }
    
    if (!data.terms) {
        errors.push('You must agree to the Terms of Service and Privacy Policy');
    }
    
    if (errors.length > 0) {
        showAuthNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Validate password match
function validatePasswordMatch(password, confirmPassword, field) {
    if (confirmPassword && password !== confirmPassword) {
        highlightField(field.id, false);
    } else if (confirmPassword) {
        highlightField(field.id, true);
    }
}

// Submit login
function submitLogin(data) {
    const submitButton = document.querySelector('.btn-auth');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Signing In...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAuthNotification(
            `Welcome back! You have been successfully signed in.`,
            'success'
        );
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Redirect to dashboard or previous page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        console.log('Login submitted:', { ...data, password: '[HIDDEN]' });
        
    }, 2000);
}

// Submit signup
function submitSignup(data) {
    const submitButton = document.querySelector('.btn-auth');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAuthNotification(
            `Welcome ${data.firstName}! Your account has been created successfully. Please check your email to verify your account.`,
            'success'
        );
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Redirect to login or dashboard
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
        console.log('Signup submitted:', { ...data, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
        
    }, 2000);
}

// Highlight form field
function highlightField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error', 'success');
        if (isValid !== null) {
            field.classList.add(isValid ? 'success' : 'error');
        }
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show authentication notification
function showAuthNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
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
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 16px;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInAuth 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInAuth {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
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
    `;
    
    if (!document.querySelector('#auth-notification-styles')) {
        style.id = 'auth-notification-styles';
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInAuth 0.3s ease-in reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
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
        default: return '#1e3a8a';
    }
}