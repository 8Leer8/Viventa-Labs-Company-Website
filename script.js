// ===== ENHANCED HERO SECTION FUNCTIONALITY =====

// Navbar Scroll Reveal Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset;
    
    // Navbar background effect
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Button Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.button-ripple');
    
    if (!ripple) return;
    
    // Reset ripple
    ripple.classList.remove('active');
    
    // Get button dimensions and click position
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Set ripple position
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Trigger ripple animation
    setTimeout(() => {
        ripple.classList.add('active');
    }, 10);
}

// Add ripple effect to all CTA buttons
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', createRipple);
        
        // Add navigation functionality
        if (button.textContent.includes('About')) {
            button.addEventListener('click', () => {
                document.getElementById('about')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            });
        } else if (button.textContent.includes('Projects')) {
            button.addEventListener('click', () => {
                document.getElementById('projects')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            });
        }
    });
});

// Light Parallax Effect for Background Blobs (Performance Optimized)
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const blobs = document.querySelectorAll('.blob');
    
    // Only apply parallax when hero section is visible
    if (scrolled < window.innerHeight * 1.5) {
        blobs.forEach((blob, index) => {
            const speed = 0.2 + (index * 0.05); // Subtle parallax speeds
            const yPos = -(scrolled * speed);
            blob.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercentage + '%';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Immediately update active state after clicking
            setTimeout(() => {
                updateActiveNavLink();
            }, 100);
        }
    });
});

// Enhanced header effects are now handled in the main navbar scroll function above

// Add active state to navigation links based on scroll position
function updateActiveNavLink() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const headerHeight = 80;
    let current = 'home';
    
    // Special case: if we're near the bottom of the page, activate contact
    if (scrollPos + windowHeight >= documentHeight - 100) {
        current = 'contact';
    } else {
        // Get navigation sections in order
        const navSections = ['home', 'about', 'projects', 'team', 'values', 'contact'];
        let bestMatch = 'home';
        let bestScore = -1;
        
        navSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - headerHeight - 50; // More generous top boundary
                const sectionBottom = sectionTop + section.offsetHeight + 100; // More generous bottom boundary
                
                // Calculate how much of the section is visible
                const viewportTop = scrollPos;
                const viewportBottom = scrollPos + windowHeight;
                
                // Check overlap between viewport and section
                const overlapTop = Math.max(viewportTop, sectionTop);
                const overlapBottom = Math.min(viewportBottom, sectionBottom);
                const overlapHeight = Math.max(0, overlapBottom - overlapTop);
                
                // Score based on how much of the section is visible
                const score = overlapHeight / windowHeight;
                
                if (score > bestScore && score > 0.1) { // Must have at least 10% overlap
                    bestScore = score;
                    // Map section IDs to nav links
                    switch(sectionId) {
                        case 'home':
                            bestMatch = 'home';
                            break;
                        case 'about':
                            bestMatch = 'about';
                            break;
                        case 'projects':
                            bestMatch = 'projects';
                            break;
                        case 'team':
                        case 'values': // Values section should activate Team nav
                            bestMatch = 'team';
                            break;
                        case 'contact':
                            bestMatch = 'contact';
                            break;
                    }
                }
            }
        });
        
        current = bestMatch;
    }
    
    // Special case: if we're at the very top, ensure home is active
    if (scrollPos < 50) {
        current = 'home';
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveNavLink);

// Set initial active state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set home as active by default
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
    
    // Update active state based on current scroll position
    updateActiveNavLink();
});

// Enhanced fade-in and slide-up effect for sections on scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate section title underline
            const title = entry.target.querySelector('.section-title');
            if (title) {
                setTimeout(() => {
                    title.classList.add('animate-line');
                }, 200);
            }
            
            // Stagger animation for cards
            const cards = entry.target.querySelectorAll('.about-card, .team-card, .project-column, .value-item');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Apply fade-in to all sections except home
document.querySelectorAll('.section:not(#home)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    sectionObserver.observe(section);
});

// Initialize cards with hidden state
document.querySelectorAll('.about-card, .team-card, .project-column, .value-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Parallax effect for section backgrounds
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.home-section, .about-section, .projects-section, .team-section, .values-section, .contact-section');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3;
        const yPos = -(scrolled * speed);
        element.style.backgroundPosition = `center ${yPos}px`;
    });
});

// Animate list items on scroll
const listObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('li');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 80);
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.goals-list, .features-list').forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    listObserver.observe(list);
});

// Add smooth reveal animation to dividers
const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scaleX(1)';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.divider').forEach(divider => {
    divider.style.opacity = '0';
    divider.style.transform = 'scaleX(0)';
    divider.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    dividerObserver.observe(divider);
});

// Enhanced scroll-based hero parallax effect
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.home-content');
    const scrolled = window.pageYOffset;
    const heroOffset = scrolled * 0.2; // Reduced for subtler effect
    
    if (heroContent && scrolled < window.innerHeight) {
        // Apply subtle parallax to hero content
        heroContent.style.transform = `translateY(${heroOffset}px)`;
        
        // Keep content fully visible (remove opacity fade)
        heroContent.style.opacity = Math.max(0.3, 1 - (scrolled / window.innerHeight) * 0.7);
    }
});

// Add subtle animation to contact items
document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    }, 100);
});
