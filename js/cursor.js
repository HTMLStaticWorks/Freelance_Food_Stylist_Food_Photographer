/**
 * Custom Cursor: Implements interactive dual cursor with magnetic targets and image preview states.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Disable custom cursor on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // Create cursor elements dynamically
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor';
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower';
  const imagePreview = document.createElement('div');
  imagePreview.className = 'cursor-image-preview';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);
  document.body.appendChild(imagePreview);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;

  // LERP coefficients for lag effect
  const dotSpeed = 1;
  const followerSpeed = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation Loop using requestAnimationFrame
  function renderCursor() {
    // Smooth positions
    cursorX += (mouseX - cursorX) * dotSpeed;
    cursorY += (mouseY - cursorY) * dotSpeed;
    
    followerX += (mouseX - followerX) * followerSpeed;
    followerY += (mouseY - followerY) * followerSpeed;

    // Apply styles
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    // Follower image preview placement if active
    if (imagePreview.classList.contains('active')) {
      imagePreview.style.left = `${mouseX + 30}px`;
      imagePreview.style.top = `${mouseY + 30}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover States Hooks
  document.body.addEventListener('mouseover', (e) => {
    const target = e.target;
    
    // Links, buttons, interactive targets
    if (target.closest('a') || target.closest('button') || target.closest('.filter-btn') || target.closest('.faq-header')) {
      document.body.classList.add('hover-link');
      
      // Magnetic Effect check
      const magneticTarget = target.closest('[data-magnetic]');
      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        mouseX = bounds.left + bounds.width / 2;
        mouseY = bounds.top + bounds.height / 2;
        cursorFollower.style.width = `${bounds.width + 10}px`;
        cursorFollower.style.height = `${bounds.height + 10}px`;
        cursorFollower.style.borderRadius = window.getComputedStyle(magneticTarget).borderRadius;
      }
    }

    // Cursor image preview hover trigger
    const previewTarget = target.closest('[data-cursor-image]');
    if (previewTarget) {
      const imgUrl = previewTarget.getAttribute('data-cursor-image');
      imagePreview.innerHTML = `<img src="${imgUrl}" alt="Preview">`;
      imagePreview.classList.add('active');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const target = e.target;
    
    if (target.closest('a') || target.closest('button') || target.closest('.filter-btn') || target.closest('.faq-header')) {
      document.body.classList.remove('hover-link');
      
      // Reset follower size
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.borderRadius = '50%';
    }

    const previewTarget = target.closest('[data-cursor-image]');
    if (previewTarget) {
      imagePreview.classList.remove('active');
    }
  });
});
