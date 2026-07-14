// ===== Preloader boot sequence =====
const preloader = document.getElementById('preloader');
const bootLines = [
  { el: document.getElementById('bootLine1'), text: '[ .. ] booting sandesh_os' },
  { el: document.getElementById('bootLine2'), text: '[ OK ] loading security modules' },
  { el: document.getElementById('bootLine3'), text: '[ OK ] connection secure — welcome' }
];

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function runBootSequence() {
  if (reducedMotionQuery.matches) {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
    return;
  }

  bootLines.forEach((line, i) => {
    setTimeout(() => {
      line.el.textContent = line.text;
      line.el.classList.add('show');
    }, i * 350);
  });

  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }, bootLines.length * 350 + 400);
}

runBootSequence();

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Typed role text =====
const roles = [
  'Cybersecurity Student',
  'Network Security Enthusiast',
  'Aspiring Penetration Tester',
  'Full-Stack Builder'
];

const typedEl = document.getElementById('typed-text');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 80);
}

if (prefersReducedMotion) {
  typedEl.textContent = roles[0];
} else {
  typeLoop();
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

// ===== Copy email =====
const copyBtn = document.getElementById('copyEmailBtn');

copyBtn.addEventListener('click', async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  const original = copyBtn.textContent;
  copyBtn.textContent = 'Copied!';
  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.textContent = original;
    copyBtn.classList.remove('copied');
  }, 1800);
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Matrix rain background =====
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height, columns, drops;
const fontSize = 15;
const chars = 'アイウエオカキクケコサシスセソ01アカサナハマヤラワ0123456789';

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * height / fontSize));
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(10, 14, 20, 0.08)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#00ff9d';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < columns; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    ctx.fillText(char, x, y);

    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let matrixInterval;

function startMatrix() {
  resizeCanvas();
  if (matrixInterval) clearInterval(matrixInterval);
  matrixInterval = setInterval(drawMatrix, 60);
}

if (!prefersReducedMotion) {
  startMatrix();
  window.addEventListener('resize', () => {
    clearInterval(matrixInterval);
    startMatrix();
  });
}

// ===== Scroll-spy nav highlighting =====
const sectionEls = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

sectionEls.forEach((sec) => spyObserver.observe(sec));

// ===== Hero cursor spotlight =====
const heroSection = document.querySelector('.hero');
const heroSpotlight = document.getElementById('heroSpotlight');

if (heroSection && heroSpotlight && !prefersReducedMotion) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSpotlight.style.setProperty('--x', `${x}%`);
    heroSpotlight.style.setProperty('--y', `${y}%`);
  });
}

// ===== Project card 3D tilt =====
const tiltCards = document.querySelectorAll('.project-card');

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== Back to top button =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});
