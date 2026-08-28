document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.style.display = isOpen ? 'flex' : 'none';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.style.display = 'none';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-inner > *, .timeline-item, .exp-card, .project-card, .cert-card, .activity-item, .highlight-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Sticky navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 8 ? '0 4px 24px rgba(76,32,180,0.08)' : 'none';
  }, { passive: true });

  /* ---------- Constellation sparkle background ---------- */
  const canvas = document.getElementById('constellation');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const NODE_COUNT_DESKTOP = 46;
    const NODE_COUNT_MOBILE = 22;
    const LINK_DIST = 150;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.documentElement.scrollHeight;
    }

    function initNodes() {
      const count = window.innerWidth < 720 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * Math.min(height, window.innerHeight * 1.4),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.6,
        tw: Math.random() * Math.PI * 2
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      const viewTop = window.scrollY;
      const viewBottom = viewTop + window.innerHeight + 200;

      nodes.forEach(n => {
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          n.tw += 0.02;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      });

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.y < viewTop - 200 || a.y > viewBottom) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(124,58,237,${0.09 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        if (n.y < viewTop - 200 || n.y > viewBottom) return;
        const glow = prefersReducedMotion ? 0.6 : (Math.sin(n.tw) * 0.35 + 0.65);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${0.35 * glow})`;
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    resize();
    initNodes();
    requestAnimationFrame(step);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initNodes(); }, 200);
    });
  }

});
