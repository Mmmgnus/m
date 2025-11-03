/**
 * Generate CSS styles for documentation site
 * @returns {string}
 */
export function generateStyles() {
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
  margin-top: var(--spacing-lg);
}

.example-section {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-top: var(--spacing-md);
}

.example-section h4 {
  font-size: 1rem;
  margin: 0;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.example-section > p {
  padding: var(--spacing-sm) var(--spacing-md) 0;
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

.example-code {
  border-bottom: 1px solid var(--color-border);
}

.example-code summary {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.example-code summary:hover {
  background: #f3f4f6;
}

.example-code pre {
  margin: 0;
  border-radius: 0;
  border: none;
}

.example-code code {
  font-size: 0.85rem;
  line-height: 1.6;
}

.example-preview {
  padding: var(--spacing-lg);
  background: var(--color-bg);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  align-items: flex-start;
  position: relative;
}

.preview-label {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-light);
  opacity: 0.5;
  letter-spacing: 0.05em;
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
