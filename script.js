/* ===========================
   RIPrime Agro Firm — script.js
   =========================== */

/* ---------- Navbar Scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---------- Mobile Hamburger ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Hero Card Rotation ---------- */
const cropEmojis = [
  { icon: '🌾', label: 'Premium Harvest' },
  { icon: '🌿', label: 'Organic Herbs' },
  { icon: '🌽', label: 'Golden Maize' },
  { icon: '🫘', label: 'Red Lentils' },
  { icon: '🍅', label: 'Export Tomatoes' },
  { icon: '🐄', label: 'Premium Cattle' },
];
let cropIdx = 0;
const heroCard  = document.getElementById('heroCard');
const cropIcon  = heroCard.querySelector('.crop-icon');
const cropLabel = heroCard.querySelector('.crop-label');
heroCard.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

setInterval(() => {
  heroCard.style.opacity = '0';
  heroCard.style.transform = 'translateY(12px)';
  setTimeout(() => {
    cropIdx = (cropIdx + 1) % cropEmojis.length;
    cropIcon.textContent  = cropEmojis[cropIdx].icon;
    cropLabel.textContent = cropEmojis[cropIdx].label;
    heroCard.style.opacity   = '1';
    heroCard.style.transform = '';
  }, 350);
}, 2800);

/* ---------- Counter Animation ---------- */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

/* ---------- Product Filter ---------- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- Testimonial Slider ---------- */
const testiTrack = document.getElementById('testiTrack');
const dots       = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoSlide;

function goToSlide(idx) {
  currentSlide = idx;
  testiTrack.style.transform = `translateX(-${idx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(parseInt(dot.dataset.idx, 10));
    startAutoSlide();
  });
});

function startAutoSlide() {
  autoSlide = setInterval(() => {
    goToSlide((currentSlide + 1) % dots.length);
  }, 5000);
}
startAutoSlide();

testiTrack.addEventListener('touchstart', e => { window._tx = e.touches[0].clientX; });
testiTrack.addEventListener('touchend', e => {
  const diff = (window._tx || 0) - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    clearInterval(autoSlide);
    goToSlide(diff > 0 ? Math.min(currentSlide + 1, dots.length - 1) : Math.max(currentSlide - 1, 0));
    startAutoSlide();
  }
});

/* ---------- Contact Form → Google Sheets ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

// ✅ REPLACE THIS with your Google Apps Script Web App URL
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzhD7XT5C7b7WsrqmemgzPIiGQoOU8AlYx6tNCGOyk807Rxblq3Us2r3YHarrc58tVU/exec';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  formStatus.textContent = '';

  const payload = {
    name:     document.getElementById('name').value,
    email:    document.getElementById('email').value,
    interest: document.getElementById('interest').value,
    message:  document.getElementById('message').value
  };

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    formStatus.textContent = '✅ Message sent! We will get back to you shortly.';
    formStatus.style.color = '#2e6b2e';
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = '❌ Network error. Please try again.';
    formStatus.style.color = '#c0392b';
  }

  btn.textContent = 'Send Message 🌱';
  btn.disabled = false;
  setTimeout(() => (formStatus.textContent = ''), 6000);
});

/* ---------- Active Nav on Scroll ---------- */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--green-main)' : '';
  });
}, { passive: true });