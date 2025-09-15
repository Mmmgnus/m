# Component Guidelines

This guide walks through creating new components for M Design System, following established patterns and conventions.

## Creating a New Component

### 1. Directory Structure
Create a new directory under `packages/components/src/` with your component name:

```bash
mkdir packages/components/src/[component-name]
```

Example:
```bash
mkdir packages/components/src/input
```

### 2. Component File Structure

Each component directory should contain:
```
component-name/
├── m-component-name.js    # Component implementation
└── component-name.md      # Usage documentation (optional)
```

### 3. Component Implementation Template

Use this template for `m-component-name.js`:

```javascript
import { LitElement, html, css } from 'lit';

/**
 * Brief description of what the component does
 *
 * @element m-component-name
 * @slot - Default slot description
 * @slot named-slot - Named slot description (if applicable)
 *
 * @example
 * ```html
 * <m-component-name attribute="value">
 *   Content here
 * </m-component-name>
 * ```
 */
export class MComponentName extends LitElement {
  static defaultTagName = 'm-component-name';

  static styles = css`
    :host {
      display: block;
      /* Base host styles */
    }

    /* Component-specific styles */
  `;

  static properties = {
    /**
     * Property description
     * @type {string}
     */
    propertyName: { type: String, attribute: 'property-name' },

    /**
     * Boolean property description
     * @type {boolean}
     */
    booleanProp: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    // Initialize default values
    this.propertyName = '';
    this.booleanProp = false;
  }

  render() {
    return html`
      <!-- Component template -->
      <slot></slot>
    `;
  }
}

/**
 * Register the component with the custom elements registry
 * @param {string} [tagName=MComponentName.defaultTagName] - The tag name to register
 * @returns {string} The registered tag name
 */
export function register(tagName = MComponentName.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MComponentName);
  }
  return tagName;
}
```

## Component Naming Conventions

### File Names
- Component file: `m-component-name.js` (kebab-case with `m-` prefix)
- Class name: `MComponentName` (PascalCase with `M` prefix)
- Tag name: `m-component-name` (kebab-case with `m-` prefix)

### Properties and Attributes
- **Properties**: camelCase in JavaScript (`propertyName`)
- **Attributes**: kebab-case in HTML (`property-name`)
- **Boolean attributes**: Use `reflect: true` for CSS styling

## JSDoc Requirements

### Component Class Documentation
```javascript
/**
 * Brief component description (one line)
 *
 * Longer description with usage details, behavior notes, etc.
 *
 * @element m-component-name
 * @slot - Default slot description
 * @slot named-slot - Named slot description
 *
 * @fires component-event - Description of when this event fires
 *
 * @csspart part-name - Description of CSS part for styling
 *
 * @example
 * ```html
 * <m-component-name attribute="value">
 *   Content
 * </m-component-name>
 * ```
 */
```

### Property Documentation
```javascript
static properties = {
  /**
   * Property description explaining purpose and usage
   * @type {string}
   * @default 'default-value'
   */
  propertyName: { type: String, attribute: 'property-name' },
};
```

## Styling Guidelines

### Host Styles
Always include basic host styles:
```css
:host {
  display: block; /* or inline-block, flex, etc. */
  box-sizing: border-box;
}
```

### Component-Specific Styles
- Use CSS custom properties for themeable values
- Avoid hardcoded colors/sizes when possible
- Consider responsive design patterns
- Use logical properties (margin-inline, padding-block, etc.)

### CSS Parts (Advanced)
For complex components, expose styling hooks:
```css
.internal-element {
  /* styles */
}
```

```javascript
render() {
  return html`
    <div part="container" class="internal-element">
      <!-- content -->
    </div>
  `;
}
```

## Event Handling

### Custom Events
Use descriptive, prefixed event names:
```javascript
this.dispatchEvent(new CustomEvent('m-component-action', {
  detail: { /* event data */ },
  bubbles: true
}));
```

### Event Documentation
Document all custom events in JSDoc:
```javascript
/**
 * @fires m-component-action - Fired when user performs action
 */
```

## Adding to Package Exports

After creating your component, update `packages/components/package.json`:

```json
{
  "exports": {
    "./button": "./src/button/m-button.js",
    "./input": "./src/input/m-input.js",
    "./your-component": "./src/your-component/m-your-component.js",
    "./auto-register": "./src/auto-register.js"
  }
}
```

## Adding to Auto-Register

Update `packages/components/src/auto-register.js`:

```javascript
import { register as registerButton } from './button/m-button.js';
import { register as registerInput } from './input/m-input.js';
import { register as registerYourComponent } from './your-component/m-your-component.js';

// Auto-register all components with default names
registerButton();
registerInput();
registerYourComponent();

// Export for convenience
export { MButton } from './button/m-button.js';
export { MInput } from './input/m-input.js';
export { MYourComponent } from './your-component/m-your-component.js';
```

## Testing Your Component

### Manual Testing
Create a simple HTML file to test your component:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test M Component</title>
</head>
<body>
  <m-your-component attribute="test">
    Test content
  </m-your-component>

  <script type="module">
    import { register } from '../packages/components/src/your-component/m-your-component.js';
    register();
  </script>
</body>
</html>
```

### Regenerate Documentation
After creating your component, update the manifest:

```bash
npm run build
```

This will:
1. Generate TypeScript definitions
2. Update the Custom Elements Manifest
3. Make your component available for documentation generation

## Common Patterns

### Forwarding Attributes
```javascript
render() {
  return html`
    <input
      ?disabled=${this.disabled}
      .value=${this.value}
      @input=${this._handleInput}
    />
  `;
}
```

### Slot Change Detection
```javascript
_handleSlotChange(e) {
  const slot = e.target;
  const assignedNodes = slot.assignedNodes();
  // React to slot content changes
}

render() {
  return html`
    <slot @slotchange=${this._handleSlotChange}></slot>
  `;
}
```

### Conditional Rendering
```javascript
render() {
  return html`
    ${this.showIcon ? html`<icon-element></icon-element>` : ''}
    <slot></slot>
  `;
}
```

Following these guidelines ensures consistency across all M Design System components and makes them easy to understand, use, and maintain.
