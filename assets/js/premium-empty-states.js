// Premium Empty States with Illustrations
class PremiumEmptyStates {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceTableEmptyStates();
    this.enhanceSearchEmptyStates();
  }

  enhanceTableEmptyStates() {
    // Monitor table body for empty states
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const tableBody = mutation.target;
          if (tableBody.id === 'tableBody') {
            this.updateTableEmptyState(tableBody);
          }
        }
      });
    });

    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
      observer.observe(tableBody, { childList: true, subtree: true });
      this.updateTableEmptyState(tableBody);
    }
  }

  updateTableEmptyState(tableBody) {
    const emptyStateRow = tableBody.querySelector('.empty-state');
    if (emptyStateRow) {
      const isSearchEmpty = document.getElementById('searchInput')?.value.trim();
      
      if (isSearchEmpty) {
        this.renderSearchEmptyState(emptyStateRow.parentElement);
      } else {
        this.renderDataEmptyState(emptyStateRow.parentElement);
      }
    }
  }

  renderDataEmptyState(cell) {
    cell.innerHTML = `
      <div class="data-empty-illustration">
        <svg viewBox="0 0 200 200" class="empty-state-svg">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ee9f0d;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ff6a00;stop-opacity:0.6" />
            </linearGradient>
          </defs>
          <!-- Cute character sitting with laptop -->
          <circle cx="100" cy="80" r="25" fill="url(#emptyGrad)" opacity="0.3"/>
          <ellipse cx="100" cy="140" rx="40" ry="8" fill="#ddd" opacity="0.5"/>
          
          <!-- Character body -->
          <ellipse cx="100" cy="120" rx="20" ry="25" fill="#f4a261"/>
          
          <!-- Head -->
          <circle cx="100" cy="85" r="18" fill="#f4a261"/>
          
          <!-- Eyes -->
          <circle cx="94" cy="82" r="2" fill="#333"/>
          <circle cx="106" cy="82" r="2" fill="#333"/>
          
          <!-- Smile -->
          <path d="M 94 90 Q 100 95 106 90" stroke="#333" stroke-width="1.5" fill="none"/>
          
          <!-- Laptop -->
          <rect x="85" y="125" width="30" height="20" rx="2" fill="#2a9d8f"/>
          <rect x="87" y="127" width="26" height="12" fill="#264653"/>
          <rect x="89" y="129" width="22" height="8" fill="#e9c46a"/>
          
          <!-- Arms -->
          <ellipse cx="85" cy="110" rx="6" ry="12" fill="#f4a261"/>
          <ellipse cx="115" cy="110" rx="6" ry="12" fill="#f4a261"/>
          
          <!-- Floating elements -->
          <circle cx="60" cy="60" r="3" fill="#ee9f0d" opacity="0.6">
            <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="140" cy="70" r="2" fill="#ff6a00" opacity="0.7">
            <animate attributeName="cy" values="70;60;70" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="70" cy="40" r="2.5" fill="#f8a203" opacity="0.5">
            <animate attributeName="cy" values="40;30;40" dur="3.5s" repeatCount="indefinite"/>
          </circle>
        </svg>
        
        <h3 class="empty-state-title">لا توجد بيانات حتى الآن</h3>
        <p class="empty-state-description">
          ابدأ بإضافة البيانات الأولى لرؤية المعلومات هنا.
          <br>ستظهر جميع المعاملات والتفاصيل في هذا الجدول.
        </p>
      </div>
    `;
  }

  renderSearchEmptyState(cell) {
    const searchTerm = document.getElementById('searchInput')?.value.trim() || '';
    
    cell.innerHTML = `
      <div class="search-empty-illustration">
        <svg viewBox="0 0 200 200" class="empty-state-svg">
          <defs>
            <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6c757d;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#495057;stop-opacity:0.6" />
            </linearGradient>
          </defs>
          
          <!-- Character with magnifying glass -->
          <ellipse cx="100" cy="160" rx="35" ry="6" fill="#ddd" opacity="0.4"/>
          
          <!-- Body -->
          <ellipse cx="100" cy="130" rx="18" ry="22" fill="#6c757d"/>
          
          <!-- Head -->
          <circle cx="100" cy="95" r="16" fill="#6c757d"/>
          
          <!-- Eyes (confused) -->
          <circle cx="95" cy="92" r="1.5" fill="#333"/>
          <circle cx="105" cy="92" r="1.5" fill="#333"/>
          
          <!-- Confused expression -->
          <path d="M 95 100 Q 100 98 105 100" stroke="#333" stroke-width="1" fill="none"/>
          
          <!-- Large magnifying glass -->
          <circle cx="130" cy="80" r="15" fill="none" stroke="#ee9f0d" stroke-width="3"/>
          <line x1="142" y1="92" x2="155" y2="105" stroke="#ee9f0d" stroke-width="3"/>
          
          <!-- Question marks floating -->
          <text x="70" y="70" font-family="Arial" font-size="20" fill="#999" opacity="0.6">?</text>
          <text x="150" y="50" font-family="Arial" font-size="16" fill="#999" opacity="0.5">?</text>
          <text x="60" y="120" font-family="Arial" font-size="14" fill="#999" opacity="0.4">?</text>
          
          <!-- Animated search waves -->
          <circle cx="130" cy="80" r="20" fill="none" stroke="#ee9f0d" stroke-width="1" opacity="0.3">
            <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
        
        <h3 class="empty-state-title">لم يتم العثور على نتائج</h3>
        <p class="empty-state-description">
          لا توجد بيانات تطابق البحث "${searchTerm}"
          <br>جرب كلمات بحث مختلفة أو امسح البحث لرؤية جميع البيانات.
        </p>
      </div>
    `;
  }

  enhanceSearchEmptyStates() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.updateTableEmptyState(document.getElementById('tableBody'));
        }, 300);
      });
    }
  }
}

// Initialize empty states
document.addEventListener('DOMContentLoaded', () => {
  new PremiumEmptyStates();
});