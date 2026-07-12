/* =========================================================
   MITHRA U — SPACE PORTFOLIO — HERO SCRIPT
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS ---------- */
  if (window.AOS) AOS.init({ once: true, offset: 40 });

  /* ---------- Starfield Canvas (stars + twinkle + shooting stars) ---------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], shootingStars = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const STAR_COUNT = Math.min(260, Math.floor((window.innerWidth * window.innerHeight) / 4500));

  function initStars(){
    stars = [];
    for(let i=0; i<STAR_COUNT; i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.4 + 0.3,
        baseAlpha: Math.random()*0.6 + 0.3,
        twinkleSpeed: Math.random()*0.02 + 0.005,
        phase: Math.random()*Math.PI*2,
        parallax: Math.random()*0.4 + 0.1
      });
    }
  }
  initStars();
  window.addEventListener('resize', initStars);

  function spawnShootingStar(){
    shootingStars.push({
      x: Math.random()*w*0.6 + w*0.2,
      y: -20,
      len: Math.random()*80 + 60,
      speed: Math.random()*8 + 6,
      angle: Math.PI/4 + (Math.random()*0.2 - 0.1),
      life: 1
    });
  }
  setInterval(() => { if (Math.random() < 0.5) spawnShootingStar(); }, 3500);

  let mouseX = w/2, mouseY = h/2;
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw(){
    ctx.clearRect(0,0,w,h);

    // parallax offset based on mouse
    const px = (mouseX - w/2) / w;
    const py = (mouseY - h/2) / h;

    // stars
    for(const s of stars){
      s.phase += s.twinkleSpeed;
      const alpha = s.baseAlpha + Math.sin(s.phase)*0.3;
      ctx.beginPath();
      const dx = s.x - px * 30 * s.parallax * 10;
      const dy = s.y - py * 30 * s.parallax * 10;
      ctx.arc(dx, dy, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    }

    // shooting stars
    shootingStars.forEach((s, i) => {
      const dx = Math.cos(s.angle) * s.len;
      const dy = Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - dx, s.y - dy);
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.012;
      if (s.life <= 0 || s.y > h + 50) shootingStars.splice(i, 1);
    });

    requestAnimationFrame(draw);
  }
  draw();

  /* ---------- Constellation lines (simple SVG-ish canvas overlay) ---------- */
  const constWrap = document.getElementById('constellations');
  if (constWrap) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    constWrap.appendChild(svg);

    function buildConstellation(cx, cy, points, spread){
      const coords = [];
      for(let i=0;i<points;i++){
        coords.push([
          cx + (Math.random()-0.5)*spread,
          cy + (Math.random()-0.5)*spread
        ]);
      }
      for(let i=0;i<coords.length-1;i++){
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', coords[i][0]);
        line.setAttribute('y1', coords[i][1]);
        line.setAttribute('x2', coords[i+1][0]);
        line.setAttribute('y2', coords[i+1][1]);
        line.setAttribute('stroke', '#5EFCE8');
        line.setAttribute('stroke-width', '0.6');
        line.setAttribute('opacity', '0.35');
        svg.appendChild(line);
      }
      coords.forEach(([x,y]) => {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 1.4);
        dot.setAttribute('fill', '#fff');
        svg.appendChild(dot);
      });
    }
    buildConstellation(window.innerWidth*0.15, window.innerHeight*0.2, 5, 140);
    buildConstellation(window.innerWidth*0.8, window.innerHeight*0.6, 6, 160);
    buildConstellation(window.innerWidth*0.5, window.innerHeight*0.85, 4, 120);
  }

  /* ---------- Cursor glow + trail ---------- */
  const glow = document.getElementById('cursor-glow');
  const trail = document.getElementById('cursor-trail');
  if (glow && trail && window.matchMedia('(min-width: 821px)').matches) {
    let tx = w/2, ty = h/2;
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      tx = e.clientX; ty = e.clientY;
    });
    function animateTrail(){
      const cur = trail.getBoundingClientRect();
      const curX = parseFloat(trail.style.left || tx);
      const curY = parseFloat(trail.style.top || ty);
      const nx = curX + (tx - curX) * 0.18;
      const ny = curY + (ty - curY) * 0.18;
      trail.style.left = nx + 'px';
      trail.style.top = ny + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }

  /* ---------- Typed.js role rotation ---------- */
  if (window.Typed) {
    new Typed('#typed-text', {
      strings: ['Software Engineer', 'Java Developer', 'Full Stack Developer', 'UI Designer', 'Tech Enthusiast'],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      showCursor: false
    });
  }

  /* ---------- Navbar scroll state + mobile menu ---------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = document.getElementById('scrollProgressBar');
    if (bar) bar.style.width = pct + '%';
  });

  menuToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------- Dark / Light toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    const isLight = document.body.classList.contains('light-mode');
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });

  /* ---------- Ripple buttons ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size/2) + 'px';
      circle.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ---------- Profile particles ---------- */
  const particleWrap = document.getElementById('profileParticles');
  if (particleWrap) {
    for (let i=0; i<14; i++){
      const p = document.createElement('span');
      p.style.left = Math.random()*100 + '%';
      p.style.top = Math.random()*100 + '%';
      p.style.animationDelay = (Math.random()*5) + 's';
      p.style.animationDuration = (4 + Math.random()*3) + 's';
      particleWrap.appendChild(p);
    }
  }

  /* ---------- Smooth scroll for in-page nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Transmission received — thanks for reaching out! I\'ll reply soon.';
    contactForm.reset();
    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  });

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- GSAP entrance orchestration ---------- */
  if (window.gsap) {
    gsap.from('.hero-greeting, .hero-name, .hero-role', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    gsap.from('.orbit-stage', { scale: 0.7, opacity: 0, duration: 1.1, delay: 0.3, ease: 'power3.out' });
    gsap.from('.floater', { opacity: 0, duration: 1.4, stagger: 0.15, delay: 0.6 });
  }

});