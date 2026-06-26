/**
 * Portfolio Manager: Controls masonry column-distribution, category filtering, lightboxes, and project popups.
 */

// Sample Project Detailed Database
const PROJECTS_DATABASE = {
  'campaign-1': {
    title: 'The Artisanal Olive Oil Campaign',
    client: 'Tuscan Groves Co.',
    role: 'Lead Food Stylist & Photographer',
    specs: 'Sony A7R V | 90mm Macro F2.8 | Godox AD600 Pro',
    ingredients: 'Extra virgin olive oil, rosemary sprigs, raw garlic bulbs, rustic sourdough slices, sea salt flakes.',
    description: 'A commercial product launch focusing on raw, organic textures and warm Mediterranean sunlight. We styled the setup using rough-sawn oak boards, hand-made ceramics, and scattered fresh ingredients to evoke a rustic Italian kitchen mood. The natural window lighting was reinforced with a soft grid-diffused key light to bring out the glistening viscosity of the oil droplets.'
  },
  'campaign-2': {
    title: 'Summer Citrus Mixology',
    client: 'Nectar Distillers',
    role: 'Beverage Stylist & Photographer',
    specs: 'Phase One XF | 120mm Macro F4.0 | Broncolor Scoro S',
    ingredients: 'Blood orange wheels, crystal clear ice blocks, artisanal gin, tonic water, fresh mint leaves, star anise.',
    description: 'An editorial series highlighting liquid dynamics and glassware reflections. Using high-speed strobe sync, we captured crisp droplet splashes. Props were kept minimal—a dark obsidian stone slab to maximize color contrast and high-gloss mirrors to create light beams through the liquid glass.'
  },
  'campaign-3': {
    title: 'Le Petit Bistro Menu Rebrand',
    client: 'Le Petit Bistro Group',
    role: 'Food Stylist & Creative Director',
    specs: 'Fujifilm GFX 100S | 80mm F1.7 | Natural Light with Reflector',
    ingredients: 'French onion soup, toasted gruyere croutons, fresh thyme, caramelized onions, beef broth.',
    description: 'A collection of classic Parisian dishes styled for modern fine dining menus. The styling direction emphasized rich, warm tones, gooey melted cheese pulls, and steam capture. Natural sunlight from a north-facing window served as the primary key source, creating long, dramatic shadows that complement the dark brass bistro details.'
  },
  'campaign-4': {
    title: 'Deconstructed Sweet Treats',
    client: 'Pâtisserie Fleur',
    role: 'Pastry Stylist & Photographer',
    specs: 'Sony A7R V | 50mm F1.2 GM | Continuous LED panels',
    ingredients: 'Raspberry macarons, vanilla bean cream, fresh raspberries, edible gold leaf, powdered sugar.',
    description: 'A minimalist editorial study of bakery textures. We styled the pastries on off-white plaster plinths, using hard shadows and geometric angles. Powdered sugar was dusted on-set during the exposure to capture gentle floating particles in mid-air.'
  },
  'campaign-5': {
    title: 'Rustic Sourdough Story',
    client: 'The Flour Artisan',
    role: 'Editorial Food Photographer',
    specs: 'Canon EOS R5 | 50mm F1.2 L | Softbox overhead',
    ingredients: 'Leaven, active sourdough starter, flour dust, raw wheat stalks, proofed dough boule.',
    description: 'A cookbook spread capturing the heritage of breadmaking. Styling relied on flour-dusted hands, vintage linen cloths, and dark cast iron dutch ovens. Exposure was tuned for a moody, high-contrast chiaroscuro look.'
  },
  'campaign-6': {
    title: 'Modern Coffee Culture',
    client: 'Roaster & Co.',
    role: 'Creative Stylist',
    specs: 'Sony A7R V | 90mm Macro F2.8 | Godox AD300',
    ingredients: 'Arabica coffee beans, fresh espresso crema, whole oat milk, cinnamon sprinkles.',
    description: 'A series of commercial lifestyle assets highlighting morning coffee rituals. Focus was placed on milk pouring dynamics (creating beautiful swirls) and micro-texture on the foam surface.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // --- MASONRY GRID DISTRIBUTION ---
  const masonryContainer = document.querySelector('.masonry-grid');
  let originalItems = [];
  
  if (masonryContainer) {
    // Cache original items
    originalItems = Array.from(masonryContainer.querySelectorAll('.masonry-item'));
    initMasonryLayout();
    
    // Recalculate on window resize
    window.addEventListener('resize', debounce(() => {
      initMasonryLayout();
    }, 250));
  }

  function initMasonryLayout() {
    if (!masonryContainer) return;
    
    // Clear masonry container HTML
    masonryContainer.innerHTML = '';
    
    // Determine number of columns based on screen width
    let colCount = 3;
    if (window.innerWidth <= 480) {
      colCount = 1;
    } else if (window.innerWidth <= 768) {
      colCount = 2;
    }
    
    // Create column wrappers
    const cols = [];
    for (let i = 0; i < colCount; i++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'masonry-col';
      colDiv.style.flex = '1';
      colDiv.style.display = 'flex';
      colDiv.style.flexDirection = 'column';
      colDiv.style.gap = '2rem';
      masonryContainer.appendChild(colDiv);
      cols.push(colDiv);
    }
    
    // Distribute items
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    
    originalItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (activeFilter === 'all' || category === activeFilter) {
        // Distribute to the shortest column
        let shortestCol = cols[0];
        for (let i = 1; i < cols.length; i++) {
          if (cols[i].offsetHeight < shortestCol.offsetHeight) {
            shortestCol = cols[i];
          }
        }
        // Clone/Append item
        shortestCol.appendChild(item);
      }
    });
    
    // Re-bind Lightbox & Popups after distribution
    bindEvents();
  }

  // --- CATEGORY FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      initMasonryLayout();
    });
  });

  // --- LIGHTBOX & DETAILS POPUP ---
  let activeLightboxImages = [];
  let currentLightboxIdx = 0;

  function bindEvents() {
    // 1. Lightbox triggers
    const lbTriggers = document.querySelectorAll('[data-lightbox]');
    lbTriggers.forEach(trigger => {
      trigger.removeEventListener('click', openLightboxHandler); // Avoid multiple binds
      trigger.addEventListener('click', openLightboxHandler);
    });

    // 2. Project Modal triggers
    const projectTriggers = document.querySelectorAll('[data-project-trigger]');
    projectTriggers.forEach(trigger => {
      trigger.removeEventListener('click', openProjectModalHandler);
      trigger.addEventListener('click', openProjectModalHandler);
    });
  }

  function openLightboxHandler(e) {
    e.preventDefault();
    const clickedImg = e.currentTarget.querySelector('img');
    if (!clickedImg) return;
    
    // Gather all visible images for slideshow
    activeLightboxImages = Array.from(document.querySelectorAll('.masonry-item img, .card-image-wrap img'));
    currentLightboxIdx = activeLightboxImages.findIndex(img => img.src === clickedImg.src);

    openLightbox();
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <span class="lightbox-nav lightbox-prev">&#10094;</span>
      <span class="lightbox-nav lightbox-next">&#10095;</span>
      <img src="" alt="Lightbox Target">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');

  function openLightbox() {
    updateLightboxImg();
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  function updateLightboxImg() {
    if (currentLightboxIdx < 0 || currentLightboxIdx >= activeLightboxImages.length) return;
    const targetImg = activeLightboxImages[currentLightboxIdx];
    lbImg.src = targetImg.src;
    lbCaption.textContent = targetImg.alt || 'Editorial Styled Culinary Scene';
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentLightboxIdx = (currentLightboxIdx - 1 + activeLightboxImages.length) % activeLightboxImages.length;
    updateLightboxImg();
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    currentLightboxIdx = (currentLightboxIdx + 1) % activeLightboxImages.length;
    updateLightboxImg();
  });

  // Close on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // --- PROJECT modal ---
  const projectModal = document.createElement('div');
  projectModal.className = 'project-modal';
  projectModal.innerHTML = `
    <div class="project-modal-container">
      <div class="project-modal-left">
        <img src="" alt="Project Visual">
      </div>
      <div class="project-modal-right">
        <span class="project-modal-close">&times;</span>
        <div>
          <span class="section-tag" style="margin-bottom:0.5rem;" id="modal-client"></span>
          <h3 id="modal-title" style="margin-bottom:1.5rem;"></h3>
          <p id="modal-description" style="margin-bottom:1.5rem;"></p>
          <div style="margin-bottom:1.5rem;">
            <strong style="color:var(--accent-gold); display:block; margin-bottom:0.25rem;">Styling Ingredients:</strong>
            <p id="modal-ingredients" style="font-size:0.95rem; line-height:1.4;"></p>
          </div>
          <div>
            <strong style="color:var(--accent-gold); display:block; margin-bottom:0.25rem;">Camera & Studio Gear:</strong>
            <p id="modal-specs" style="font-size:0.95rem; font-family:var(--font-sans);"></p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(projectModal);

  function openProjectModalHandler(e) {
    const card = e.currentTarget.closest('[data-project-id]');
    if (!card) return;
    const pId = card.getAttribute('data-project-id');
    const dbEntry = PROJECTS_DATABASE[pId];
    if (!dbEntry) return;

    const mainImg = card.querySelector('img');
    
    projectModal.querySelector('.project-modal-left img').src = mainImg.src;
    projectModal.querySelector('#modal-client').textContent = dbEntry.client;
    projectModal.querySelector('#modal-title').textContent = dbEntry.title;
    projectModal.querySelector('#modal-description').textContent = dbEntry.description;
    projectModal.querySelector('#modal-ingredients').textContent = dbEntry.ingredients;
    projectModal.querySelector('#modal-specs').textContent = dbEntry.specs;

    projectModal.classList.add('active');
  }

  projectModal.querySelector('.project-modal-close').addEventListener('click', () => {
    projectModal.classList.remove('active');
  });

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('active');
  });

  // Helper function to debounce resize triggers
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
});
