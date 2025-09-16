class BalanceTracker {
  constructor() {
    this.scriptURL = "https://script.google.com/macros/s/AKfycbwAVi7o8MXYiZb8Yz0Imxy_51j3rm6QGlS2SnhbcBoGLkPV3CGF3bbimVBAA1y7H99U/exec"; // 👈 Replace this with your actual URL
    this.realBalanceValue = "";
    this.isVisible = false;
    this.isContainerHidden = false;
    this.container = null;
    this.autoRefreshInterval = null;
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.container = document.getElementById("balance-tracker");
    if (!this.container) return;

    this.generateHTML();
    this.cacheElements();
    this.bindEvents();
    this.loadInitialState();
    this.fetchBalance();

    // Auto polling every 15 seconds
    this.autoRefreshInterval = setInterval(() => this.fetchBalance(), 15000);
  }

  generateHTML() {
    this.container.innerHTML = `
      <!-- Balance Tracker Module -->
      <div class="balance-tracker-module" id="balance-tracker-container">
        <!-- Header with title and toggle -->
        <div class="balance-tracker-header">
          <div class="balance-tracker-title">المجموع الكلي - حسن</div>
          <button
            class="balance-tracker-toggle"
            id="balance-tracker-toggle"
            title="إغلاق الرصيد"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
    
        <!-- Main Balance Display -->
        <div class="balance-tracker-display">
          <!-- SAR Icon - Left Side -->
          <div class="balance-sar-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="32"
              height="32"
              viewBox="0 0 1024 1024"
              enable-background="new 0 0 1024 1024"
              xml:space="preserve"
            >
              <path
                fill="#ffffff"
                opacity="1.000000"
                stroke="none"
                d="M407.214478,747.282104 C395.177673,756.804626 381.216370,760.296082 366.890991,763.199341 C343.739105,767.891357 320.697235,773.123657 297.582855,778.004333 C266.654388,784.534973 235.690018,790.895569 204.762909,797.432556 C188.652451,800.837830 172.595108,804.493958 156.496094,807.954529 C154.470123,808.389954 152.423065,809.542297 149.821838,808.431152 C149.168732,801.584412 150.929794,794.936462 152.127823,788.341248 C156.036621,766.823181 162.445068,746.017639 170.708832,725.756958 C172.205978,722.086365 174.244537,720.315979 178.119232,719.492676 C230.671112,708.325500 283.189209,696.999573 335.720337,685.734497 C351.660309,682.316223 367.612305,678.953613 383.563141,675.585999 C390.663605,674.086914 390.890839,673.909485 390.877045,666.821716 C390.820953,637.990906 390.748383,609.159973 390.635101,580.329285 C390.606995,573.180969 389.703339,572.537170 382.668274,574.020142 C324.228088,586.339600 265.789001,598.664185 207.344040,610.960876 C201.210632,612.251343 195.041504,613.371887 188.725113,614.603210 C187.292480,610.411804 188.510086,606.788879 189.027573,603.330078 C192.760315,578.380676 199.169739,554.152466 209.190109,530.933350 C210.327942,528.296753 211.703461,526.555664 214.745636,525.917297 C241.771820,520.245667 268.771027,514.445679 295.775970,508.672974 C325.051483,502.414948 354.328979,496.165894 383.595673,489.866791 C390.551178,488.369781 390.681244,488.120392 390.682007,480.893097 C390.692627,379.233917 390.719299,277.574707 390.634583,175.915604 C390.630768,171.338058 391.682251,167.714966 394.734528,164.135559 C414.155914,141.360397 436.627472,122.229080 462.284882,106.853348 C465.212250,105.099037 467.665710,102.446541 471.411316,101.519569 C472.895233,103.955650 472.288849,106.496086 472.289581,108.867737 C472.325806,226.192490 472.320618,343.517242 472.320007,460.842010 C472.319977,462.008575 472.306641,463.175354 472.322754,464.341705 C472.398529,469.816010 473.187561,470.530914 478.497711,469.418060 C500.805786,464.743042 523.077393,459.888916 545.423462,455.404724 C550.344666,454.417175 551.790649,452.238159 551.784729,447.344666 C551.691162,369.683899 551.788025,292.022888 551.766968,214.361954 C551.766113,211.020020 552.486877,208.283875 554.705750,205.684998 C575.879517,180.884918 600.198181,159.837814 628.481140,143.482407 C629.751587,142.747726 630.864380,141.592300 632.643372,141.813950 C634.605713,143.430237 633.912415,145.750397 633.913513,147.800552 C633.961975,241.126938 633.970947,334.453339 633.982910,427.779755 C633.983032,428.612915 633.937683,429.446625 633.956421,430.279114 C634.078613,435.710785 634.892639,436.327515 640.257996,435.198547 C653.937683,432.320068 667.621887,429.462738 681.302856,426.590332 C730.792358,416.199738 780.282043,405.809570 829.769592,395.409332 C834.756287,394.361359 835.406433,395.013214 834.677246,399.903839 C830.809631,425.841309 824.541077,451.115906 814.672791,475.485260 C812.751526,480.229675 810.501465,482.959412 805.123169,484.069336 C768.463867,491.634460 731.887756,499.601807 695.277100,507.403412 C676.568237,511.390167 657.858093,515.374023 639.113831,519.189026 C635.288513,519.967651 633.938049,521.764709 633.958679,525.641479 C634.082581,548.972107 634.064636,572.304077 633.951660,595.634949 C633.930664,599.966248 635.272156,601.033081 639.625244,600.086243 C673.593689,592.697571 707.609802,585.527466 741.611816,578.293274 C771.386780,571.958496 801.168274,565.654114 830.929932,559.257751 C834.072510,558.582397 835.506409,559.385864 834.998901,562.665100 C830.890808,589.212097 824.945190,615.254944 814.598267,640.188171 C812.438354,645.392883 809.299377,647.892273 803.874084,649.011108 C772.262329,655.530640 740.712158,662.348328 709.131287,669.018250 C661.436707,679.091309 613.719727,689.058960 566.043274,699.216919 C551.764526,702.259216 551.791321,702.481567 551.783813,688.020996 C551.759460,641.024475 551.763062,594.027954 551.726379,547.031433 C551.720093,538.971802 550.802734,538.306458 543.044983,539.959656 C522.055359,544.432495 501.082916,548.991882 480.048920,553.246460 C474.997803,554.268127 473.227875,556.634094 473.257263,561.723145 C473.409302,588.053467 473.233765,614.385498 473.278564,640.716736 C473.297546,651.883972 470.533630,661.905334 463.572052,670.966370 C453.207855,684.456238 445.159027,699.507690 435.906342,713.754089 C427.888794,726.098755 419.048035,737.735107 407.214478,747.282104 z"
              />
              <path
                fill="#ffffff"
                opacity="1.000000"
                stroke="none"
                d="M581.944824,776.715210 C613.421326,770.061890 644.488159,763.486572 675.554443,756.908875 C709.557007,749.709595 743.563049,742.526245 777.559814,735.299622 C794.633728,731.670166 811.692261,727.968567 828.753967,724.282104 C835.147034,722.900757 835.364563,723.191956 834.416992,729.536316 C830.493774,755.803833 824.275330,781.427002 813.912964,805.984009 C812.221130,809.993225 809.981934,811.874695 805.741211,812.768250 C754.642273,823.535278 703.574158,834.449646 652.515320,845.406067 C621.299133,852.104553 590.109436,858.926941 558.915466,865.728638 C552.028931,867.230225 551.783386,867.062134 552.665771,860.182068 C556.003784,834.154602 562.314331,808.918457 572.359985,784.622986 C574.185486,780.208069 576.554138,777.158813 581.944824,776.715210 z"
              />
            </svg>
          </div>
    
          <!-- Balance Amount - Right Side -->
          <div class="balance-amount-container">
            <div class="balance-amount masked" id="balance-amount">* * * * *</div>
            <div class="balance-label">الرصيد الحالي</div>
          </div>
    
          <!-- Visibility Toggle Button -->
          <button
            class="balance-visibility-toggle"
            id="balance-visibility-toggle"
            title="إظهار الرصيد"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mini Toggle Button (shown when balance tracker is hidden) -->
      <button
        class="balance-mini-toggle"
        id="balance-mini-toggle"
        title="إظهار الرصيد"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </button>
    `;
  }

  cacheElements() {
    this.elements = {
      container: document.getElementById("balance-tracker-container"),
      amount: document.getElementById("balance-amount"),
      toggleBtn: document.getElementById("balance-tracker-toggle"),
      miniToggle: document.getElementById("balance-mini-toggle"),
      visibilityToggle: document.getElementById("balance-visibility-toggle"),
    };
  }

  bindEvents() {
    this.elements.toggleBtn?.addEventListener("click", () => this.toggleContainer());
    this.elements.miniToggle?.addEventListener("click", () => this.toggleContainer());
    this.elements.visibilityToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleVisibility();
    });
  }

  loadInitialState() {
    this.isContainerHidden = localStorage.getItem("balanceTrackerHidden") === "true";
    this.isVisible = localStorage.getItem("balanceVisible") === "true";

    this.isContainerHidden ? this.hideContainer(false) : this.showContainer(false);
    this.isVisible ? this.revealBalance() : this.maskBalance();
  }

  toggleContainer() {
    this.isContainerHidden ? this.showContainer(true) : this.hideContainer(true);
  }

  showContainer(animate = true) {
    if (!this.elements.container) return;
    this.isContainerHidden = false;
    this.elements.container.classList.remove("hidden");
    this.elements.miniToggle?.classList.remove("visible");
    this.elements.toggleBtn.innerHTML = this.getCloseIcon();
    this.elements.toggleBtn.title = "إغلاق الرصيد";
    localStorage.setItem("balanceTrackerHidden", "false");
    this.isVisible ? this.revealBalance() : this.maskBalance();
  }

  hideContainer(animate = true) {
    if (!this.elements.container) return;
    this.isContainerHidden = true;
    this.elements.container.classList.add("hidden");
    setTimeout(() => this.elements.miniToggle?.classList.add("visible"), animate ? 300 : 0);
    this.elements.toggleBtn.innerHTML = this.getShowIcon();
    this.elements.toggleBtn.title = "إظهار الرصيد";
    localStorage.setItem("balanceTrackerHidden", "true");
  }

  toggleVisibility() {
    this.isVisible ? this.maskBalance() : this.revealBalance();
  }

  maskBalance() {
    this.isVisible = false;
    this.elements.amount.textContent = "* * * *";
    this.elements.amount.classList.add("masked");
    this.elements.visibilityToggle.innerHTML = this.getShowEyeIcon();
    this.elements.visibilityToggle.title = "إظهار الرصيد";
    localStorage.setItem("balanceVisible", "false");
  }

  revealBalance() {
    this.isVisible = true;
    this.elements.amount.textContent = this.realBalanceValue || "0.00";
    this.elements.amount.classList.remove("masked");
    this.elements.visibilityToggle.innerHTML = this.getHideEyeIcon();
    this.elements.visibilityToggle.title = "إخفاء الرصيد";
    localStorage.setItem("balanceVisible", "true");
  }

  async fetchBalance() {
    if (!this.elements.amount) return;
    try {
      this.showLoading();
      const response = await fetch(`${this.scriptURL}?type=balance`);
      const data = await response.json();
      const totalBalance = parseFloat(data.totalBalance || 0);
      this.animateBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      this.showError();
    }
  }

  animateBalance(newAmount) {
    const oldAmount = parseFloat(this.realBalanceValue.replace(/,/g, '')) || 0;
    if (newAmount === oldAmount) return;

    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    const delta = (newAmount - oldAmount) / steps;

    const animate = () => {
      currentStep++;
      const interpolated = oldAmount + delta * currentStep;
      if (this.isVisible) {
        this.elements.amount.textContent = this.formatAmount(interpolated);
      }
      if (currentStep < steps) {
        requestAnimationFrame(animate);
      } else {
        this.realBalanceValue = this.formatAmount(newAmount);
        if (this.isVisible) {
          this.elements.amount.textContent = this.realBalanceValue;
          this.elements.amount.classList.add("balance-updated");
          setTimeout(() => {
            this.elements.amount?.classList.remove("balance-updated");
          }, 600);
        } else {
          this.maskBalance();
        }
        this.elements.amount.classList.remove("loading");
      }
    };

    animate();
  }

  formatAmount(amount) {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("ar-SA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(num || 0);
  }

  showLoading() {
    this.elements.amount.innerHTML = '<div class="balance-loading-spinner"></div>';
    this.elements.amount.classList.add("loading");
  }

  showError() {
    this.elements.amount.textContent = "خطأ في التحميل";
    this.elements.amount.classList.remove("loading");
    this.elements.amount.style.color = "#ff6b6b";
  }

  getShowIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }

  getCloseIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  }

  getShowEyeIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }

  getHideEyeIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  }

  refresh() {
    this.fetchBalance();
  }

  destroy() {
    if (this.container) this.container.innerHTML = "";
    localStorage.removeItem("balanceTrackerHidden");
    localStorage.removeItem("balanceVisible");
    clearInterval(this.autoRefreshInterval);
  }
}

// Auto Init
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("balance-tracker")) {
      window.balanceTrackerInstance = new BalanceTracker();
      window.BalanceTracker = {
        refresh: () => window.balanceTrackerInstance?.refresh(),
        destroy: () => window.balanceTrackerInstance?.destroy(),
      };
    }
  });
}
