// Optimized lazy loading for Carrd deferred images - bypasses Carrd's system completely
(function() {
  'use strict';
  
  console.log('🖼️ Lazy loading script initialized - storing original data-src before Carrd processes');
  
  // Store original data-src values before Carrd can modify them
  const originalDataSrcs = new Map();
  
  // Store data-src values immediately when DOM is parsed
  const storeOriginalDataSrcs = () => {
    const deferredImages = document.querySelectorAll('.frame.deferred img[data-src]');
    console.log(`📦 Storing ${deferredImages.length} original data-src values`);
    
    deferredImages.forEach((img, index) => {
      const originalSrc = img.getAttribute('data-src');
      if (originalSrc && originalSrc !== 'undefined' && originalSrc !== 'done') {
        originalDataSrcs.set(img, originalSrc);
        console.log(`💾 Stored ${index + 1}: "${originalSrc}"`);
      }
    });
  };
  
  // Run immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', storeOriginalDataSrcs);
  } else {
    storeOriginalDataSrcs();
  }
  
  // Create mechanical loading indicator for robot theme
  const createMechanicalSpinner = () => {
    const spinner = document.createElement('div');
    spinner.className = 'mechanical-loading';
    spinner.innerHTML = `
      <div class="gear-1">⚙️</div>
      <div class="gear-2">⚙️</div>
      <div class="gear-3">⚙️</div>
    `;
    return spinner;
  };
  
  // Add mechanical spinner styles
  const style = document.createElement('style');
  style.textContent = `
    .mechanical-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.7;
      z-index: 10;
    }
    .mechanical-loading .gear-1 {
      animation: spin-clockwise 2s linear infinite;
      font-size: 1.5rem;
      filter: hue-rotate(200deg);
    }
    .mechanical-loading .gear-2 {
      animation: spin-counter-clockwise 1.5s linear infinite;
      font-size: 1.2rem;
      filter: hue-rotate(160deg);
    }
    .mechanical-loading .gear-3 {
      animation: spin-clockwise 2.5s linear infinite;
      font-size: 1rem;
      filter: hue-rotate(120deg);
    }
    @keyframes spin-clockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-counter-clockwise {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Enhanced image loading using stored original data-src values
  function loadImage(img) {
    const src = originalDataSrcs.get(img);
    console.log('🔍 Loading image from stored data:', src);
    
    if (!src) {
      console.error('❌ No stored data-src found for image');
      return false;
    }
    
    const parentFrame = img.closest('.frame');
    let spinner = null;
    
    // Add mechanical spinner
    if (parentFrame) {
      spinner = createMechanicalSpinner();
      parentFrame.style.position = 'relative';
      parentFrame.appendChild(spinner);
    }
    
    // Create new image to preload
    const newImg = new Image();
    
    newImg.onload = () => {
      console.log('✅ Image loaded successfully:', src);
      img.src = src;
      
      // Remove spinner and loading states
      if (spinner) spinner.remove();
      if (parentFrame) {
        parentFrame.classList.remove('deferred', 'loading');
      }
      img.classList.remove('loading');
      
      // Remove from our map since it's loaded
      originalDataSrcs.delete(img);
    };
    
    newImg.onerror = () => {
      console.error('❌ Failed to load image:', src);
      if (spinner) spinner.remove();
    };
    
    newImg.src = src;
    return true;
  }
  
  // Intersection Observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('👁️ Image entering viewport:', entry.target);
          const img = entry.target;
          
          if (originalDataSrcs.has(img) && loadImage(img)) {
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Start observing after ensuring data is stored
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        console.log(`🚀 Starting to observe ${originalDataSrcs.size} stored images`);
        
        originalDataSrcs.forEach((src, img) => {
          console.log(`👁️ Observing image: "${src}"`);
          imageObserver.observe(img);
        });
      }, 200); // Give time for data storage
    });
  } else {
    // Fallback for older browsers
    console.log('⚠️ Using fallback loading (no IntersectionObserver)');
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        originalDataSrcs.forEach((src, img) => {
          loadImage(img);
        });
      }, 200);
    });
  }
  
  // Remove page loading class
  window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
    console.log('🎉 Page fully loaded');
  });
})();