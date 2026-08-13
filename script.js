// ===== Nav background on scroll =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Descent rail progress =====
const railFill = document.getElementById('railFill');
function updateRail(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (railFill) railFill.style.height = pct + '%';
}
window.addEventListener('scroll', updateRail, { passive: true });
updateRail();

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Trench divider carve-in =====
const trenches = document.querySelectorAll('[data-trench]');
const trenchObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      trenchObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
trenches.forEach(el => trenchObserver.observe(el));

// ===== Booking form =====
const form = document.getElementById('bookForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('bookSubmit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Request failed');

    status.textContent = 'Request sent — we\'ll confirm shortly by email or WhatsApp.';
    status.classList.add('ok');
    form.reset();
  } catch (err) {
    status.textContent = 'Something went wrong sending that. Please message us directly on WhatsApp/Telegram instead.';
    status.classList.add('err');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send booking request →';
  }
});
