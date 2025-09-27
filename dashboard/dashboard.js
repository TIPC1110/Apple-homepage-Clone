document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('overlay');
  const dashboardEl = document.getElementById('dashboard');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;
  const themeIcon = themeToggleBtn?.querySelector('i');
  const sidebar = document.querySelector('.sidebar');

  let isSidebarAnimating = false;
  let revenueChartInstance;
  let trafficChartInstance;

  const collapseBreakpoint = window.matchMedia('(min-width: 901px)');

  const destroyCharts = () => {
    if (revenueChartInstance) {
      revenueChartInstance.destroy();
      revenueChartInstance = null;
    }
    if (trafficChartInstance) {
      trafficChartInstance.destroy();
      trafficChartInstance = null;
    }
  };

  const createCharts = () => {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text').trim() || '#1d1d1f';
    const isDarkMode = document.body.classList.contains('dark-mode');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const primaryColor = 'rgba(0, 113, 227, 0.8)';
    const primaryColorTransparent = 'rgba(0, 113, 227, 0.1)';

    destroyCharts();

    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
      revenueChartInstance = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
            {
              label: 'Revenue',
              data: [1200, 1900, 3000, 5000, 2300, 3100, 4200, 3800],
              borderColor: primaryColor,
              backgroundColor: primaryColorTransparent,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: primaryColor,
              pointBorderWidth: 0,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: primaryColor,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: 'transparent' },
              ticks: { color: textColor },
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: (value) => '$' + value / 1000 + 'k',
              },
              beginAtZero: true,
            },
          },
          interaction: { intersect: false, mode: 'index' },
        },
      });
    }

    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
      const shouldHideLegend = window.innerWidth < 480;

      trafficChartInstance = new Chart(trafficCtx, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Referral', 'Social', 'Organic'],
          datasets: [
            {
              label: 'Traffic Source',
              data: [300, 150, 100, 450],
              backgroundColor: [
                'rgba(0, 113, 227, 0.8)',
                'rgba(90, 200, 250, 0.8)',
                'rgba(52, 199, 89, 0.8)',
                'rgba(255, 204, 0, 0.8)',
              ],
              borderWidth: 0,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 1,
          cutout: '70%',
          plugins: {
            legend: {
              display: !shouldHideLegend,
              position: window.innerWidth < 768 ? 'top' : 'bottom',
              labels: {
                color: textColor,
                boxWidth: 15,
                padding: 20,
                font: {
                  size: window.innerWidth < 768 ? 12 : 14,
                },
              },
            },
          },
        },
      });
    }
  };

  const setMobileSidebarState = (isOpen) => {
    if (isOpen) {
      body.classList.add('sidebar-open');
    } else {
      body.classList.remove('sidebar-open');
    }

    mobileMenuBtn?.setAttribute('aria-expanded', String(isOpen));
    mobileMenuBtn?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  const closeSidebar = () => {
    setMobileSidebarState(false);
  };

  const handleSidebarToggle = () => {
    if (isSidebarAnimating) return;

    const isDesktop = collapseBreakpoint.matches;

    if (isDesktop) {
      isSidebarAnimating = true;
      dashboardEl.classList.toggle('sidebar-collapsed');
      sidebar?.classList.add('is-animating');
      sidebar?.addEventListener(
        'transitionend',
        () => {
          sidebar.classList.remove('is-animating');
          isSidebarAnimating = false;
        },
        { once: true }
      );
    } else {
      const willOpen = !body.classList.contains('sidebar-open');
      setMobileSidebarState(willOpen);
    }
  };

  dropdownToggles.forEach((toggle) => {
    const parent = toggle.closest('.dropdown');
    toggle.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach((openDropdown) => {
        if (openDropdown !== parent) {
          openDropdown.classList.remove('open');
          const button = openDropdown.querySelector('.dropdown-toggle');
          button?.setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('open');
      const isExpanded = parent.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(isExpanded));
    });
  });

  mobileMenuBtn?.addEventListener('click', handleSidebarToggle);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
      closeSidebar();
    }
  });

  document.querySelectorAll('.sidebar a').forEach((interactive) => {
    interactive.addEventListener('click', () => {
      if (!collapseBreakpoint.matches) {
        closeSidebar();
      }
    });
  });

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      themeIcon?.classList.remove('fa-moon');
      themeIcon?.classList.add('fa-sun');
    } else {
      body.classList.remove('dark-mode');
      themeIcon?.classList.remove('fa-sun');
      themeIcon?.classList.add('fa-moon');
    }

    requestAnimationFrame(() => {
      createCharts();
    });
  };

  themeToggleBtn?.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (mobileMenuBtn) {
    setMobileSidebarState(false);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createCharts();
      if (collapseBreakpoint.matches) {
        closeSidebar();
      }
    }, 200);
  });

  collapseBreakpoint.addEventListener('change', (event) => {
    if (event.matches) {
      closeSidebar();
    }
  });

  createCharts();
});
