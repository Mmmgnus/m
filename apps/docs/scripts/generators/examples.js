/**
 * Generate component examples section from CEM data
 * @param {Object} component - Component data from CEM
 * @returns {string}
 */
export function generateComponentExamples(component) {
  // If component has examples in CEM, use them
  if (component.examples && component.examples.length > 0) {
    return generateExamplesFromCEM(component.examples);
  }

  // Otherwise, generate basic example
  return generateBasicExample(component);
}

/**
 * Generate examples from CEM @example tags
 * @param {Array<Object>} examples - Examples from CEM
 * @returns {string}
 */
function generateExamplesFromCEM(examples) {
  const sections = examples.map((example, index) => {
    const titleHtml = example.title ? `<h4>${example.title}</h4>` : '';
    const descriptionHtml = example.description ? `<p>${example.description}</p>` : '';
    
    // Escape HTML for code display
    const escapedCode = escapeHtml(example.code);
    
    return `
      ${index === 0 ? '<section class="example"><h3>Examples</h3>' : ''}
      <div class="example-section">
        ${titleHtml}
        ${descriptionHtml}
        
        <details class="example-code" open>
          <summary>Code</summary>
          <pre><code class="language-html">${escapedCode}</code></pre>
        </details>
        
        <div class="example-preview">
          <div class="preview-label">Preview</div>
          ${example.code}
        </div>
      </div>
    `;
  }).join('\n');

  return sections + '</section>';
}

/**
 * Escape HTML for display in code blocks
 * @param {string} html - HTML to escape
 * @returns {string}
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate basic example when no @example tags exist
 * @param {Object} component - Component data
 * @returns {string}
 */
function generateBasicExample(component) {
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
