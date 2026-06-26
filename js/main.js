/**
 * Main Application Orchestrator: Initializes page loader, scroll morphing, menu toggles, and indicators.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Luxury Loader Percentage Simulation
  const loader = document.getElementById('loader');
  const loaderCounter = document.querySelector('.loader-counter');
  const loaderProgress = document.querySelector('.loader-progress');
  
  if (loader && loaderCounter && loaderProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('loaded');
          // Trigger animations on visible content
          const initialReveals = document.querySelectorAll('.hero .reveal');
          initialReveals.forEach(el => el.classList.add('active'));
        }, 300);
      }
      loaderCounter.textContent = `${progress}%`;
      loaderProgress.style.width = `${progress}%`;
    }, 40);
  } else {
    // If loader doesn't exist, trigger initial reveal immediately
    setTimeout(() => {
      const initialReveals = document.querySelectorAll('.hero .reveal');
      initialReveals.forEach(el => el.classList.add('active'));
    }, 100);
  }

  // 2. Header Morphing & Reading Progress
  const header = document.querySelector('.header');
  const progressBar = document.querySelector('.reading-progress-bar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Header transition morphing
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Reading Progress calculation
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
      }
    }
  });

  // 3. Mobile Navigation Hamburger Menu Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-active');
      
      // Prevent body scrolling when active
      if (mobileDrawer.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close drawer on link click
    const drawerLinks = mobileDrawer.querySelectorAll('.nav-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.classList.remove('mobile-menu-active');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Back To Top scroll listener & Sticky CTA Hide on Footer Reach
  const backToTop = document.querySelector('.back-to-top');
  const stickyCta = document.querySelector('.sticky-cta');
  const footer = document.querySelector('.footer');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Back to top visible check
    if (backToTop) {
      if (scrollTop > 500) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    }
    
    // Sticky CTA scroll visibility and overlap check with footer
    if (stickyCta) {
      const showCta = scrollTop > 500;
      let footerOverlap = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight) {
          footerOverlap = true;
        }
      }
      if (showCta && !footerOverlap) {
        stickyCta.style.opacity = '1';
        stickyCta.style.visibility = 'visible';
        stickyCta.style.transform = 'translateY(0)';
      } else {
        stickyCta.style.opacity = '0';
        stickyCta.style.visibility = 'hidden';
        stickyCta.style.transform = 'translateY(20px)';
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Highlight Active Menu Page Hook
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-drawer .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
