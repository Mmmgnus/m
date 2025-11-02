# Approach 1: Custom Button Implementation - Specification

## Overview

You are building a **fully custom button web component** using Lit. This button is built **from scratch** and does NOT wrap a native `<button>` element. You must manually implement all button behaviors to match native button functionality.

## Implementation Requirements

### Core Functionality

**Element**: Implement as `<m-button-custom>`

Your component must:
1. Render a styled container (likely a `<div>` or use the host element)
2. Handle all keyboard interactions manually
3. Implement form association manually (if possible)
4. Manage focus states
5. Apply ARIA attributes appropriately
6. Support all button types (button, submit, reset)

### Properties & Attributes

Implement these properties with TypeScript JSDoc annotations:

```javascript
/**
 * The type of button
 * @type {'button' | 'submit' | 'reset'}
 * @default 'submit'
 */
type = 'submit';

/**
 * Whether the button is disabled
 * @type {boolean}
 * @default false
 */
disabled = false;

/**
 * Accessible label for the button
 * @type {string}
 */
ariaLabel = '';

/**
 * ID of element that labels this button
 * @type {string}
 */
ariaLabelledby = '';

/**
 * ID of element that describes this button
 * @type {string}
 */
ariaDescribedby = '';
```

### Keyboard Handling

You MUST implement keyboard event handlers:

- **Space key** - Activate the button (fire click)
- **Enter key** - Activate the button (fire click)
- Prevent default behavior on Space to avoid page scroll
- Ensure disabled buttons don't respond to keyboard

### Focus Management

- Make the element focusable with `tabindex="0"`
- When disabled, remove from tab order with `tabindex="-1"`
- Ensure focus styles are visible

### Form Integration

This is challenging without ElementInternals (Safari support varies). Attempt to:
- Listen for click events
- Find parent form using `this.closest('form')`
- Manually trigger form submission/reset based on type
- Note limitations in your JSDoc

### ARIA Implementation

Set appropriate ARIA attributes:
- `role="button"` on the host element
- `aria-disabled="true"` when disabled (not the disabled attribute)
- Apply `aria-label`, `aria-labelledby`, `aria-describedby` if provided
- Ensure text content is accessible

### Styling

Use **design tokens** (CSS custom properties):

```css
:host {
  /* Layout */
  display: inline-block;
  
  /* Design tokens */
  --button-bg: var(--m-color-primary, #0066cc);
  --button-bg-hover: var(--m-color-primary-hover, #0052a3);
  --button-text: var(--m-color-text, white);
  --button-font-family: var(--m-font-family, system-ui, sans-serif);
  --button-font-size: var(--m-font-size-base, 1rem);
  --button-padding-block: var(--m-spacing-sm, 0.5rem);
  --button-padding-inline: var(--m-spacing-md, 1rem);
  --button-border-radius: var(--m-border-radius, 0.25rem);
  --button-transition: var(--m-transition-duration, 0.2s);
}

.button {
  background: var(--button-bg);
  color: var(--button-text);
  font-family: var(--button-font-family);
  /* ... etc */
}

.button:hover:not(.disabled) {
  background: var(--button-bg-hover);
}

.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Component Structure

Follow the M Design System pattern:

```javascript
import { LitElement, html, css } from 'lit';

/**
 * A custom button component built from scratch.
 * 
 * This implementation does not use a native button element.
 * All button behaviors are implemented manually.
 * 
 * @element m-button-custom
 * @fires click - Fires when the button is activated
 * @slot - Button content (text, icons, etc.)
 */
export class MButtonCustom extends LitElement {
  static defaultTagName = 'm-button-custom';
  
  static properties = {
    type: { type: String },
    disabled: { type: Boolean, reflect: true },
    ariaLabel: { type: String, attribute: 'aria-label' },
    // ... other properties
  };
  
  static styles = css`/* styles */`;
  
  constructor() {
    super();
    // Initialize properties
  }
  
  connectedCallback() {
    super.connectedCallback();
    // Setup if needed
  }
  
  /**
   * Handles keyboard events
   */
  _handleKeyDown(e) {
    // Implement Space and Enter handling
  }
  
  /**
   * Handles click events
   */
  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Handle form submission/reset based on type
  }
  
  render() {
    return html`
      <div
        class="button ${this.disabled ? 'disabled' : ''}"
        role="button"
        tabindex="${this.disabled ? -1 : 0}"
        aria-label="${this.ariaLabel || nothing}"
        aria-disabled="${this.disabled}"
        @click="${this._handleClick}"
        @keydown="${this._handleKeyDown}"
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * Register the component
 */
export function register(tagName = MButtonCustom.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonCustom);
  }
  return tagName;
}
```

## Known Challenges

Document these limitations:
1. **Form association** - May not work with FormData API like native buttons
2. **Form validation** - May not trigger built-in form validation
3. **Implicit submission** - Enter in form fields may not work the same way
4. **Browser defaults** - Missing subtle native button behaviors

## Testing Focus

After implementation, test:
- ✅ Keyboard navigation (Tab, Space, Enter)
- ✅ Focus management
- ✅ ARIA attributes in accessibility tree
- ✅ Form submission (may be limited)
- ✅ Design token application
- ✅ Disabled state behavior

## File Deliverable

Create: `/packages/components/src/button-evaluation/approach-1-custom/m-button-custom.js`

Make it a complete, working implementation ready for evaluation testing.
