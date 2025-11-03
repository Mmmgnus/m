#!/usr/bin/env node

import { writeFile, mkdir, cp } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readCEM, extractComponents } from './utils/cem.js';
import { generateIndexPage, generateComponentPage } from './generators/pages.js';
import { generateStyles } from './generators/styles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const COMPONENTS_DIR = join(ROOT_DIR, '../../packages/components');

/**
 * Main generation function
 */
async function generate() {
  console.log('📚 Generating M Design System documentation...\n');

  // Read CEM
  console.log('Reading Custom Elements Manifest...');
  const cem = await readCEM(COMPONENTS_DIR);
  const components = extractComponents(cem);
  console.log(`Found ${components.length} component(s)\n`);

  // Create dist directory
  await mkdir(DIST_DIR, { recursive: true });
  await mkdir(join(DIST_DIR, 'components'), { recursive: true });
  await mkdir(join(DIST_DIR, 'examples'), { recursive: true });

  // Generate index page
  console.log('Generating index page...');
  const indexHtml = generateIndexPage(components);
  await writeFile(join(DIST_DIR, 'index.html'), indexHtml);

  // Generate component pages
  for (const component of components) {
    console.log(`Generating page for <${component.tagName}>...`);
    const componentHtml = generateComponentPage(component);
    await writeFile(
      join(DIST_DIR, 'components', `${component.tagName}.html`),
      componentHtml
    );
  }

  // Generate styles
  console.log('Generating styles...');
  const styles = generateStyles();
  await writeFile(join(DIST_DIR, 'styles.css'), styles);

  // Copy components for live examples
  console.log('Copying component source files...');
  try {
    await cp(
      join(COMPONENTS_DIR, 'src'),
      join(DIST_DIR, 'components-src'),
      { recursive: true }
    );
  } catch (err) {
    console.warn('Warning: Could not copy component sources:', err.message);
  }

  // Copy examples
  console.log('Copying examples...');
  try {
    const examplesDir = join(ROOT_DIR, 'src', 'examples');
    await cp(
      examplesDir,
      join(DIST_DIR, 'examples'),
      { recursive: true }
    );
  } catch (err) {
    console.warn('Warning: Could not copy examples:', err.message);
  }

  console.log('\n✅ Documentation generated successfully!');
  console.log(`📂 Output: ${DIST_DIR}`);
  console.log('\n💡 To view the documentation:');
  console.log('   npm run serve');
}

// Run generation
generate().catch(err => {
  console.error('❌ Error generating documentation:', err);
  process.exit(1);
});
