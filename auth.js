// Authentication JavaScript for login and signup pages

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    initPasswordToggles();
    initPasswordStrength();
    initFormValidation();
});

// Initialize authentication forms
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
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
        showLoadingState(e.target);
        
        // Simulate login API call
        setTimeout(() => {
            // For demo purposes, accept any email/password combination
            showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            // Store user session (in real app, this would be handled by backend)
            if (loginData.remember) {
                localStorage.setItem('rememberedEmail', loginData.email);
            }
            
            // Redirect to dashboard (for demo, redirect to home)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        }, 2000);
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
        role: formData.get('role'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.get('terms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };
    
    if (validateSignupForm(signupData)) {
        showLoadingState(e.target);
        
        // Simulate signup API call
        setTimeout(() => {
            showNotification('Account created successfully! Please check your email for verification.', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            
        }, 2000);
    }
}

// Validate login form
function validateLoginForm(data) {
    const errors = [];
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        highlightField('email', false);
    } else {
        highlightField('email', true);
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
        highlightField('password', false);
    } else {
        highlightField('password', true);
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Validate signup form
function validateSignupForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
        highlightField('firstName', false);
    } else {
        highlightField('firstName', true);
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
        highlightField('lastName', false);
    } else {
        highlightField('lastName', true);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        highlightField('email', false);
    } else {
        highlightField('email', true);
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
        highlightField('phone', false);
    } else {
        highlightField('phone', true);
    }
    
    if (!data.role) {
        errors.push('Please select your role');
        highlightField('role', false);
    } else {
        highlightField('role', true);
    }
    
    const passwordStrength = checkPasswordStrength(data.password);
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
        errors.push('Please accept the Terms of Service and Privacy Policy');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Highlight form field based on validation
function highlightField(fieldName, isValid) {
    const field = document.getElementById(fieldName);
    if (field) {
        const inputGroup = field.closest('.input-group');
        if (inputGroup) {
            inputGroup.classList.remove('error', 'success');
            inputGroup.classList.add(isValid ? 'success' : 'error');
        }
    }
}

// Initialize password toggles
function initPasswordToggles() {
    // Remember email functionality
    const emailField = document.getElementById('email');
    if (emailField && window.location.pathname.includes('login')) {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailField.value = rememberedEmail;
            document.getElementById('remember').checked = true;
        }
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(fieldId + 'ToggleIcon');
    
    if (field && icon) {
        if (field.type === 'password') {
            field.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            field.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Initialize password strength checker
function initPasswordStrength() {
    const passwordField = document.getElementById('password');
    if (passwordField && window.location.pathname.includes('signup')) {
        passwordField.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrengthUI(strength);
        });
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let level = 'weak';
    let text = 'Weak password';
    
    if (score >= 5) {
        level = 'strong';
        text = 'Strong password';
    } else if (score >= 4) {
        level = 'good';
        text = 'Good password';
    } else if (score >= 3) {
        level = 'fair';
        text = 'Fair password';
    }
    
    return { score, level, text, checks };
}

// Update password strength UI
function updatePasswordStrengthUI(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (strengthFill && strengthText) {
        strengthFill.className = `strength-fill ${strength.level}`;
        strengthText.textContent = strength.text;
    }
}

// Initialize form validation
function initFormValidation() {
    // Real-time validation for all form fields
    const formFields = document.querySelectorAll('input, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Clear error state on input
            const inputGroup = this.closest('.input-group');
            if (inputGroup && inputGroup.classList.contains('error')) {
                inputGroup.classList.remove('error');
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.type) {
        case 'email':
            isValid = value && isValidEmail(value);
            break;
        case 'tel':
            isValid = value && isValidPhone(value);
            break;
        case 'password':
            if (field.id === 'confirmPassword') {
                const password = document.getElementById('password').value;
                isValid = value && value === password;
            } else {
                isValid = value && value.length >= 6;
            }
            break;
        case 'text':
            isValid = value && value.length >= 2;
            break;
        default:
            isValid = value.length > 0;
    }
    
    highlightField(field.id, isValid);
    return isValid;
}

// Handle social login
function handleSocialLogin(e) {
    const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Microsoft';
    
    showNotification(`Redirecting to ${provider} login...`, 'info');
    
    // Simulate social login redirect
    setTimeout(() => {
        // In a real app, this would redirect to the OAuth provider
        showNotification(`${provider} login would be initiated here`, 'info');
    }, 1000);
}

// Show loading state for form
function showLoadingState(form) {
    const submitButton = form.querySelector('.btn-auth');
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
    }
}

// Remove loading state from form
function removeLoadingState(form) {
    const submitButton = form.querySelector('.btn-auth');
    if (submitButton) {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}

// Show notification (same as main script but adapted for auth pages)
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
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color based on type
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#90EE90';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Make togglePassword function globally available
window.togglePassword = togglePassword;