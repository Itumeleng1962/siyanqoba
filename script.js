// Main JavaScript file for Ukwakhile Training & Consulting website

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHeroSlideshow();
    initCarousel();
    initContactForm();
    initScrollEffects();
    initSmoothScrolling();
    initFAQ();
    initTestimonialCarousel();
    initMandelaSlider();
	initValuesSlider();
	initPageLoader();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const topBar = document.querySelector('.top-bar');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Dropdown toggle behavior for mobile: tap to open, tap again to close
        const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link');
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(event) {
                // On mobile, prevent navigation and toggle dropdown
                if (window.matchMedia('(max-width: 768px)').matches) {
                    event.preventDefault();
                    event.stopPropagation();

                    const parentItem = this.parentElement;
                    const isOpen = parentItem.classList.contains('open');

                    // Close all dropdowns first
                    dropdownItems.forEach(item => item.classList.remove('open'));

                    // Toggle current
                    if (!isOpen) {
                        parentItem.classList.add('open');
                    }
                }
            });
        });

        // Close menu when clicking on a non-dropdown link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                const parentItem = this.parentElement;
                const isDropdownToggle = parentItem && parentItem.classList && parentItem.classList.contains('dropdown') && this.classList.contains('nav-link');
                if (isDropdownToggle && window.matchMedia('(max-width: 768px)').matches) {
                    // Handled by dropdown toggle above
                    return;
                }
                // Close the mobile menu after selecting a leaf link
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Also close any open dropdowns
                dropdownItems.forEach(item => item.classList.remove('open'));
            });
        });

        // Close menu or any open dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                dropdownItems.forEach(item => item.classList.remove('open'));
            }
        });
    }
    
    // Sticky navigation on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (topBar) {
                topBar.style.transform = 'translateY(-100%)';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (topBar) {
                topBar.style.transform = 'translateY(0)';
            }
        }
    });
}

// Hero slideshow functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const indicators = document.querySelectorAll('.slideshow-indicators .indicator');
    
    if (!slides || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Initialize first slide as active
    updateHeroSlide();
    
    // Auto-slide every 4 seconds
    setInterval(function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateHeroSlide();
    }, 4000);
    
    // Indicator click functionality
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            updateHeroSlide();
        });
    });
    
    function updateHeroSlide() {
        // Update slide visibility
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
}

// Course categories carousel
function initCarousel() {
    const track = document.getElementById('categoryTrack');
    const slides = document.querySelectorAll('.category-slide');
    const nextBtn = document.getElementById('nextCategory');
    const prevBtn = document.getElementById('prevCategory');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Show initial slide
    updateSlide();
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
        });
    }
    
    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            updateSlide();
        });
    });
    
    // Auto-slide every 5 seconds
    setInterval(function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }, 5000);
    
    function updateSlide() {
        // Update track position
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update slide classes
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                role: formData.get('role'),
                program: formData.get('program'),
                message: formData.get('message')
            };
            
            if (validateContactForm(data)) {
                submitContactForm(data);
            }
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name is required (minimum 2 characters)');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Valid phone number is required');
    }
    
    if (!data.role) {
        errors.push('Please select your role');
    }
    
    if (!data.program) {
        errors.push('Please select a programme portfolio');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message is required (minimum 10 characters)');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Submit contact form
function submitContactForm(data) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(
            `Thank you ${data.name}! Your message has been sent successfully. Our team will contact you within 24 hours.`,
            'success'
        );
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Log contact data for tracking
        console.log('Contact form submitted:', data);
        
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll effects
function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.event-card, .download-card, .accreditation-item, .client-logo').forEach(el => {
        observer.observe(el);
    });
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
        top: 120px;
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
        default: return '#1e3a8a';
    }
}

// Newsletter form
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    // Handle all anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // Account for fixed header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add a visual highlight to the target section
                targetElement.style.transition = 'all 0.3s ease';
                targetElement.style.transform = 'scale(1.02)';
                targetElement.style.boxShadow = '0 10px 30px rgba(203, 251, 5, 0.2)';
                
                setTimeout(() => {
                    targetElement.style.transform = '';
                    targetElement.style.boxShadow = '';
                }, 1000);
            }
        });
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Testimonial carousel functionality
// Mandela Slider functionality
function initMandelaSlider() {
    const sliderContainer = document.querySelector('.mandela-slider');
    const slides = document.querySelectorAll('.mandela-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    if (!sliderContainer || slides.length === 0) return;
    let currentSlide = 0;
    let interval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (dots && dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
        }
        
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        if (dots && dots.length > 0 && dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Start automatic sliding
    startAutoSlide();

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
}

function initTestimonialCarousel() {
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevTestimonial = document.getElementById('prevTestimonial');
    const nextTestimonial = document.getElementById('nextTestimonial');
    const testimonialIndicators = document.getElementById('testimonialIndicators');
    let currentTestimonial = 0;

    function updateTestimonialCarousel(index) {
        const slides = testimonialTrack.getElementsByClassName('testimonial-slide');
        const indicators = testimonialIndicators.getElementsByClassName('indicator');
        
        // Hide all slides
        Array.from(slides).forEach(slide => slide.classList.remove('active'));
        Array.from(indicators).forEach(indicator => indicator.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    // Next button
    if (nextTestimonial) {
        nextTestimonial.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialTrack.children.length;
            updateTestimonialCarousel(currentTestimonial);
        });
    }
    
    // Previous button
    if (prevTestimonial) {
        prevTestimonial.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonialTrack.children.length) % testimonialTrack.children.length;
            updateTestimonialCarousel(currentTestimonial);
        });
    }
    
    // Indicators
    if (testimonialIndicators) {
        testimonialIndicators.addEventListener('click', function(e) {
            if (e.target.classList.contains('indicator')) {
                const index = Array.from(e.target.parentNode.children).indexOf(e.target);
                currentTestimonial = index;
                updateTestimonialCarousel(currentTestimonial);
            }
        });
    }

    // Auto-slide every 7 seconds
    setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialTrack.children.length;
        updateTestimonialCarousel(currentTestimonial);
    }, 7000);
}

// Values slider (About page)
function initValuesSlider() {
	const slider = document.querySelector('.values-slider');
	if (!slider) return;

	const track = slider.querySelector('.values-track');
	const slides = Array.from(slider.querySelectorAll('.values-slide'));
	const prevBtn = slider.querySelector('.values-prev');
	const nextBtn = slider.querySelector('.values-next');
	const dotsContainer = slider.querySelector('.values-dots');

	let currentIndex = 0;
	let autoIntervalId;

	function updateSlider() {
		track.style.transform = `translateX(-${currentIndex * 100}%)`;
		slides.forEach((slide, index) => {
			slide.classList.toggle('active', index === currentIndex);
		});
		if (dotsContainer) {
			const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
			dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
		}
	}

	function goTo(index) {
		const total = slides.length;
		currentIndex = (index + total) % total;
		updateSlider();
	}

	function next() { goTo(currentIndex + 1); }
	function prev() { goTo(currentIndex - 1); }

	function startAuto() {
		stopAuto();
		autoIntervalId = setInterval(next, 5000);
	}

	function stopAuto() {
		if (autoIntervalId) clearInterval(autoIntervalId);
	}

	if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
	if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

	if (dotsContainer) {
		const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => { goTo(index); startAuto(); });
		});
	}

	slider.addEventListener('mouseenter', stopAuto);
	slider.addEventListener('mouseleave', startAuto);

	// Initialize
	updateSlider();
	startAuto();
}

// Initialize newsletter on load
document.addEventListener('DOMContentLoaded', initNewsletter);

// Global page loader (spinner overlay)
function initPageLoader() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-loader';
    overlay.innerHTML = `
        <div class="loader-backdrop"></div>
        <div class="loader-content" aria-live="polite" aria-busy="true">
            <div class="loader-spinner"></div>
            <div class="loader-text">Loading...</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Show on initial load until all assets ready
    overlay.classList.add('visible');
    window.addEventListener('load', function() {
        overlay.classList.remove('visible');
        // remove after transition ends
        setTimeout(() => overlay.classList.add('hidden'), 300);
    });

    // Intercept internal link clicks to show loader immediately
    document.body.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        // Determine if internal navigation
        const isSameOrigin = anchor.origin === window.location.origin;
        if (!isSameOrigin) return; // skip external

        // If opening in new tab/window, do not show overlay on current page
        const target = anchor.getAttribute('target');
        const modifier = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
        if (target === '_blank' || modifier) return;

        // Show loader overlay
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
    });
}