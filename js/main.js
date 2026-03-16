/* ============================================
   ZoG CLAN WEBSITE — main.js
   Particles, Scroll Reveal, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initSmoothLinks();
});

/* ── Particle System ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const particles = [];
  const COUNT = Math.min(50, Math.floor(W / 30));

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.3 ? '#D4AF37' : '#9B30FF',
      life: Math.random(),
      decay: Math.random() * 0.003 + 0.001
    });
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity * p.life;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = {
          x: Math.random() * W,
          y: H + 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          color: Math.random() > 0.3 ? '#D4AF37' : '#9B30FF',
          life: 1,
          decay: Math.random() * 0.003 + 0.001
        };
      }

      drawParticle(particles[i]);
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  els.forEach(el => observer.observe(el));
}

/* ── Smooth Anchor Links ── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Active Nav Highlight on Scroll ── */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top    = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { passive: true });
