// Premium Animation System - Apple-level UX
class PremiumAnimations {
  constructor() {
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.setupPageTransitions();
    this.setupMicroInteractions();
    this.setupScrollAnimations();
  }

  // Apple-style page transitions
  setupPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Intercept navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && !link.target && !link.href.includes('#') && !link.href.includes('javascript:')) {
        e.preventDefault();
        this.transitionToPage(link.href);
      }
    });
  }

  async transitionToPage(url) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const overlay = document.querySelector('.page-transition-overlay');
    
    // Show transition
    overlay.classList.add('active');
    
    // Wait for animation
    await this.wait(300);
    
    // Navigate
    window.location.href = url;
  }

  // Micro-interactions for buttons and elements
  setupMicroInteractions() {
    // Button ripple effect
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .submit, button[type="submit"]');
      if (btn && !btn.disabled) {
        this.createRipple(btn, e);
      }
    });

    // Input field animations
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.animateInputFocus(e.target);
      }
    }, true);

    document.addEventListener('blur', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.animateInputBlur(e.target);
      }
    }, true);
  }

  createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  animateInputFocus(input) {
    const field = input.closest('.input-field');
    if (field) {
      field.style.transform = 'scale(1.02)';
      field.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  }

  animateInputBlur(input) {
    const field = input.closest('.input-field');
    if (field) {
      field.style.transform = 'scale(1)';
    }
  }

  // Scroll-based animations
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        }
      });
    }, { threshold: 0.1 });

    // Observe elements for scroll animations
    document.querySelectorAll('.input-field, .btn, .data-table tr').forEach(el => {
      observer.observe(el);
    });
  }

  // Utility function
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  // Stagger animation for multiple elements
  staggerAnimation(elements, delay = 100) {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
      }, index * delay);
    });
  }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  window.premiumAnimations = new PremiumAnimations();
});

// Add required CSS animations
const animationCSS = `
@keyframes rippleEffect {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject CSS
if (!document.getElementById('premium-animations-css')) {
  const style = document.createElement('style');
  style.id = 'premium-animations-css';
  style.textContent = animationCSS;
  document.head.appendChild(style);
}