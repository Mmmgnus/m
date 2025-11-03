import { layout } from './layout.js';
import { generateComponentExamples } from './examples.js';

/**
 * Generate index page with component list
 * @param {Array<Object>} components - Array of component data
 * @returns {string}
 */
export function generateIndexPage(components) {
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
 * Generate component detail page
 * @param {Object} component - Component data from CEM
 * @returns {string}
 */
export function generateComponentPage(component) {
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
