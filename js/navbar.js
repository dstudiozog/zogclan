/* ============================================
   ZoG CLAN WEBSITE — navbar.js
   Sticky, Hamburger, Progress Bar
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const toggle     = document.getElementById('nav-toggle');
  const menu       = document.getElementById('nav-menu');
  const overlay    = document.getElementById('nav-overlay');
  const progress   = document.getElementById('nav-progress');
  const navLinks   = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  /* ── Scroll: sticky + progress ── */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);

    if (progress) {
      const total    = document.body.scrollHeight - window.innerHeight;
      const pct      = (window.scrollY / total) * 100;
      progress.style.width = `${pct}%`;
    }
  }, { passive: true });

  /* ── Hamburger toggle ── */
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      if (overlay) overlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ── Overlay close ── */
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  /* ── Close on link click ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* ── Keyboard: Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  function closeMenu() {
    if (menu) menu.classList.remove('open');
    if (toggle) toggle.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
