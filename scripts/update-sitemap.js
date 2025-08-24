#!/usr/bin/env node

/**
 * Script to update sitemap.xml with current date
 * Run this script whenever you want to update the lastmod dates in your sitemap
 * Usage: node scripts/update-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

try {
  // Read the current sitemap
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Get current date in ISO format (YYYY-MM-DD)
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Update all lastmod dates to current date
  sitemap = sitemap.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${currentDate}</lastmod>`
  );
  
  // Write the updated sitemap back
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log(`✅ Sitemap updated successfully with date: ${currentDate}`);
  console.log(`📍 Updated file: ${sitemapPath}`);
  
} catch (error) {
  console.error('❌ Error updating sitemap:', error.message);
  process.exit(1);
}
