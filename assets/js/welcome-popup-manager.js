// Welcome Popup Manager - Enhanced Cross-Page State Management v1.10
// This file manages the welcome popup across all pages with shared state

class WelcomePopupManager {
  constructor() {
    this.version = "1.10";
    this.storageKey = `welcomePopup_v${this.version}_completed`;
    this.pageKey = `welcomePopup_v${this.version}_lastPage`;
    this.popupDelay = 1000; // Changed from 2000 to 1000 (1 second)
    this.isEnabled = true; // Set to false to disable popup globally

    // Popup state management
    this.currentSlide = 1;
    this.totalSlides = 6;
    this.isAnimating = false;
    this.popupElement = null;

    // Bind keyboard handler for proper removal
    this.handleKeyboard = this.handleKeyboard.bind(this);

    this.init();
  }

  init() {
    // Check if popup should be shown
    if (!this.isEnabled || this.isCompleted()) {
      return;
    }

    // Create popup after delay
    setTimeout(() => {
      this.createAndShowPopup();
    }, this.popupDelay);
  }

  isCompleted() {
    return localStorage.getItem(this.storageKey) === "true";
  }

  markAsCompleted() {
    localStorage.setItem(this.storageKey, "true");
    localStorage.setItem(this.pageKey, window.location.pathname);
  }

  createAndShowPopup() {
    if (this.isCompleted()) return;

    // Create popup HTML
    this.createPopupHTML();
    this.bindEvents();
    this.showPopup();
  }

  createPopupHTML() {
    // Create popup overlay
    const overlay = document.createElement("div");
    overlay.id = "welcomePopup";
    overlay.className = "welcome-popup-overlay";
    overlay.setAttribute("tabindex", "-1");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("role", "dialog");

    overlay.innerHTML = `
     <div class="welcome-popup-container">
                <!-- Header section matching main website h2 style -->
        <div class="popup-progress">
          <span class="popup-progress-text" id="progressText">1 من 6</span>
          <div class="popup-progress-bar">
            <div class="popup-progress-fill" id="progressFill"></div>
          </div>
        </div>
       
        <!-- Close Button -->
        <button class="popup-close-btn" id="closeBtn" aria-label="إغلاق">
          <svg width="22" height="22" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
       
                <!-- Slides -->
        <div class="popup-slides" id="popupSlides">
          <!-- Slide 1: Welcome -->
          <div class="popup-slide active" id="slide1">
            <div class="slide-welcome-header">
              <h1>مرحباً بك في <span class="gradient-text">الإصدار الجديد !</span></h1>
              <p>يسعدنا رؤيتك مرة أخرى في النسخة المحدثة 😊</p>
            </div>
            <div class="slide-icon version">
              <span class="version-badge">1.10</span>
            </div>
            <h2 class="slide-title">أهم التحديثات <span class="version-small">(الإصدار 1.10)</span></h2>
            <div class="slide-content">
              <p>يسعدنا أن نقدم لكم أحدث إصدار من موقعنا الذي يأتي بتجربة أكثر تطوراً، سرعة، وميزات جديدة كلياً!</p>
              <ul class="slide-list">
                <li>تحسينات عميقة في الأداء والواجهة</li>
                <li>ميزات حديثة لتسهيل استخدامك اليومي</li>
                <li>تجربة أكثر سلاسة على جميع الأجهزة</li>
              </ul>
            </div>
          </div>
         
          <!-- Slide 2: New Features (Part 1) -->
          <div class="popup-slide" id="slide2">
            <div class="slide-icon features"><span>✨</span></div>
            <h2 class="slide-title">أهم الميزات الجديدة</h2>
            <div class="slide-content">
              <ul class="slide-list">
                <li>تم تحسين تصميم صفحة تسجيل الدخول وتم استبدال اسم المستخدم بالبريد الإلكتروني لسهولة الاستخدام.</li>
                <li>تم إضافة خيار إظهار/إخفاء كلمة المرور لزيادة الأمان والراحة.</li>
                <li>تم توفير خيار استعادة كلمة المرور في حال نسيانها.</li>
                <li>أصبح الموقع أكثر ذكاءً وفعالية، مما يضمن أداءً أسرع وأفضل.</li>

<li>التحديث الأهم، يمكنك الآن الاطلاع على جميع مبيعاتك ونفقاتك مباشرةً في صورة رصيد. سيُضاف الرصيد تلقائيًا، وسيبقى في النموذج، وسيتم تحديثه فورًا. لا مزيد من عناء الحساب مرارًا وتكرارًا. نأمل أن ينال إعجابك.</li>

              </ul>
            </div>
          </div>
         
          <!-- Slide 3: New Features (Part 2) -->
          <div class="popup-slide" id="slide3">
            <div class="slide-icon features"><span>🚀</span></div>
            <h2 class="slide-title">تحسينات وتجربة مستخدم أفضل</h2>
            <div class="slide-content">
              <ul class="slide-list">
                <li>تم تغيير مظهر الأزرار وإضافة تأثيرات بصرية جذابة.</li>
<li>أصبح الموقع سهل الاستخدام ومتوافقًا تمامًا مع الأجهزة المحمولة لتجربة سلسة.</li>
<li>سيتم إرسال جميع إدخالات البيانات الخاصة بك مباشرةً إلى قناة تيليجرام، وسنتحدث عن هذا بالتفصيل في الخطوة الأخيرة.</li>
              </ul>
            </div>
          </div>
         
          <!-- Slide 4: Telegram Integration -->
          <div class="popup-slide" id="slide4">
            <div class="slide-icon telegram">
              <svg width="48" height="48" viewBox="0 0 240 240" style="margin-bottom:10px;"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
              <span>📲</span>
            </div>
            <h2 class="slide-title">
              <span class="tg-inline-icon">
                <svg width="22" height="22" viewBox="0 0 240 240" style="vertical-align:-5px;"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
              </span>
              تكامل تيليجرام
            </h2>
            <div class="slide-content">
              <p>
لضمان متابعة مستمرة لبيانات عملك ومعلومات حسابك، نوفر لك خدمة إرسال جميع إدخالات البيانات التي تقوم بها في النموذج تلقائيًا كرسائل فورية إلى قناتك على تيليجرام. هذا يعني أنك ستتلقى تحديثات مباشرة حول حالتك، وتواريخ الإدخالات، ومقدار العمل المنجز بسهولة ويسر. سيساعدك هذا على تتبع تقدمك بكفاءة عالية.
</p>
            </div>
          </div>
         
          <!-- Slide 5: Join Telegram Channel -->
          <div class="popup-slide" id="slide5">
            <div class="slide-icon telegram">
              <svg width="48" height="48" viewBox="0 0 240 240" style="margin-bottom:10px;"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
              <span>🔗</span>
            </div>
            <h2 class="slide-title">
              <span class="tg-inline-icon">
                <svg width="22" height="22" viewBox="0 0 240 240" style="vertical-align:-5px;"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
              </span>
              انضم إلى قناة تيليجرام الآن
            </h2>
            <div class="slide-content">
              <div class="telegram-steps">
                <div class="telegram-step">
                  <span class="step-icon">
                    <svg width="19" height="19" viewBox="0 0 240 240"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
                  </span>
                    <span>قم بتنزيل تطبيق تيليجرام من متجر التطبيقات:</span>
                </div>
                <div class="download-links">
                  <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" class="download-link play-store" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#34a853"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                    <span>Play Store</span>
                  </a>
                  <a href="https://apps.apple.com/app/telegram-messenger/id686449807" class="download-link app-store" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#007aff"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/></svg>
                    <span>App Store</span>
                  </a>
                </div>
                <div class="search-terms">
                  <h4>أو ابحث في المتجر عن:</h4>
                  <div class="search-term-item">
                    <span class="search-term-text">Telegram</span>
                    <span class="search-term-lang">English</span>
                    <button class="copy-btn" onclick="copyToClipboard('Telegram', this)" title="نسخ">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="search-term-item">
                    <span class="search-term-text">تيليجرام</span>
                    <span class="search-term-lang">العربية</span>
                    <button class="copy-btn" onclick="copyToClipboard('تيليجرام', this)" title="نسخ">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                                <div class="telegram-step">
                  <span class="step-icon">
                    <svg width="19" height="19" viewBox="0 0 240 240"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
                  </span>
                 <span>افتح تطبيق تيليجرام بعد تثبيته وقم بإنشاء حساب أو تسجيل الدخول.</span>
                </div>
                <div class="telegram-step">
                  <span class="step-icon">
                    <svg width="19" height="19" viewBox="0 0 240 240"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
                  </span>
                                    <span>ابحث يدوياً عن
                    <span class="copyable-text">
                      Hassan_work_Update
                      <button class="copy-btn" onclick="copyToClipboard('Hassan_work_Update', this)" title="نسخ اسم القناة">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </span>
                     في شريط البحث بتيليجرام.
                  </span>
                </div>
                <div class="telegram-step">
                  <span class="step-icon">
                    <svg width="19" height="19" viewBox="0 0 240 240"><circle cx="120" cy="120" r="120" fill="#0088cc"/><polygon points="50,120 190,60 170,180 120,140 90,170 90,140" fill="#fff"/></svg>
                  </span>
                  <span>أو انقر مباشرة للانضمام: </span>
                  <a href="https://t.me/Hassan_work_Update" class="telegram-link" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0088cc"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                    <span>انضم إلى القناة</span>
                  </a>
                </div>
              </div>
              <div class="telegram-benefits">
                                <h3>بعد الانضمام:</h3>
                <ul>
                                    <li>ستتلقى جميع تحديثات عملك وإدخالات البيانات مباشرة كرسائل في القناة.</li>
                                    <li>تواصل أسرع وأسهل مع فريق الدعم.</li>
                                    <li>إشعارات فورية لكل نشاط جديد.</li>
                </ul>
              </div>
            </div>
          </div>
         
          <!-- Slide 6: Password Confirmation -->
          <div class="popup-slide" id="slide6">
            <div class="slide-icon lock"><span>🔒</span></div>
            <h2 class="slide-title">التأكيد النهائي</h2>
            <div class="slide-content slide-content-password">
              <label for="confirmPassword" class="password-label">أدخل كلمة المرور <b>'Hassan'</b> لعدم عرض هذه الرسالة مرة أخرى:</label>
              <div class="password-input-container">
                <input type="text" id="confirmPassword" class="password-input" placeholder="أدخل كلمة المرور هنا" maxlength="10" autocomplete="off" />
              </div>
                            <div class="password-hint">
                <span>💡</span> كلمة المرور هي:
                <span class="copyable-text">
                  Hassan
                  <button class="copy-btn" onclick="copyToClipboard('Hassan', this)" title="نسخ كلمة المرور">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </span>
              </div>
                            <button id="confirmBtn" class="confirm-btn" disabled><span>تأكيد</span></button>
              <p class="confirm-note">بعد التأكيد لن تظهر هذه الرسالة مرة أخرى.</p>
            </div>
          </div>
        </div>
       
        <!-- Navigation -->
                <div class="popup-navigation">
          <button id="prevBtn" class="nav-btn prev-btn" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            <span>السابق</span>
          </button>
          <div class="slide-dots" id="slideDots">
            <span class="dot active" data-slide="1"></span>
            <span class="dot" data-slide="2"></span>
            <span class="dot" data-slide="3"></span>
            <span class="dot" data-slide="4"></span>
            <span class="dot" data-slide="5"></span>
            <span class="dot" data-slide="6"></span>
          </div>
                    <button id="nextBtn" class="nav-btn next-btn">
            <span>التالي</span>
            <svg width="16" height="16" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(overlay);
    this.popupElement = overlay;

    // Load CSS if not already loaded
    this.loadPopupCSS();
  }

  loadPopupCSS() {
    // Check if CSS is already loaded (either by ID or by href)
    if (document.getElementById("welcomePopupCSS")) return;

    const existingLink = document.querySelector(
      'link[href*="welcome-popup.css"]'
    );
    if (existingLink) return;

    const link = document.createElement("link");
    link.id = "welcomePopupCSS";
    link.rel = "stylesheet";
    link.href = "/assets/css/welcome-popup.css";
    document.head.appendChild(link);
  }

  bindEvents() {
    if (!this.popupElement) return;

    const prevBtn = this.popupElement.querySelector("#prevBtn");
    const nextBtn = this.popupElement.querySelector("#nextBtn");
    const closeBtn = this.popupElement.querySelector("#closeBtn");
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");
    const confirmPassword = this.popupElement.querySelector("#confirmPassword");
    const slideDots = this.popupElement.querySelectorAll(".dot");

    // Navigation events
    prevBtn?.addEventListener("click", () => this.previousSlide());
    nextBtn?.addEventListener("click", () => this.nextSlide());
    closeBtn?.addEventListener("click", () => this.handleCancel());

    // Password validation
    confirmPassword?.addEventListener("input", () => this.validatePassword());
    confirmBtn?.addEventListener("click", () => this.confirmAndClose());

    // Dot navigation
    slideDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => this.goToSlide(idx + 1));
    });

    // Keyboard events
    document.addEventListener("keydown", this.handleKeyboard);

    // Click outside to close (cancel)
    this.popupElement.addEventListener("click", (e) => {
      if (e.target === this.popupElement) this.handleCancel();
    });

    // Prevent container click from closing
    this.popupElement
      .querySelector(".welcome-popup-container")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
      });
  }

  showPopup() {
    if (!this.popupElement) return;

    this.popupElement.classList.add("active");
    document.body.style.overflow = "hidden";
    this.goToSlide(1);
    this.popupElement.focus();
  }

  hidePopup() {
    if (!this.popupElement) return;

    this.popupElement.classList.remove("active");

    // Wait for animation to complete before removing
    setTimeout(() => {
      this.cleanupPopup();
    }, 400);
  }

  cleanupPopup() {
    // Restore body overflow
    document.body.style.overflow = "";

    // Remove event listeners
    document.removeEventListener("keydown", this.handleKeyboard);

    // Remove popup element from DOM
    if (this.popupElement && this.popupElement.parentNode) {
      this.popupElement.parentNode.removeChild(this.popupElement);
    }

    // Clear reference
    this.popupElement = null;

    // Ensure body is clickable
    document.body.style.pointerEvents = "";
    document.body.style.userSelect = "";

    // Force reflow to ensure all styles are applied
    document.body.offsetHeight;
  }

  handleCancel() {
    if (this.isCompleted()) return;

    this.hidePopup();

    // Only show again if not completed and user didn't explicitly close
    setTimeout(() => {
      if (!this.isCompleted() && this.popupElement === null) {
        this.createAndShowPopup();
      }
    }, this.popupDelay);
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(n) {
    if (
      n < 1 ||
      n > this.totalSlides ||
      this.isAnimating ||
      n === this.currentSlide
    ) {
      return false;
    }

    this.isAnimating = true;

    // Hide current slide
    const currentSlideEl = this.popupElement.querySelector(
      `#slide${this.currentSlide}`
    );
    const currentDot = this.popupElement.querySelector(
      `.dot:nth-child(${this.currentSlide})`
    );

    currentSlideEl?.classList.remove("active");
    currentDot?.classList.remove("active");

    this.currentSlide = n;

    // Show new slide
    setTimeout(() => {
      const newSlideEl = this.popupElement.querySelector(
        `#slide${this.currentSlide}`
      );
      const newDot = this.popupElement.querySelector(
        `.dot:nth-child(${this.currentSlide})`
      );

      newSlideEl?.classList.add("active");
      newDot?.classList.add("active");

      this.updateNavigation();
      this.updateProgress();

      // Focus password input on last slide
      if (this.currentSlide === this.totalSlides) {
        setTimeout(() => {
          const passwordInput =
            this.popupElement.querySelector("#confirmPassword");
          passwordInput?.focus();
        }, 200);
      }

      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }, 50);

    return true;
  }

  updateNavigation() {
    const prevBtn = this.popupElement.querySelector("#prevBtn");
    const nextBtn = this.popupElement.querySelector("#nextBtn");
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");

    if (prevBtn) prevBtn.disabled = this.currentSlide === 1;
    if (nextBtn) {
      nextBtn.style.display =
        this.currentSlide === this.totalSlides ? "none" : "inline-flex";
      nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    if (confirmBtn) {
      confirmBtn.style.display =
        this.currentSlide === this.totalSlides ? "inline-block" : "none";
    }
  }

  updateProgress() {
    const progressFill = this.popupElement.querySelector("#progressFill");
    const progressText = this.popupElement.querySelector("#progressText");

    if (progressFill) {
      const progress = (this.currentSlide / this.totalSlides) * 100;
      progressFill.style.width = `${progress}%`;
    }

    if (progressText) {
      progressText.textContent = `${this.currentSlide} من ${this.totalSlides}`;
    }
  }

  validatePassword() {
    const confirmPassword = this.popupElement.querySelector("#confirmPassword");
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");

    if (!confirmPassword || !confirmBtn) return;

    const val = confirmPassword.value.trim();
    const isValid = val === "Hassan";

    confirmBtn.disabled = !isValid;

    // Visual feedback
    confirmPassword.style.borderColor = isValid ? "#28a745" : "#e2e8f0";
    confirmPassword.style.backgroundColor =
      isValid && val.length > 0 ? "rgba(40,167,69,0.07)" : "";

    if (val.length > 0 && !isValid) {
      confirmPassword.style.borderColor = "#e53e3e";
      confirmPassword.style.backgroundColor = "rgba(229,62,62,0.07)";
      confirmPassword.style.animation = "shake 0.5s";
      setTimeout(() => {
        confirmPassword.style.animation = "";
      }, 500);
    }
  }

  confirmAndClose() {
    const confirmPassword = this.popupElement.querySelector("#confirmPassword");
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");

    if (!confirmPassword || !confirmBtn) return;

    const val = confirmPassword.value.trim();
    if (val === "Hassan") {
      this.markAsCompleted();
      this.showSuccess();
      setTimeout(() => {
        this.hidePopup();
      }, 1100);
    } else {
      this.showError();
    }
  }

  showSuccess() {
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");
    if (!confirmBtn) return;

    confirmBtn.innerHTML = "<span>✓ تم التأكيد بنجاح</span>";
    confirmBtn.style.background =
      "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
    confirmBtn.style.transform = "translateY(-2px)";
    confirmBtn.style.boxShadow = "0 12px 40px rgba(40, 167, 69, 0.35)";

    setTimeout(() => {
      confirmBtn.innerHTML = "<span>تأكيد</span>";
      confirmBtn.style.background = "";
      confirmBtn.style.transform = "";
      confirmBtn.style.boxShadow = "";
    }, 900);
  }

  showError() {
    const confirmPassword = this.popupElement.querySelector("#confirmPassword");
    const confirmBtn = this.popupElement.querySelector("#confirmBtn");

    if (confirmPassword) {
      confirmPassword.style.animation = "shake 0.5s";
      setTimeout(() => {
        confirmPassword.style.animation = "";
      }, 500);
    }

    if (confirmBtn) {
      confirmBtn.style.animation = "shake 0.5s";
      setTimeout(() => {
        confirmBtn.style.animation = "";
      }, 500);
    }
  }

  handleKeyboard(e) {
    if (!this.popupElement?.classList.contains("active")) return;

    const confirmPassword = this.popupElement.querySelector("#confirmPassword");

    switch (e.key) {
      case "Escape":
        this.handleCancel();
        break;
      case "ArrowRight":
        if (document.activeElement !== confirmPassword) this.nextSlide();
        break;
      case "ArrowLeft":
        if (document.activeElement !== confirmPassword) this.previousSlide();
        break;
      case "Enter":
        if (
          this.currentSlide === this.totalSlides &&
          !this.popupElement.querySelector("#confirmBtn").disabled
        ) {
          this.confirmAndClose();
        } else if (this.currentSlide < this.totalSlides) {
          this.nextSlide();
        }
        break;
    }
  }

  // Static methods for easy control
  static disable() {
    window.welcomePopupManager = null;
  }

  static enable() {
    if (!window.welcomePopupManager) {
      window.welcomePopupManager = new WelcomePopupManager();
    }
  }

  static isCompleted() {
    return localStorage.getItem("welcomePopup_v1.10_completed") === "true";
  }

  static reset() {
    localStorage.removeItem("welcomePopup_v1.10_completed");
    localStorage.removeItem("welcomePopup_v1.10_lastPage");

    // Remove existing popup if present
    const existingPopup = document.getElementById("welcomePopup");
    if (existingPopup) {
      existingPopup.remove();
    }

    // Complete cleanup
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
    document.body.style.userSelect = "";

    // Clear global instance
    if (window.welcomePopupManager) {
      window.welcomePopupManager = null;
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if not already completed and no instance exists
  if (!WelcomePopupManager.isCompleted() && !window.welcomePopupManager) {
    window.welcomePopupManager = new WelcomePopupManager();
  }
});

// Copy to clipboard function for enhanced UX
function copyToClipboard(text, button) {
  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showCopySuccess(button, text);
      })
      .catch(() => {
        // Fallback to legacy method
        fallbackCopyToClipboard(text, button);
      });
  } else {
    // Use fallback method
    fallbackCopyToClipboard(text, button);
  }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showCopySuccess(button, text);
    } else {
      showCopyError(button);
    }
  } catch (err) {
    showCopyError(button);
  } finally {
    document.body.removeChild(textArea);
  }
}

// Show copy success feedback
function showCopySuccess(button, text) {
  const originalContent = button.innerHTML;
  const originalColor = button.style.color;

  // Update button appearance
  button.classList.add("copied");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  `;

  // Create and show notification
  showCopyNotification(`تم نسخ: ${text}`);

  // Reset button after 2 seconds
  setTimeout(() => {
    button.classList.remove("copied");
    button.innerHTML = originalContent;
    button.style.color = originalColor;
  }, 2000);
}

// Show copy error feedback
function showCopyError(button) {
  const originalContent = button.innerHTML;

  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  showCopyNotification("فشل في النسخ، حاول مرة أخرى", "error");

  setTimeout(() => {
    button.innerHTML = originalContent;
  }, 2000);
}

// Show copy notification
function showCopyNotification(message, type = "success") {
  // Remove existing notification
  const existingNotification = document.querySelector(".copy-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `copy-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === "success" ? "✓" : "✗"}</span>
      <span class="notification-text">${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success"
        ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
        : "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
    };
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: 'Rubik', sans-serif;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideInNotification 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    direction: rtl;
  `;

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInNotification {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-icon {
      font-weight: bold;
      font-size: 16px;
    }
  `;

  if (!document.querySelector("style[data-copy-notification]")) {
    style.setAttribute("data-copy-notification", "true");
    document.head.appendChild(style);
  }

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation =
        "slideInNotification 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Export for global access
window.WelcomePopupManager = WelcomePopupManager;
window.copyToClipboard = copyToClipboard;
