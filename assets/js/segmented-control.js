// Segmented Control System - Apple-style Navigation
class SegmentedControl {
  constructor() {
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.createSegmentedControl();
    this.bindEvents();
  }

  createSegmentedControl() {
    // Find the text section to replace
    const textSection = document.querySelector('.text');
    if (!textSection) return;

    // Create segmented control
    const segmentedControl = document.createElement('div');
    segmentedControl.className = 'segmented-control';
    segmentedControl.innerHTML = `
      <div class="segment-option active" data-page="index">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>تقرير العمل</span>
      </div>
      <div class="segment-option" data-page="hassan">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span>مصروفات حسن</span>
      </div>
    `;

    // Replace text section
    textSection.parentNode.replaceChild(segmentedControl, textSection);

    // Set active state based on current page
    this.updateActiveState();
  }

  updateActiveState() {
    const currentPage = window.location.pathname;
    const segments = document.querySelectorAll('.segment-option');
    const control = document.querySelector('.segmented-control');
    
    segments.forEach(segment => {
      const page = segment.dataset.page;
      const isActive = (currentPage === '/' && page === 'index') || 
                      (currentPage.includes('hassan') && page === 'hassan');
      
      segment.classList.toggle('active', isActive);
    });

    // Update control state
    if (control) {
      const hasSecondActive = document.querySelector('.segment-option[data-page="hassan"].active');
      control.classList.toggle('second-active', !!hasSecondActive);
    }
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const segment = e.target.closest('.segment-option');
      if (segment && !this.isTransitioning) {
        this.handleSegmentClick(segment);
      }
    });
  }

  async handleSegmentClick(segment) {
    if (segment.classList.contains('active') || this.isTransitioning) return;

    this.isTransitioning = true;
    const targetPage = segment.dataset.page;
    const targetUrl = targetPage === 'index' ? '/' : '/hassan.html';

    // Update visual state immediately
    document.querySelectorAll('.segment-option').forEach(s => s.classList.remove('active'));
    segment.classList.add('active');

    const control = document.querySelector('.segmented-control');
    control.classList.toggle('second-active', targetPage === 'hassan');

    // Create smooth transition effect
    await this.smoothPageTransition(targetUrl);
  }

  async smoothPageTransition(url) {
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

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    // Wait for animation
    await this.wait(400);

    // Navigate
    window.location.href = url;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize on both pages
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on main pages
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '/index.html' || currentPath.includes('hassan')) {
    new SegmentedControl();
  }
});