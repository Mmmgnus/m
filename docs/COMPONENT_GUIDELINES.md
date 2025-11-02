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

## Form Components: Light DOM Pattern

### Why Light DOM for Form Components?

Form components (buttons, inputs, checkboxes, etc.) use a **light DOM pattern** instead of shadow DOM to ensure:
1. ✅ Perfect label/input connections via `for` attribute
2. ✅ All ARIA attributes work without limitations
3. ✅ No cross-boundary ID reference issues
4. ✅ Native form behavior without compromises

### Form Component Template

```javascript
import { LitElement, html } from 'lit';

/**
 * A form input component that wraps a native input element.
 * Uses light DOM for perfect accessibility and label connections.
 *
 * @element m-input
 * @slot - Native <input> element
 *
 * @example
 * <m-input label="Email">
 *   <input type="email" name="email" required>
 * </m-input>
 */
export class MInput extends LitElement {
  static defaultTagName = 'm-input';

  static properties = {
    /**
     * Label text for the input
     * @type {string}
     */
    label: { type: String },
    
    /**
     * Error message to display
     * @type {string}
     */
    error: { type: String },
    
    /**
     * Help text for the input
     * @type {string}
     */
    help: { type: String },
  };

  constructor() {
    super();
    this.label = '';
    this.error = '';
    this.help = '';
  }

  /**
   * Render in light DOM (no shadow DOM).
   * This ensures labels can reference inputs via 'for' attribute.
   * @returns {this}
   */
  createRenderRoot() {
    return this;
  }

  /**
   * After first render, ensure input has ID and connect ARIA attributes
   */
  firstUpdated() {
    this._ensureInputId();
    this._connectAria();
  }

  /**
   * When properties update, reconnect ARIA attributes
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('error') || changedProperties.has('help')) {
      this._connectAria();
    }
    if (changedProperties.has('label')) {
      this._connectLabel();
    }
  }

  /**
   * Ensures the slotted input has a unique ID
   * @private
   */
  _ensureInputId() {
    const input = this.querySelector('input');
    if (!input) {
      console.warn('m-input: No <input> element found.');
      return;
    }
    
    if (!input.id) {
      input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * Connects label to input via 'for' attribute
   * @private
   */
  _connectLabel() {
    const input = this.querySelector('input');
    const label = this.querySelector('.m-input__label');
    
    if (label && input) {
      label.setAttribute('for', input.id);
    }
  }

  /**
   * Connects ARIA attributes to input
   * @private
   */
  _connectAria() {
    const input = this.querySelector('input');
    if (!input) return;
    
    const describedBy = [];
    
    if (this.error) {
      describedBy.push(`${input.id}-error`);
    }
    if (this.help) {
      describedBy.push(`${input.id}-help`);
    }
    
    if (describedBy.length) {
      input.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      input.removeAttribute('aria-describedby');
    }
  }

  render() {
    const inputId = this._getInputId();
    
    return html`
      <style>
        /* Component-scoped styles */
        .m-input {
          display: block;
        }
        
        .m-input__label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: var(--m-font-family, system-ui, sans-serif);
          font-size: var(--m-font-size-base, 1rem);
          font-weight: 500;
          color: var(--m-color-text, #333);
        }
        
        .m-input__wrapper {
          position: relative;
        }
        
        .m-input input {
          width: 100%;
          padding: var(--m-spacing-sm, 0.5rem);
          border: 1px solid var(--m-color-border, #ccc);
          border-radius: var(--m-border-radius, 0.25rem);
          font-family: var(--m-font-family, system-ui, sans-serif);
          font-size: var(--m-font-size-base, 1rem);
        }
        
        .m-input input:focus {
          outline: 2px solid var(--m-color-primary, #0066cc);
          outline-offset: 2px;
        }
        
        .m-input--error input {
          border-color: var(--m-color-error, #dc3545);
        }
        
        .m-input__error {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: var(--m-color-error, #dc3545);
        }
        
        .m-input__help {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: var(--m-color-text-secondary, #666);
        }
      </style>
      
      <div class="m-input ${this.error ? 'm-input--error' : ''}">
        ${this.label ? html`
          <label class="m-input__label">${this.label}</label>
        ` : ''}
        <div class="m-input__wrapper">
          <slot></slot>
        </div>
        ${this.error ? html`
          <div class="m-input__error" id="${inputId}-error">${this.error}</div>
        ` : ''}
        ${this.help ? html`
          <div class="m-input__help" id="${inputId}-help">${this.help}</div>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Gets the input ID (used during render)
   * @private
   */
  _getInputId() {
    const input = this.querySelector('input');
    return input?.id || '';
  }
}

export function register(tagName = MInput.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MInput);
  }
  return tagName;
}
```

### Key Differences for Form Components

1. **No Shadow DOM**:
   ```javascript
   createRenderRoot() {
     return this; // Render in light DOM
   }
   ```

2. **Inline Styles**:
   ```javascript
   render() {
     return html`
       <style>
         /* Scoped CSS using BEM naming */
         .m-component { /* styles */ }
       </style>
       <!-- content -->
     `;
   }
   ```

3. **Label Connection**:
   ```javascript
   _connectLabel() {
     const input = this.querySelector('input');
     const label = this.querySelector('.m-input__label');
     
     if (label && input) {
       label.setAttribute('for', input.id);
     }
   }
   ```

4. **ARIA Connection**:
   ```javascript
   _connectAria() {
     const input = this.querySelector('input');
     if (this.error) {
       input.setAttribute('aria-describedby', `${input.id}-error`);
     }
   }
   ```

### Form Component Usage

```html
<!-- Basic usage -->
<m-input label="Email">
  <input type="email" name="email" required>
</m-input>

<!-- With error message -->
<m-input label="Email" error="Please enter a valid email">
  <input type="email" name="email" required aria-invalid="true">
</m-input>

<!-- With help text -->
<m-input label="Password" help="Must be at least 8 characters">
  <input type="password" name="password" required>
</m-input>

<!-- External label (still works!) -->
<label for="custom-id">Custom Label</label>
<m-input>
  <input id="custom-id" type="text" name="field">
</m-input>
```

### When to Use Light DOM vs Shadow DOM

**Use Light DOM (no `createRenderRoot()` override) for:**
- ✅ Form components (button, input, checkbox, radio, select, textarea)
- ✅ Components that need label connections
- ✅ Components requiring external ARIA references
- ✅ Components where accessibility is critical

**Use Shadow DOM (default Lit behavior) for:**
- ✅ Purely presentational components (card, badge, avatar)
- ✅ Components with complex internal structure
- ✅ Components where style encapsulation is essential
- ✅ Non-interactive UI elements

### BEM Naming Convention for Light DOM

When using light DOM, use BEM to scope your styles:

```css
/* Block */
.m-component { }

/* Element */
.m-component__element { }

/* Modifier */
.m-component--modifier { }
.m-component__element--modifier { }
```

Example:
```css
.m-input { }                    /* Block */
.m-input__label { }             /* Element */
.m-input__wrapper { }           /* Element */
.m-input__error { }             /* Element */
.m-input--error { }             /* Modifier */
.m-input--error input { }       /* Modifier affecting child */
```

---

Following these guidelines ensures consistency across all M Design System components and makes them easy to understand, use, and maintain.
