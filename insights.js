// Insights page interactions and animations

document.addEventListener('DOMContentLoaded', () => {
    initInsightScrollReveal();
    initInsightFilters();
    initSpotlightSlider();
    initPressTicker();
});

function initInsightScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length || typeof IntersectionObserver === 'undefined') {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

function initInsightFilters() {
    const filterButtons = document.querySelectorAll('.insights-filter button');
    const cards = document.querySelectorAll('.insight-card');
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            const selectedCategory = button.dataset.category || 'all';

            cards.forEach(card => {
                const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
                if (matchesCategory) {
                    card.classList.remove('is-hidden');
                    requestAnimationFrame(() => card.classList.add('revealed'));
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

function initSpotlightSlider() {
    const slider = document.querySelector('.spotlight-slider');
    if (!slider) return;

    const track = slider.querySelector('.spotlight-track');
    const cards = Array.from(track.querySelectorAll('.spotlight-card'));
    const prevBtn = slider.querySelector('.spotlight-control.prev');
    const nextBtn = slider.querySelector('.spotlight-control.next');

    if (!cards.length) return;

    let currentIndex = cards.findIndex(card => card.classList.contains('active'));
    currentIndex = currentIndex >= 0 ? currentIndex : 0;

    const autoplay = slider.dataset.autoplay !== 'false';
    let autoplayId = null;
    const AUTOPLAY_DELAY = 7000;

    function showSlide(index) {
        const boundedIndex = (index + cards.length) % cards.length;
        currentIndex = boundedIndex;

        cards.forEach((card, idx) => {
            card.classList.toggle('active', idx === currentIndex);
        });

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoplay() {
        if (!autoplay) return;
        stopAutoplay();
        autoplayId = window.setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (autoplayId) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    showSlide(currentIndex);
    startAutoplay();
}

function initPressTicker() {
    const pressItems = document.querySelectorAll('.press-item');
    if (pressItems.length <= 1) return;

    let currentIndex = Array.from(pressItems).findIndex(item => item.classList.contains('active'));
    currentIndex = currentIndex >= 0 ? currentIndex : 0;

    let tickerId = null;
    let isPaused = false;
    const TICKER_DELAY = 6000;

    function activateItem(index) {
        pressItems.forEach(item => item.classList.remove('active'));
        pressItems[index].classList.add('active');
        currentIndex = index;
    }

    function cycleItems() {
        if (isPaused) return;
        const nextIndex = (currentIndex + 1) % pressItems.length;
        activateItem(nextIndex);
    }

    const container = pressItems[0].parentElement;
    if (container) {
        container.addEventListener('mouseenter', () => { isPaused = true; });
        container.addEventListener('mouseleave', () => { isPaused = false; });
    }

    pressItems.forEach((item, index) => {
        item.addEventListener('focusin', () => {
            isPaused = true;
            activateItem(index);
        });
        item.addEventListener('focusout', () => {
            isPaused = false;
        });
    });

    tickerId = window.setInterval(cycleItems, TICKER_DELAY);

    // Ensure first item is active
    activateItem(currentIndex);

    // Safety to clear ticker on page unload
    window.addEventListener('beforeunload', () => {
        if (tickerId) {
            window.clearInterval(tickerId);
        }
    });
}

