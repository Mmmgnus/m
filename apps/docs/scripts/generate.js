#!/usr/bin/env node

import { readFile, writeFile, mkdir, cp } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const COMPONENTS_DIR = join(ROOT_DIR, '../../packages/components');

/**
 * Read and parse the Custom Elements Manifest
 * @returns {Promise<Object>}
 */
async function readCEM() {
  const cemPath = join(COMPONENTS_DIR, 'custom-elements.json');
  const content = await readFile(cemPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Extract component information from CEM
 * @param {Object} cem - Custom Elements Manifest
 * @returns {Array<Object>}
 */
function extractComponents(cem) {
  const components = [];
  
  for (const module of cem.modules) {
    for (const declaration of module.declarations || []) {
      if (declaration.customElement && declaration.tagName) {
        components.push({
          tagName: declaration.tagName,
          name: declaration.name,
          description: declaration.description || '',
          path: module.path,
          attributes: declaration.attributes || [],
          slots: declaration.slots || [],
          members: declaration.members || []
        });
      }
    }
  }
  
  return components;
}

/**
 * Generate HTML layout
 * @param {string} title - Page title
 * @param {string} content - Page content
 * @returns {string}
 */
function layout(title, content, includeComponents = false) {
  const importMap = includeComponents ? `
  <script type="importmap">
    {
      "imports": {
        "lit": "https://cdn.jsdelivr.net/npm/lit@3.0.0/index.js",
        "lit/": "https://cdn.jsdelivr.net/npm/lit@3.0.0/",
        "@lit/reactive-element": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.0/reactive-element.js",
        "@lit/reactive-element/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.0/",
        "lit-html": "https://cdn.jsdelivr.net/npm/lit-html@3.0.0/lit-html.js",
        "lit-html/": "https://cdn.jsdelivr.net/npm/lit-html@3.0.0/",
        "lit-element/lit-element.js": "https://cdn.jsdelivr.net/npm/lit-element@4.0.0/lit-element.js",
        "@lwc/aria-reflection": "https://cdn.jsdelivr.net/npm/@lwc/aria-reflection@8.23.0/+esm",
        "@frdh/m-components/": "/components-src/"
      }
    }
  </script>` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - M Design System</title>
  <link rel="stylesheet" href="/styles.css">${importMap}
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1><a href="/">M Design System</a></h1>
      <nav>
        <a href="/">Components</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    ${content}
  </main>
  
  <footer class="site-footer">
    <div class="container">
      <p>M Design System - A no-build, standards-first design system</p>
    </div>
  </footer>
</body>
</html>`;
}

/**
 * Generate index page with component list
 * @param {Array<Object>} components
 * @returns {string}
 */
function generateIndexPage(components) {
  const componentsList = components.map(comp => `
    <div class="component-card">
      <h3><a href="/components/${comp.tagName}.html">&lt;${comp.tagName}&gt;</a></h3>
      <p>${comp.description}</p>
    </div>
  `).join('');
  
  const content = `
    <div class="hero">
      <h2>M Design System</h2>
      <p>A no-build, standards-first design system built with native Web Components and Lit.</p>
    </div>
    
    <section class="components-section">
      <h2>Components</h2>
      <div class="components-grid">
        ${componentsList || '<p>No components available yet.</p>'}
      </div>
    </section>
  `;
  
  return layout('Home', content);
}

/**
 * Generate component-specific examples
 * @param {Object} component
 * @returns {string}
 */
function generateComponentExamples(component) {
  // Special case for button component
  if (component.tagName === 'm-button') {
    return `
      <section>
        <h3>Usage</h3>
        <p>The button component uses shadow DOM with slots - wrap a native <code>&lt;button&gt;</code> element:</p>
        <pre><code>&lt;m-button variant="primary"&gt;
  &lt;button type="button"&gt;Click me&lt;/button&gt;
&lt;/m-button&gt;</code></pre>
      </section>
      
      <section class="example">
        <h3>Live Examples</h3>
        
        <h4>Variants</h4>
        <div class="example-preview">
          <m-button>
            <button type="button">Default</button>
          </m-button>
          <m-button variant="primary">
            <button type="button">Primary</button>
          </m-button>
          <m-button variant="secondary">
            <button type="button">Secondary</button>
          </m-button>
          <m-button variant="outline">
            <button type="button">Outline</button>
          </m-button>
        </div>
        
        <h4>Sizes</h4>
        <div class="example-preview">
          <m-button size="small" variant="primary">
            <button type="button">Small</button>
          </m-button>
          <m-button size="medium" variant="primary">
            <button type="button">Medium</button>
          </m-button>
          <m-button size="large" variant="primary">
            <button type="button">Large</button>
          </m-button>
        </div>
        
        <h4>States</h4>
        <div class="example-preview">
          <m-button variant="primary">
            <button type="button">Enabled</button>
          </m-button>
          <m-button variant="primary">
            <button type="button" disabled>Disabled</button>
          </m-button>
        </div>
        
        <h4>Accessibility (ARIA)</h4>
        <div class="example-preview" style="flex-direction: column; align-items: flex-start;">
          <div style="margin-bottom: 1rem;">
            <span id="save-help" style="font-size: 0.875rem; color: #666; display: block; margin-bottom: 0.5rem;">
              Save your changes to the document
            </span>
            <m-button variant="primary">
              <button type="button" aria-describedby="save-help">Save Document</button>
            </m-button>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label for="delete-btn" style="font-size: 0.875rem; color: #666; display: block; margin-bottom: 0.5rem;">
              Permanently delete this item
            </label>
            <m-button variant="secondary">
              <button id="delete-btn" type="button" aria-label="Delete item permanently">Delete</button>
            </m-button>
          </div>
          
          <div>
            <m-button variant="outline">
              <button type="button" aria-pressed="false" onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); this.textContent = this.getAttribute('aria-pressed') === 'true' ? 'Starred ★' : 'Star ☆';">Star ☆</button>
            </m-button>
          </div>
        </div>
        
        <h4>Form Integration</h4>
        <div class="example-preview">
          <form onsubmit="alert('Form submitted!'); return false;" style="display: flex; gap: 0.5rem;">
            <m-button variant="outline">
              <button type="reset">Reset</button>
            </m-button>
            <m-button variant="primary">
              <button type="submit">Submit Form</button>
            </m-button>
          </form>
        </div>
      </section>`;
  }
  
  // Special case for input component
  if (component.tagName === 'm-input') {
    return `
      <section>
        <h3>Usage</h3>
        <p>The input component uses shadow DOM with slots - wrap a native <code>&lt;input&gt;</code> element:</p>
        <pre><code>&lt;m-input label="Email" required&gt;
  &lt;input type="email" name="email"&gt;
&lt;/m-input&gt;</code></pre>
      </section>
      
      <section class="example">
        <h3>Live Examples</h3>
        
        <h4>Basic Input</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px;">
          <m-input label="Email" required>
            <input type="email" name="email" placeholder="you@example.com">
          </m-input>
        </div>
        
        <h4>With Help Text</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px;">
          <m-input label="Password" help="Must be at least 8 characters">
            <input type="password" name="password">
          </m-input>
        </div>
        
        <h4>With Error</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px;">
          <m-input label="Username" error="This username is already taken">
            <input type="text" name="username" value="john">
          </m-input>
        </div>
        
        <h4>Sizes</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px; gap: 1rem;">
          <m-input label="Small" size="small">
            <input type="text" placeholder="Small input">
          </m-input>
          <m-input label="Medium (default)" size="medium">
            <input type="text" placeholder="Medium input">
          </m-input>
          <m-input label="Large" size="large">
            <input type="text" placeholder="Large input">
          </m-input>
        </div>
        
        <h4>Disabled</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px;">
          <m-input label="Disabled Field">
            <input type="text" value="Cannot edit" disabled>
          </m-input>
        </div>
        
        <h4>Accessibility (ARIA)</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px; gap: 1rem;">
          <div>
            <span id="email-desc" style="font-size: 0.875rem; color: #666; display: block; margin-bottom: 0.5rem;">
              Your primary contact email for notifications
            </span>
            <m-input label="Email">
              <input type="email" name="email" aria-describedby="email-desc">
            </m-input>
          </div>
          
          <m-input label="Name">
            <input type="text" name="name" aria-label="Full legal name as it appears on your ID">
          </m-input>
          
          <m-input>
            <label slot="label" for="custom-input">Custom Label with <strong>HTML</strong></label>
            <input id="custom-input" type="text" name="custom">
          </m-input>
        </div>
        
        <h4>Form Integration</h4>
        <div class="example-preview" style="flex-direction: column; align-items: stretch; max-width: 400px;">
          <form onsubmit="alert('Form submitted!'); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
            <m-input label="Full Name" required>
              <input type="text" name="name" required>
            </m-input>
            <m-input label="Email Address" required help="We'll never share your email">
              <input type="email" name="email" required>
            </m-input>
            <div style="display: flex; gap: 0.5rem;">
              <m-button variant="outline">
                <button type="reset">Reset</button>
              </m-button>
              <m-button variant="primary">
                <button type="submit">Submit</button>
              </m-button>
            </div>
          </form>
        </div>
      </section>`;
  }
  
  // Default usage example for other components
  return `
    <section>
      <h3>Usage</h3>
      <pre><code>&lt;${component.tagName}&gt;Content&lt;/${component.tagName}&gt;</code></pre>
    </section>
    
    <section class="example">
      <h3>Live Example</h3>
      <div class="example-preview">
        <${component.tagName}>Example</${component.tagName}>
      </div>
    </section>`;
}

/**
 * Generate component detail page
 * @param {Object} component
 * @returns {string}
 */
function generateComponentPage(component) {
  const attributes = component.attributes.length > 0 ? `
    <section>
      <h3>Properties</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Attribute</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${component.attributes.map(attr => `
            <tr>
              <td><code>${attr.fieldName || attr.name}</code></td>
              <td><code>${attr.name}</code></td>
              <td><code>${attr.type?.text || 'unknown'}</code></td>
              <td>${attr.description || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  ` : '';
  
  const slots = component.slots.length > 0 ? `
    <section>
      <h3>Slots</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${component.slots.map(slot => `
            <tr>
              <td><code>${slot.name || '(default)'}</code></td>
              <td>${slot.description || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  ` : '';
  
  const componentImportName = component.tagName.split('-').map((part, i) => 
    i === 0 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  const content = `
    <nav class="breadcrumb">
      <a href="/">Home</a> / <span>${component.tagName}</span>
    </nav>
    
    <article class="component-detail">
      <h2>&lt;${component.tagName}&gt;</h2>
      <p class="lead">${component.description}</p>
      
      <section>
        <h3>Installation</h3>
        <pre><code>import { ${component.name}, register } from '@frdh/m-components/${component.tagName.replace('m-', '')}';
register();</code></pre>
      </section>
      
      ${generateComponentExamples(component)}
      
      ${attributes}
      ${slots}
      
      <section>
        <h3>Source</h3>
        <p><code>${component.path}</code></p>
      </section>
    </article>
    
    <script type="module">
      import '/components-src/auto-register.js';
    </script>
  `;
  
  return layout(component.tagName, content, true);
}

/**
 * Generate CSS styles
 * @returns {string}
 */
function generateStyles() {
  return `* {
  box-sizing: border-box;
}

:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-border: #e5e7eb;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-text);
  line-height: 1.6;
  background: var(--color-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Header */
.site-header {
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
  background: var(--color-bg);
}

.site-header h1 {
  margin: 0;
  font-size: 1.5rem;
  display: inline-block;
}

.site-header h1 a {
  color: var(--color-text);
  text-decoration: none;
}

.site-header nav {
  display: inline-block;
  margin-left: var(--spacing-lg);
}

.site-header nav a {
  color: var(--color-text-light);
  text-decoration: none;
  margin-left: var(--spacing-md);
}

.site-header nav a:hover {
  color: var(--color-primary);
}

/* Hero */
.hero {
  padding: var(--spacing-xl) 0;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.hero h2 {
  font-size: 2.5rem;
  margin: 0 0 var(--spacing-sm);
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin: 0;
}

/* Components Grid */
.components-section {
  padding: var(--spacing-xl) 0;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.component-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--spacing-md);
  transition: box-shadow 0.2s;
}

.component-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.component-card h3 {
  margin: 0 0 var(--spacing-sm);
}

.component-card h3 a {
  color: var(--color-primary);
  text-decoration: none;
}

.component-card h3 a:hover {
  text-decoration: underline;
}

.component-card p {
  margin: 0;
  color: var(--color-text-light);
}

/* Component Detail */
.breadcrumb {
  padding: var(--spacing-md) 0;
  color: var(--color-text-light);
}

.breadcrumb a {
  color: var(--color-primary);
  text-decoration: none;
}

.component-detail {
  padding-bottom: var(--spacing-xl);
}

.component-detail h2 {
  font-size: 2rem;
  margin: 0 0 var(--spacing-sm);
}

.component-detail .lead {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-lg);
}

.component-detail section {
  margin-top: var(--spacing-lg);
}

.component-detail h3 {
  font-size: 1.5rem;
  margin: 0 0 var(--spacing-sm);
}

/* Code */
code {
  font-family: var(--font-mono);
  background: var(--color-bg-secondary);
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  font-size: 0.9em;
}

pre {
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: 8px;
  overflow-x: auto;
}

pre code {
  background: none;
  padding: 0;
}

/* API Table */
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-sm);
}

.api-table th,
.api-table td {
  text-align: left;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.api-table th {
  font-weight: 600;
  background: var(--color-bg-secondary);
}

/* Example */
.example {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-top: var(--spacing-lg);
}

.example h4 {
  font-size: 1rem;
  margin: var(--spacing-md) 0 var(--spacing-sm);
  color: var(--color-text-light);
  font-weight: 500;
}

.example h4:first-of-type {
  margin-top: 0;
}

.example-preview {
  padding: var(--spacing-lg);
  background: var(--color-bg);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  align-items: center;
}

.example-preview + h4 {
  margin-top: var(--spacing-lg);
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  margin-top: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-light);
}

.site-footer p {
  margin: 0;
}`;
}

/**
 * Main generation function
 */
async function generate() {
  console.log('📚 Generating M Design System documentation...\n');
  
  // Read CEM
  console.log('Reading Custom Elements Manifest...');
  const cem = await readCEM();
  const components = extractComponents(cem);
  console.log(`Found ${components.length} component(s)\n`);
  
  // Create dist directory
  await mkdir(DIST_DIR, { recursive: true });
  await mkdir(join(DIST_DIR, 'components'), { recursive: true });
  
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
