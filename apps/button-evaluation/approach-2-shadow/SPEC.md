# Approach 2: Native Button in Shadow DOM - Specification

## Overview

You are building a button web component that **wraps a native `<button>` element inside the shadow DOM**. The component's shadow root contains the actual button, and you manage its attributes and styling through your Lit component.

## Implementation Requirements

### Core Functionality

**Element**: Implement as `<m-button-shadow>`

Your component must:
1. Render a native `<button>` element inside the shadow DOM
2. Synchronize component properties to button attributes
3. Forward events from the internal button
4. Style the button using design tokens
5. Ensure accessibility attributes are properly applied

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

/**
 * Form ID to associate with (if needed)
 * @type {string}
 */
form = '';
```

### Shadow DOM Structure

Your shadow DOM should contain:
- A native `<button>` element
- The button receives all attributes (type, disabled, aria-*)
- A `<slot>` for button content

### Form Integration

**Challenge**: Buttons in shadow DOM may not automatically participate in form submission.

Strategies to try:
1. Use the `form` attribute on the internal button (references form by ID)
2. Consider using `ElementInternals` API if supported
3. Manually handle form submission via click event delegation

### Focus Delegation

Use `delegatesFocus: true` in your shadow root options:

```javascript
constructor() {
  super();
  // delegatesFocus forwards focus to the first focusable element
}

static shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
```

This ensures that when the component receives focus, it's delegated to the internal button.

### ARIA Implementation

Apply ARIA attributes directly to the native button element:
- `aria-label` if provided
- `aria-labelledby` if provided
- `aria-describedby` if provided
- Native button already has implicit `role="button"`

### Styling

Use **design tokens** and style the internal button:

```css
:host {
  display: inline-block;
  /* Custom properties for theming */
}

button {
  /* Reset default button styles */
  border: none;
  margin: 0;
  padding: 0;
  background: none;
  font: inherit;
  cursor: pointer;
  
  /* Apply design tokens */
  background: var(--m-color-primary, #0066cc);
  color: var(--m-color-text, white);
  font-family: var(--m-font-family, system-ui, sans-serif);
  font-size: var(--m-font-size-base, 1rem);
  padding: var(--m-spacing-sm, 0.5rem) var(--m-spacing-md, 1rem);
  border-radius: var(--m-border-radius, 0.25rem);
  transition: background var(--m-transition-duration, 0.2s);
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button:hover:not(:disabled) {
  background: var(--m-color-primary-hover, #0052a3);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Component Structure

Follow the M Design System pattern:

```javascript
import { LitElement, html, css } from 'lit';

/**
 * A button component wrapping a native button element in shadow DOM.
 * 
 * This approach uses a native <button> element inside the shadow DOM,
 * which provides built-in button semantics but may have limitations
 * with form association.
 * 
 * @element m-button-shadow
 * @fires click - Fires when the button is clicked
 * @slot - Button content (text, icons, etc.)
 */
export class MButtonShadow extends LitElement {
  static defaultTagName = 'm-button-shadow';
  
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };
  
  static properties = {
    type: { type: String },
    disabled: { type: Boolean, reflect: true },
    ariaLabel: { type: String, attribute: 'aria-label' },
    ariaLabelledby: { type: String, attribute: 'aria-labelledby' },
    ariaDescribedby: { type: String, attribute: 'aria-describedby' },
    form: { type: String }
  };
  
  static styles = css`/* styles */`;
  
  constructor() {
    super();
    this.type = 'submit';
    this.disabled = false;
    this.ariaLabel = '';
    this.ariaLabelledby = '';
    this.ariaDescribedby = '';
    this.form = '';
  }
  
  /**
   * Handles button clicks for form interaction
   */
  _handleClick(e) {
    // The native button handles most of this,
    // but we can add additional logic if needed
    
    // If type is submit/reset and no form attribute,
    // find parent form and submit/reset it
    if (!this.form && (this.type === 'submit' || this.type === 'reset')) {
      const form = this.closest('form');
      if (form) {
        if (this.type === 'submit') {
          form.requestSubmit();
        } else if (this.type === 'reset') {
          form.reset();
        }
      }
    }
  }
  
  render() {
    return html`
      <button
        type="${this.type}"
        ?disabled="${this.disabled}"
        aria-label="${this.ariaLabel || nothing}"
        aria-labelledby="${this.ariaLabelledby || nothing}"
        aria-describedby="${this.ariaDescribedby || nothing}"
        form="${this.form || nothing}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }
}

/**
 * Register the component
 */
export function register(tagName = MButtonShadow.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonShadow);
  }
  return tagName;
}
```

## Known Challenges

Document these considerations:
1. **Form association** - Shadow DOM can break implicit form association
   - Use `form` attribute to explicitly associate with forms by ID
   - Or use manual form submission via `closest('form')`
2. **ARIA relationships** - `aria-labelledby` may not work across shadow boundaries
   - Test thoroughly with screen readers
3. **Event handling** - Events from shadow DOM may need re-dispatching

## Testing Focus

After implementation, test:
- ✅ Native button keyboard behavior (automatic)
- ✅ Focus delegation works correctly
- ✅ Form submission with and without `form` attribute
- ✅ ARIA attributes in accessibility tree
- ✅ Design token application
- ✅ Disabled state behavior
- ✅ Events bubble correctly

## File Deliverable

Create: `/packages/components/src/button-evaluation/approach-2-shadow/m-button-shadow.js`

Make it a complete, working implementation ready for evaluation testing.
