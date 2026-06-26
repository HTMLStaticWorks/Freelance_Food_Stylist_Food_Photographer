/**
 * Animations Manager: Manages scroll reveals, split text, 3D tilts, counter elements, and slider scrubbers.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Text Character Splitting
  const splitTextElements = document.querySelectorAll('.split-text');
  splitTextElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    
    // Split into characters
    for (let char of text) {
      const wrap = document.createElement('span');
      wrap.className = 'split-char-wrap';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space for spacing
      wrap.appendChild(inner);
      el.appendChild(wrap);
    }
  });

  // 2. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If it's a counter, trigger count animation
        if (entry.target.classList.contains('animate-number')) {
          animateCounter(entry.target);
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Counter Animation Logic
  function animateCounter(counterEl) {
    const target = parseInt(counterEl.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // ms
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(easedProgress * target);
      
      counterEl.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counterEl.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  // 4. Before/After Image Slider Control
  const sliders = document.querySelectorAll('.before-after-slider');
  sliders.forEach(slider => {
    const rangeInput = slider.querySelector('.slider-input');
    const beforeImg = slider.querySelector('.slider-img.before');
    const handle = slider.querySelector('.slider-handle');

    if (rangeInput && beforeImg && handle) {
      rangeInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        if (isRtl) {
          beforeImg.style.clipPath = `polygon(${val}% 0, 100% 0, 100% 100%, ${val}% 100%)`;
          handle.style.left = `${val}%`;
        } else {
          beforeImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
          handle.style.left = `${val}%`;
        }
      });
    }
  });

  // 5. Mouse Hover 3D Perspective Tilt Card
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation offset: -10deg to 10deg
      const rotateX = ((y / height) - 0.5) * -15; 
      const rotateY = ((x / width) - 0.5) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // 6. Horizontal mouse wheel translations
  const horizontalContainers = document.querySelectorAll('.horizontal-scroll-container');
  horizontalContainers.forEach(container => {
    container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    });
  });
});
