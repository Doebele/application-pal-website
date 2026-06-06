#!/usr/bin/env node

/**
 * Site Verification Script for DOEA-5
 * Takes screenshots and checks basic performance metrics
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://doebele.github.io/application-pal-website/';
const SCREENSHOT_DIR = path.join(__dirname, 'verification-screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Starting site verification...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Desktop screenshots
    console.log('📸 Taking desktop screenshot (1920x1080)...');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(SITE_URL, { waitUntil: 'networkidle2' });
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-homepage.png'),
      fullPage: true
    });
    console.log('✅ Desktop screenshot saved\n');
    
    // Mobile screenshots
    console.log('📱 Taking mobile screenshot (390x844 - iPhone 12 Pro)...');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(SITE_URL, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-homepage.png'),
      fullPage: true
    });
    console.log('✅ Mobile screenshot saved\n');
    
    // Performance metrics
    console.log('⚡ Gathering performance metrics...\n');
    
    await page.setViewport({ width: 390, height: 844 }); // Mobile viewport
    
    const performanceMetrics = await page.evaluate(() => {
      const perfData = window.performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        loadComplete: perfData.loadEventEnd - perfData.navigationStart,
        firstPaint: navigation ? navigation.domComplete : 0,
        domInteractive: perfData.domInteractive - perfData.navigationStart
      };
    });
    
    // Get page weight
    const metrics = await page.metrics();
    
    // Check resource counts
    const resourceCounts = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const counts = {
        js: 0,
        css: 0,
        image: 0,
        font: 0,
        total: resources.length
      };
      
      resources.forEach(r => {
        if (r.name.match(/\.js$/)) counts.js++;
        else if (r.name.match(/\.css$/)) counts.css++;
        else if (r.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) counts.image++;
        else if (r.name.match(/\.(woff|woff2|ttf|otf)$/)) counts.font++;
      });
      
      return counts;
    });
    
    console.log('📊 Performance Results:');
    console.log('─────────────────────────────────────');
    console.log(`DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`Page Load Complete: ${performanceMetrics.loadComplete}ms`);
    console.log(`DOM Interactive: ${performanceMetrics.domInteractive}ms`);
    console.log('');
    console.log('📦 Resources:');
    console.log(`  JavaScript files: ${resourceCounts.js}`);
    console.log(`  CSS files: ${resourceCounts.css}`);
    console.log(`  Images: ${resourceCounts.image}`);
    console.log(`  Fonts: ${resourceCounts.font}`);
    console.log(`  Total resources: ${resourceCounts.total}`);
    console.log('─────────────────────────────────────\n');
    
    // Check for best practices
    console.log('✨ Best Practices Check:');
    console.log('─────────────────────────────────────');
    
    const checks = await page.evaluate(() => {
      return {
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasTitle: !!document.title,
        hasMetaDescription: !!document.querySelector('meta[name="description"]'),
        hasOgTags: !!document.querySelector('meta[property^="og:"]'),
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        hasLangAttr: !!document.documentElement.lang,
        usesHTTPS: location.protocol === 'https:'
      };
    });
    
    console.log(`✅ Viewport meta tag: ${checks.hasViewportMeta ? 'Present' : 'Missing'}`);
    console.log(`✅ Title tag: ${checks.hasTitle ? 'Present' : 'Missing'}`);
    console.log(`✅ Meta description: ${checks.hasMetaDescription ? 'Present' : 'Missing'}`);
    console.log(`✅ Open Graph tags: ${checks.hasOgTags ? 'Present' : 'Missing'}`);
    console.log(`✅ Canonical link: ${checks.hasCanonical ? 'Present' : 'Missing'}`);
    console.log(`✅ Language attribute: ${checks.hasLangAttr ? 'Present' : 'Missing'}`);
    console.log(`✅ HTTPS: ${checks.usesHTTPS ? 'Enabled' : 'Disabled'}`);
    console.log('─────────────────────────────────────\n');
    
    // Estimate Lighthouse score based on metrics
    let estimatedScore = 100;
    if (performanceMetrics.domContentLoaded > 2500) estimatedScore -= 10;
    if (performanceMetrics.loadComplete > 4000) estimatedScore -= 10;
    if (resourceCounts.total > 30) estimatedScore -= 5;
    if (resourceCounts.js > 5) estimatedScore -= 5;
    
    console.log(`📈 Estimated Performance Score: ${estimatedScore}/100`);
    console.log('   (Based on load times and resource counts)\n');
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      url: SITE_URL,
      viewport: {
        desktop: { width: 1920, height: 1080 },
        mobile: { width: 390, height: 844 }
      },
      performance: performanceMetrics,
      resources: resourceCounts,
      bestPractices: checks,
      estimatedScore: estimatedScore,
      screenshots: {
        desktop: 'verification-screenshots/desktop-homepage.png',
        mobile: 'verification-screenshots/mobile-homepage.png'
      }
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'verification-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('✅ Verification complete!');
    console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log('📄 Report saved to: verification-report.json\n');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
