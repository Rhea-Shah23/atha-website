// Animation state management
let hasAnimated = false;
let scrollLocked = true;
let animationTimeout = null;

// Get elements
const messagesContainer = document.getElementById('messagesContainer');
const messageBubbles = document.querySelectorAll('.message-bubble');
const phoneScreen = document.getElementById('phoneScreen');
const screenBlank = document.getElementById('screenBlank');
const dashboard = document.getElementById('dashboard');
const notification = document.getElementById('notification');
const ctaButton = document.getElementById('ctaButton');
const hero = document.getElementById('hero');

// Scroll event handler
let scrollY = 0;
let ticking = false;

function handleScroll() {
    scrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (!hasAnimated && scrollY > 50) {
                triggerAnimation();
            }
            ticking = false;
        });
        ticking = true;
    }
}

// Trigger the main animation sequence
function triggerAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;

    console.log('Animation triggered!');

    // Lock scroll during animation
    lockScroll();

    // Phase 1: Stop swirling, move bubbles into phone (0-1.5s)
    setTimeout(() => {
        animateMessagesIntoPhone();
    }, 100);

    // Phase 2: Show dashboard (1.5s-2.5s)
    setTimeout(() => {
        screenBlank.style.opacity = '0';
        dashboard.classList.add('visible');
    }, 1500);

    // Phase 3: Show notification (2.5s-3.0s)
    setTimeout(() => {
        notification.classList.add('visible');
    }, 250);

    // Phase 4: Show CTA button (3.0s-3.5s)
    setTimeout(() => {
        ctaButton.classList.add('visible');
    }, 0);

    // Phase 5: Unlock scroll (3.5s+)
    setTimeout(() => {
        unlockScroll();
        console.log('Scroll unlocked - user can continue to features');
    }, 3000);
}

// Animate message bubbles into phone
function animateMessagesIntoPhone() {
    const phone = document.getElementById('phone');
    const phoneRect = phone.getBoundingClientRect();
    const phoneCenterX = phoneRect.left + phoneRect.width / 2;
    const phoneCenterY = phoneRect.top + phoneRect.height / 2;

    messageBubbles.forEach((bubble, index) => {
        // Add animating class to disable swirl animation
        bubble.classList.add('animating');

        const bubbleRect = bubble.getBoundingClientRect();
        const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
        const bubbleCenterY = bubbleRect.top + bubbleRect.height / 2;

        const deltaX = phoneCenterX - bubbleCenterX;
        const deltaY = phoneCenterY - bubbleCenterY;

        // Stagger the animation
        setTimeout(() => {
            bubble.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
            bubble.style.opacity = '0';
        }, index * 80); // Stagger by 80ms per bubble

        // Mark as entered after animation
        setTimeout(() => {
            bubble.classList.add('entered');
        }, index * 80 + 1500);
    });
}

// Lock scroll during animation
function lockScroll() {
    scrollLocked = true;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
}

// Unlock scroll after animation
function unlockScroll() {
    scrollLocked = false;
    document.body.style.overflow = '';
    document.body.style.height = '';
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Waitlist form submission (with null check)
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would normally send to your backend
        console.log('Waitlist signup:', email);
        
        // Show success message
        alert('Thanks for joining the waitlist! We\'ll be in touch soon.');
        e.target.reset();
    });
}


// Add scroll event listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Intersection Observer for feature cards animation
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Prevent scroll jump on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    messageBubbles.forEach(bubble => {
        bubble.style.animation = 'none';
    });
}

console.log('Atha landing page loaded successfully! 🚀');
console.log('Scroll down to trigger the animation...');