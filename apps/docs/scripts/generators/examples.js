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
    
    return `
      ${index === 0 ? '<section class="example"><h3>Live Examples</h3>' : ''}
      ${titleHtml}
      ${descriptionHtml}
      <div class="example-preview">
        ${example.code}
      </div>
    `;
  }).join('\n');

  return sections + '</section>';
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
