/**
 * Generate HTML layout
 * @param {string} title - Page title
 * @param {string} content - Page content
 * @param {boolean} includeComponents - Whether to include component imports
 * @returns {string}
 */
export function layout(title, content, includeComponents = false) {
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
        <a href="/examples">Examples</a>
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
