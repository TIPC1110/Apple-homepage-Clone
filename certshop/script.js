const sliderTrack = document.querySelector('.slider-track');
const featureCards = sliderTrack ? Array.from(sliderTrack.querySelectorAll('.feature-slide')) : [];
const prevButton = document.querySelector('.slider-control.prev');
const nextButton = document.querySelector('.slider-control.next');

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

if (sliderTrack && featureCards.length) {
  let currentIndex = 0;

  const updateSlider = (index) => {
    const targetCard = featureCards[index];
    if (targetCard) {
      sliderTrack.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
    }
  };

  const nextFeature = () => {
    currentIndex = (currentIndex + 1) % featureCards.length;
    updateSlider(currentIndex);
  };

  const prevFeature = () => {
    currentIndex = (currentIndex - 1 + featureCards.length) % featureCards.length;
    updateSlider(currentIndex);
  };

  nextButton?.addEventListener('click', nextFeature);
  prevButton?.addEventListener('click', prevFeature);

  let autoSlide = setInterval(nextFeature, 5000);

  sliderTrack.addEventListener('mouseover', () => clearInterval(autoSlide));
  sliderTrack.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextFeature, 5000);
  });
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = window.innerWidth < 720 ? 45 : 90;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  if (window.gsap) {
    gsap.from('.hero-text h1 span', { y: 20, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out' });
    gsap.from('.hero-visual', { opacity: 0, scale: 0.9, duration: 1.3, ease: 'power2.out' });
    gsap.from('.pricing-card', { scrollTrigger: '.pricing-card', y: 30, opacity: 0, stagger: 0.2, duration: 0.9 });
    gsap.utils.toArray('.process-step').forEach((step, index) => {
      gsap.from(step, { scrollTrigger: step, y: 40, opacity: 0, delay: index * 0.1, duration: 0.8 });
    });
    gsap.utils.toArray('.testimonial-card').forEach((card) => {
      gsap.from(card, { scrollTrigger: card, y: 30, opacity: 0, duration: 0.9 });
    });
  }
});

const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxElements.forEach((element, idx) => {
    const speed = idx === 0 ? -0.1 : 0.12;
    element.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.classList.add('submitted');
    const button = form.querySelector('button');
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = 'Đang xử lý...';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Đã gửi!';
      if (window.gsap) {
        gsap.to(button, { background: '#64ffda', color: '#050b16', duration: 0.4 });
      }
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        form.reset();
        if (window.gsap) {
          gsap.to(button, { background: '', color: '', duration: 0.4 });
        }
        form.classList.remove('submitted');
      }, 2800);
    }, 1200);
  });
}
