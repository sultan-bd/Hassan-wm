// Header Menu System - Three Dots Menu
class HeaderMenu {
  constructor() {
    this.isOpen = false;
    this.menuElement = null;
    this.backdropElement = null;
    this.init();
  }

  init() {
    this.replaceLogoutButton();
    this.bindEvents();
  }

  replaceLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (!logoutBtn) return;

    // Create menu trigger
    const menuTrigger = document.createElement('button');
    menuTrigger.className = 'menu-trigger';
    menuTrigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="19" r="1"/>
      </svg>
    `;

    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.innerHTML = `
      <a href="#" class="menu-item" data-action="transactions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>لেনদেন</span>
      </a>
      <a href="#" class="menu-item" data-action="expenses">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span>খরচ</span>
      </a>
      <a href="#" class="menu-item" data-action="updates">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <span>নিউ আপডেট</span>
      </a>
      <a href="#" class="menu-item" data-action="subscription">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>সাবস্ক্রিপশন</span>
      </a>
      <a href="#" class="menu-item logout" data-action="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>লগ আউট</span>
      </a>
    `;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';

    // Create container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'header-menu';
    menuContainer.appendChild(menuTrigger);
    menuContainer.appendChild(dropdownMenu);

    // Replace logout button
    logoutBtn.parentNode.replaceChild(menuContainer, logoutBtn);
    document.body.appendChild(backdrop);

    this.menuElement = dropdownMenu;
    this.backdropElement = backdrop;
    this.triggerElement = menuTrigger;
  }

  bindEvents() {
    // Menu trigger click
    document.addEventListener('click', (e) => {
      if (e.target.closest('.menu-trigger')) {
        e.stopPropagation();
        this.toggleMenu();
      } else if (e.target.closest('.menu-item')) {
        const action = e.target.closest('.menu-item').dataset.action;
        this.handleMenuAction(action);
      } else if (!e.target.closest('.dropdown-menu')) {
        this.closeMenu();
      }
    });

    // Backdrop click
    this.backdropElement?.addEventListener('click', () => {
      this.closeMenu();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.menuElement?.classList.add('active');
    this.backdropElement?.classList.add('active');
    this.triggerElement?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.menuElement?.classList.remove('active');
    this.backdropElement?.classList.remove('active');
    this.triggerElement?.classList.remove('active');
    document.body.style.overflow = '';
  }

  async handleMenuAction(action) {
    this.closeMenu();

    switch (action) {
      case 'transactions':
        await this.smoothTransition('/crud-1.html');
        break;
      case 'expenses':
        await this.smoothTransition('/crud-2.html');
        break;
      case 'updates':
        this.showUpdatesModal();
        break;
      case 'subscription':
        this.showSubscriptionModal();
        break;
      case 'logout':
        this.handleLogout();
        break;
    }
  }

  async smoothTransition(url) {
    // Create transition effect
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    await this.wait(300);
    window.location.href = url;
  }

  showUpdatesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>آخر التحديثات</h3>
          <button class="btn ghost modal-close">✖</button>
        </div>
        <div class="updates-content">
          <div class="update-item">
            <div class="update-icon">🎉</div>
            <div class="update-text">
              <h4>الإصدار 1.10</h4>
              <p>تحسينات في الأداء والواجهة</p>
            </div>
          </div>
          <div class="update-item">
            <div class="update-icon">🚀</div>
            <div class="update-text">
              <h4>ميزات جديدة</h4>
              <p>إضافة نظام الرصيد التلقائي</p>
            </div>
          </div>
          <div class="update-item">
            <div class="update-icon">📱</div>
            <div class="update-text">
              <h4>تحسينات الموبايل</h4>
              <p>تجربة أفضل على الأجهزة المحمولة</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn modal-close">حسناً</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.bindModalEvents(modal);
  }

  showSubscriptionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>الاشتراك المميز</h3>
          <button class="btn ghost modal-close">✖</button>
        </div>
        <div class="subscription-content">
          <div class="coming-soon-illustration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ee9f0d" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <h4>قريباً جداً!</h4>
          <p>نعمل حالياً على تطوير خدمات الاشتراك المميز لتوفير المزيد من الميزات الحصرية.</p>
          <div class="features-preview">
            <div class="feature-item">✨ تقارير متقدمة</div>
            <div class="feature-item">📊 تحليلات مفصلة</div>
            <div class="feature-item">🔔 إشعارات فورية</div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn modal-close">حسناً</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.bindModalEvents(modal);
  }

  bindModalEvents(modal) {
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      });
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  handleLogout() {
    // Use existing logout functionality
    if (window.logout) {
      window.logout();
    } else {
      // Fallback logout
      document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login.html";
    }
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize header menu
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '/index.html' || currentPath.includes('hassan')) {
    new HeaderMenu();
  }
});

// Add required CSS for modals
const modalCSS = `
.updates-content {
  padding: 1rem 0;
}

.update-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  background: rgba(238, 159, 13, 0.05);
  border: 1px solid rgba(238, 159, 13, 0.1);
  transition: all 0.3s ease;
}

.update-item:hover {
  background: rgba(238, 159, 13, 0.1);
  transform: translateX(4px);
}

.update-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.update-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.update-text p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.subscription-content {
  text-align: center;
  padding: 1rem 0;
}

.coming-soon-illustration {
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.subscription-content h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.subscription-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.features-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-item {
  padding: 0.5rem 1rem;
  background: rgba(238, 159, 13, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
}
`;

// Inject CSS
if (!document.getElementById('header-menu-css')) {
  const style = document.createElement('style');
  style.id = 'header-menu-css';
  style.textContent = modalCSS;
  document.head.appendChild(style);
}