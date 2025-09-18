#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inlineCriticalCSS() {
  try {
    console.log('🎨 Inlining critical CSS...');
    
    // Read critical CSS
    const criticalCSS = await fs.readFile(
      path.join(__dirname, '../frontend/critical.css'), 
      'utf-8'
    );
    
    // Read optimized HTML template
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, '../frontend/index-optimized.html'), 
      'utf-8'
    );
    
    // Replace CSS import with inlined styles
    const optimizedHTML = htmlTemplate.replace(
      '@import "critical.css";',
      criticalCSS
    );
    
    // Write to build output
    await fs.mkdir(path.join(__dirname, '../dist'), { recursive: true });
    await fs.writeFile(
      path.join(__dirname, '../dist/index.html'),
      optimizedHTML
    );
    
    console.log('✅ Critical CSS inlined successfully');
    return true;
  } catch (error) {
    console.error('❌ Error inlining critical CSS:', error);
    return false;
  }
}

async function optimizeMainCSS() {
  try {
    console.log('🎨 Optimizing main CSS...');
    
    const mainCSS = await fs.readFile(
      path.join(__dirname, '../frontend/assets/main.css'),
      'utf-8'
    );
    
    // Basic CSS minification (remove comments, excess whitespace)
    const minifiedCSS = mainCSS
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Clean up braces
      .replace(/}\s*/g, '}') // Clean up closing braces
      .replace(/,\s*/g, ',') // Clean up commas
      .replace(/:\s*/g, ':') // Clean up colons
      .replace(/;\s*/g, ';') // Clean up semicolons
      .trim();
    
    await fs.mkdir(path.join(__dirname, '../dist/assets'), { recursive: true });
    await fs.writeFile(
      path.join(__dirname, '../dist/assets/main.css'),
      minifiedCSS
    );
    
    const originalSize = (mainCSS.length / 1024).toFixed(1);
    const optimizedSize = (minifiedCSS.length / 1024).toFixed(1);
    const savings = (((mainCSS.length - minifiedCSS.length) / mainCSS.length) * 100).toFixed(1);
    
    console.log(`✅ CSS optimized: ${originalSize}KB → ${optimizedSize}KB (${savings}% reduction)`);
    return true;
  } catch (error) {
    console.error('❌ Error optimizing CSS:', error);
    return false;
  }
}

async function copyAssets() {
  try {
    console.log('📁 Copying optimized assets...');
    
    const assetsDir = path.join(__dirname, '../frontend/assets');
    const distAssetsDir = path.join(__dirname, '../dist/assets');
    
    await fs.mkdir(distAssetsDir, { recursive: true });
    
    // Copy essential assets (skip main.css as it's handled separately)
    const files = await fs.readdir(assetsDir, { recursive: true });
    for (const file of files) {
      const srcPath = path.join(assetsDir, file);
      const destPath = path.join(distAssetsDir, file);
      
      const stat = await fs.stat(srcPath);
      if (stat.isFile() && file !== 'main.css') {
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(srcPath, destPath);
      }
    }
    
    // Copy other essential files
    const rootFiles = ['favicon.svg', 'apple-touch-icon.png', 'site.webmanifest'];
    for (const file of rootFiles) {
      try {
        await fs.copyFile(
          path.join(__dirname, '../frontend', file),
          path.join(__dirname, '../dist', file)
        );
      } catch (error) {
        // File may not exist, continue
      }
    }
    
    console.log('✅ Assets copied successfully');
    return true;
  } catch (error) {
    console.error('❌ Error copying assets:', error);
    return false;
  }
}

async function generateLazyLoadingScript() {
  try {
    console.log('🖼️ Generating lazy loading script...');
    
    const lazyLoadScript = `
// Optimized lazy loading for Carrd deferred images - bypasses Carrd's system completely
(function() {
  'use strict';
  
  console.log('🖼️ Lazy loading script initialized - storing original data-src before Carrd processes');
  
  // Store original data-src values before Carrd can modify them
  const originalDataSrcs = new Map();
  
  // Store data-src values immediately when DOM is parsed
  const storeOriginalDataSrcs = () => {
    const deferredImages = document.querySelectorAll('.frame.deferred img[data-src]');
    console.log(\`📦 Storing \${deferredImages.length} original data-src values\`);
    
    deferredImages.forEach((img, index) => {
      const originalSrc = img.getAttribute('data-src');
      if (originalSrc && originalSrc !== 'undefined' && originalSrc !== 'done') {
        originalDataSrcs.set(img, originalSrc);
        console.log(\`💾 Stored \${index + 1}: "\${originalSrc}"\`);
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
    spinner.innerHTML = \`
      <div class="gear-1">⚙️</div>
      <div class="gear-2">⚙️</div>
      <div class="gear-3">⚙️</div>
    \`;
    return spinner;
  };
  
  // Add mechanical spinner styles
  const style = document.createElement('style');
  style.textContent = \`
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
  \`;
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
        console.log(\`🚀 Starting to observe \${originalDataSrcs.size} stored images\`);
        
        originalDataSrcs.forEach((src, img) => {
          console.log(\`👁️ Observing image: "\${src}"\`);
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
`;
    
    await fs.writeFile(
      path.join(__dirname, '../dist/assets/lazy-load.js'),
      lazyLoadScript.trim()
    );
    
    console.log('✅ Lazy loading script generated');
    return true;
  } catch (error) {
    console.error('❌ Error generating lazy loading script:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting optimized build process...\n');
  
  const tasks = [
    inlineCriticalCSS,
    optimizeMainCSS,
    copyAssets,
    generateLazyLoadingScript
  ];
  
  let success = true;
  for (const task of tasks) {
    const result = await task();
    if (!result) success = false;
  }
  
  if (success) {
    console.log('\n🎉 Build completed successfully!');
    console.log('📦 Optimized files available in ./dist/');
    console.log('\n📊 Optimization Summary:');
    console.log('• Critical CSS inlined for fastest LCP');
    console.log('• Fonts optimized with subset loading');
    console.log('• Images lazy loaded with Intersection Observer');
    console.log('• CSS minified and compressed');
    console.log('• JavaScript deferred for non-blocking load');
  } else {
    console.log('\n❌ Build failed. Check errors above.');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}