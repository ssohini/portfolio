document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CUSTOM CURSOR TRACKING (With Inertia)
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Inertia speed factor (0 to 1)
    const speed = 0.15;
    
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements on first move
        if (!isMoving) {
            document.body.classList.add('cursor-active');
            isMoving = true;
        }

        // Direct position update for the inner dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Animate outer ring with inertia
    function animateCursor() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        
        cursorX += distX * speed;
        cursorY += distY * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
        isMoving = false;
    });


    // ==========================================
    // 2. STICKY HEADER & SCROLL EFFECTS
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 3. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.fade-in-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after showing to keep performance high
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters fully
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================
    // 4. ACTIVE LINK TRACKING (Scrollspy)
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35, // Trigger when 35% of the section is visible
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });


    // ==========================================
    // 5. MOBILE MENU DRAWER
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const header = document.querySelector('.navbar');

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        header.classList.toggle('menu-open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (header.classList.contains('menu-open') && !header.contains(e.target)) {
            header.classList.remove('menu-open');
        }
    });


    // ==========================================
    // 6. PROJECTS CATEGORY FILTER
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade out animation first, then update display
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });


    // ==========================================
    // 7. FORM SUBMISSION VALIDATION & FEEDBACK
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation checks
        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const subjectVal = document.getElementById('subject').value.trim();
        const messageVal = document.getElementById('message').value.trim();

        if (!nameVal || !emailVal || !subjectVal || !messageVal) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        // Visual "Sending" state
        showStatus('Sending message...', 'info');
        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.disabled = true;

        // Simulate form submission delay
        setTimeout(() => {
            showStatus('Thank you! Your message was sent successfully. Sohini Das will contact you soon.', 'success');
            contactForm.reset();
            submitBtn.disabled = false;
        }, 1500);
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status'; // Reset classes
        
        if (type === 'success') {
            formStatus.classList.add('success');
            formStatus.style.color = '#4caf50';
        } else if (type === 'error') {
            formStatus.classList.add('error');
            formStatus.style.color = '#f44336';
        } else {
            formStatus.style.color = 'var(--text-light)';
        }
    }
});
