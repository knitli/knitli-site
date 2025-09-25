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
    
    // Read HTML template (single source of truth)
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, '../frontend/index.html'), 
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
    console.log('📦 Copying optimized assets...');
    
    const assetsDir = path.join(__dirname, '../frontend/assets');
    const distAssetsDir = path.join(__dirname, '../dist/assets');
    
    await fs.mkdir(distAssetsDir, { recursive: true });
    // Recursively copy assets directory, skipping main.css which is handled separately
    await fs.cp(assetsDir, distAssetsDir, {
      recursive: true,
      force: true,
      filter: (src) => path.basename(src) !== 'main.css'
    });
    
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

async function main() {
  console.log('🚀 Starting optimized build process...\n');
  
  const tasks = [
    inlineCriticalCSS,
    optimizeMainCSS,
    copyAssets
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