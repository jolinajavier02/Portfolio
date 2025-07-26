// Portfolio JavaScript - Interactive Features and Animations

// DOM Elements
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const loadingScreen = document.querySelector('.loading-screen');
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const contactFormBtn = document.getElementById('contactFormBtn');
const contactModal = document.getElementById('contactModal');
const modalCloses = document.querySelectorAll('.modal-close');
const contactForm = document.querySelector('.contact-form');
const projectCards = document.querySelectorAll('.project-card');
const resumeDownload = document.querySelector('.resume-download');
const resumeView = document.querySelector('.resume-view');

// State Management
let isLoading = true;
let currentTheme = localStorage.getItem('theme') || 'light';
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeLoading();
    initializeCursor();
    initializeNavigation();
    initializeModals();
    initializeScrollAnimations();
    initializeProjectCards();
    initializeContactForm();
    initializeResumeActions();
    initializeSocialLinks();
    initializeParallax();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add animation effect
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Loading Screen
function initializeLoading() {
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        isLoading = false;
        
        // Start hero animations after loading
        setTimeout(() => {
            startHeroAnimations();
        }, 500);
    }, 2500);
}

function startHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Custom Cursor
function initializeCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    document.addEventListener('mousemove', updateCursorPosition);
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .social-link');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
    
    // Animate cursor
    animateCursor();
}

function updateCursorPosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    cursorFollower.style.left = cursorX + 'px';
    cursorFollower.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Modal Management
function initializeModals() {
    // About modal
    aboutBtn.addEventListener('click', () => openModal(aboutModal));
    
    // Contact modal
    contactFormBtn.addEventListener('click', () => openModal(contactModal));
    
    // Close modals
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstFocusable = modal.querySelector('button, input, textarea');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-header, .project-card, .resume-content, .contact-content');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Parallax scroll indicator
    window.addEventListener('scroll', updateScrollIndicator);
}

function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${rate}px)`;
        
        // Hide scroll indicator after scrolling
        if (scrolled > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
}

// Project Cards
function initializeProjectCards() {
    projectCards.forEach((card, index) => {
        // Add stagger animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
        
        // Tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Handle project link clicks
        const liveBtn = card.querySelector('.live-demo-btn');
        const codeBtn = card.querySelector('.view-code-btn');
        
        if (liveBtn) {
            liveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('h3').textContent;
                showNotification(`Opening ${title} live demo...`);
                // Add your live demo URL logic here
            });
        }
        
        if (codeBtn) {
            codeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('h3').textContent;
                showNotification(`Opening ${title} source code...`);
                // Add your GitHub URL logic here
            });
        }
        
        // Card click handler
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            openProjectDetails(projectId);
        });
    });
}

function openProjectDetails(projectId) {
    // Create project detail modal dynamically
    const projectData = getProjectData(projectId);
    createProjectModal(projectData);
}

function getProjectData(projectId) {
    const projects = {
        '1': {
            title: 'E-Commerce Mobile App',
            description: 'A comprehensive mobile shopping application with intuitive user interface and seamless checkout experience. Features include product browsing, wishlist management, secure payment integration, and order tracking.',
            tools: ['Figma', 'React Native', 'UI/UX Design', 'Prototyping'],
            features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration', 'Order Management'],
            challenges: 'Creating a balance between feature-rich functionality and clean, intuitive design while ensuring optimal performance across different devices.',
            solution: 'Implemented a modular design system with reusable components and conducted extensive user testing to refine the user experience.'
        },
        '2': {
            title: 'Dashboard Analytics',
            description: 'A modern business intelligence dashboard providing real-time data visualization and reporting capabilities. Built with responsive design principles and interactive charts.',
            tools: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Responsive Design'],
            features: ['Real-time Data', 'Interactive Charts', 'Custom Reports', 'Export Functionality', 'Mobile Responsive'],
            challenges: 'Presenting complex data in an easily digestible format while maintaining fast loading times and cross-browser compatibility.',
            solution: 'Utilized efficient data visualization libraries and implemented progressive loading techniques for optimal performance.'
        },
        '3': {
            title: 'Brand Identity System',
            description: 'Complete brand redesign project including logo design, color palette, typography system, and comprehensive style guide for consistent brand application.',
            tools: ['Adobe XD', 'Illustrator', 'Photoshop', 'Brand Strategy'],
            features: ['Logo Design', 'Color System', 'Typography', 'Style Guide', 'Brand Applications'],
            challenges: 'Creating a cohesive brand identity that reflects the company values while standing out in a competitive market.',
            solution: 'Conducted thorough market research and stakeholder interviews to develop a unique brand positioning and visual identity.'
        }
    };
    
    return projects[projectId] || projects['1'];
}

function createProjectModal(project) {
    const modalHTML = `
        <div class="modal-overlay project-modal" id="projectModal">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="project-detail">
                    <h2>${project.title}</h2>
                    <p class="project-detail-description">${project.description}</p>
                    
                    <div class="project-section">
                        <h3>Tools & Technologies</h3>
                        <div class="project-tools">
                            ${project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-section">
                        <h3>Key Features</h3>
                        <ul class="feature-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-section">
                        <h3>Challenge</h3>
                        <p>${project.challenges}</p>
                    </div>
                    
                    <div class="project-section">
                        <h3>Solution</h3>
                        <p>${project.solution}</p>
                    </div>
                    
                    <div class="project-actions">
                        <button class="btn btn-primary">View Live Demo</button>
                        <button class="btn btn-secondary">View Code</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing project modal
    const existingModal = document.getElementById('projectModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize modal functionality
    const modal = document.getElementById('projectModal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Open modal
    setTimeout(() => openModal(modal), 100);
}

// Contact Form
function initializeContactForm() {
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Form field animations
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.form-submit');
    const formData = new FormData(contactForm);
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Close modal
        closeModal(contactModal);
    }, 2000);
}

// Resume Actions
function initializeResumeActions() {
    resumeDownload.addEventListener('click', () => {
        // Simulate PDF download
        showNotification('Resume download started!', 'info');
        
        // In a real implementation, you would trigger actual file download
        // window.open('path/to/resume.pdf', '_blank');
    });
    
    resumeView.addEventListener('click', () => {
        // Create resume preview modal
        createResumePreviewModal();
    });
}

function createResumePreviewModal() {
    const modalHTML = `
        <div class="modal-overlay resume-preview-modal" id="resumePreviewModal">
            <div class="modal-content" style="max-width: 800px;">
                <button class="modal-close">&times;</button>
                <div class="resume-preview-content">
                    <h2>Resume Preview</h2>
                    <div class="resume-preview-placeholder">
                        <i class="fas fa-file-pdf" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                        <h3>Jolina Javier</h3>
                        <p>UI/UX Designer & Front-End Developer</p>
                        <div class="resume-sections">
                            <div class="resume-section">
                                <h4>Experience</h4>
                                <p>• UI/UX Design Intern - Tech Company (2023)</p>
                                <p>• Front-End Development Projects</p>
                                <p>• Freelance Design Work</p>
                            </div>
                            <div class="resume-section">
                                <h4>Skills</h4>
                                <p>• Figma, Adobe XD, Sketch</p>
                                <p>• HTML, CSS, JavaScript</p>
                                <p>• React, Vue.js</p>
                                <p>• User Research & Testing</p>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="window.open('#', '_blank')">Download Full Resume</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('resumePreviewModal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    setTimeout(() => openModal(modal), 100);
}

// Social Links
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.dataset.platform;
            
            // Add click animation
            link.style.transform = 'scale(0.9)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
            
            // Show notification for demo purposes
            showNotification(`Opening ${platform} profile...`, 'info');
            
            // In a real implementation, you would open the actual social links
            // window.open(getSocialLink(platform), '_blank');
        });
    });
}

function getSocialLink(platform) {
    const links = {
        github: 'https://github.com/jolina-javier',
        linkedin: 'https://linkedin.com/in/jolina-javier',
        wantedly: 'https://wantedly.com/users/jolina-javier'
    };
    return links[platform] || '#';
}

// Parallax Effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }
    
    // Add click animations to floating cards
    parallaxElements.forEach(card => {
        card.addEventListener('click', () => {
            card.style.animation = 'none';
            card.style.transform = 'scale(1.2) rotate(360deg)';
            
            setTimeout(() => {
                card.style.animation = 'float 3s ease-in-out infinite';
                card.style.transform = '';
            }, 600);
        });
        
        // Add magnetic effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            card.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: 0 10px 30px var(--shadow-medium);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform var(--transition-medium);
        border-left: 4px solid var(--primary-color);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimizations
window.addEventListener('scroll', throttle(() => {
    handleNavbarScroll();
    updateScrollIndicator();
}, 16)); // ~60fps

// Accessibility Enhancements
document.addEventListener('keydown', (e) => {
    // Tab navigation for modals
    if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, input, textarea, select, a[href]'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // In production, you might want to send errors to a logging service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

function initializeApplication() {
    console.log('🎨 Jolina Javier Portfolio - Initialized Successfully!');
    
    // Add any additional initialization code here
    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('portfolio-initialized');
    }
}