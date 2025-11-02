# Approach 3: Slot-Based Wrapper - Specification

## Overview

You are building a button web component that acts as a **styled wrapper around a native button provided by the developer via a slot**. The component does NOT create the button itself—the developer must provide their own `<button>` element inside the component.

This is the most "web standards" approach, preserving all native button behavior while adding design system styling and conventions.

## Implementation Requirements

### Core Functionality

**Element**: Implement as `<m-button-slot>`

Your component must:
1. Provide a slot for the developer's button element
2. Apply design token-based styling to the slotted button
3. NOT interfere with the button's native behavior
4. Provide minimal abstraction—the button works naturally

### Properties & Attributes

This approach requires **minimal or no properties** on the component itself, since the button element is provided by the developer. However, you may offer:

```javascript
/**
 * Optional: variant styling (e.g., 'primary', 'secondary')
 * @type {string}
 * @default 'primary'
 */
variant = 'primary';

/**
 * Optional: size variant
 * @type {'sm' | 'md' | 'lg'}
 * @default 'md'
 */
size = 'md';
```

The developer applies all button-specific attributes (`type`, `disabled`, `aria-*`) directly to their `<button>` element.

### Slot Structure

Provide a default slot:
- Expects a `<button>` element
- Could validate or warn if non-button content is slotted
- Optionally provide fallback content if no button is provided

### Styling Strategy

Use **CSS custom properties** and **::slotted()** selector to style the button:

```css
:host {
  display: inline-block;
}

/* Style the slotted button */
::slotted(button) {
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
  width: 100%;
}

::slotted(button:hover:not(:disabled)) {
  background: var(--m-color-primary-hover, #0052a3);
}

::slotted(button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

::slotted(button:focus-visible) {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Optional: variant styles */
:host([variant="secondary"]) ::slotted(button) {
  background: var(--m-color-secondary, #6c757d);
}
```

### Developer Usage

Developers would use it like this:

```html
<!-- Basic usage -->
<m-button-slot>
  <button type="submit">Submit</button>
</m-button-slot>

<!-- With ARIA -->
<m-button-slot>
  <button type="button" aria-label="Close dialog">×</button>
</m-button-slot>

<!-- Disabled -->
<m-button-slot>
  <button type="submit" disabled>Submit</button>
</m-button-slot>

<!-- Variant -->
<m-button-slot variant="secondary">
  <button type="button">Cancel</button>
</m-button-slot>
```

### Component Structure

Follow the M Design System pattern:

```javascript
import { LitElement, html, css } from 'lit';

/**
 * A button wrapper component that styles a slotted native button element.
 * 
 * This approach requires developers to provide their own <button> element,
 * which preserves all native button behavior and accessibility while
 * applying design system styling.
 * 
 * @element m-button-slot
 * @slot - A native <button> element
 * 
 * @example
 * <m-button-slot>
 *   <button type="submit">Submit</button>
 * </m-button-slot>
 */
export class MButtonSlot extends LitElement {
  static defaultTagName = 'm-button-slot';
  
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true }
  };
  
  static styles = css`/* styles */`;
  
  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
  }
  
  /**
   * Validates that slotted content is a button
   */
  _handleSlotChange(e) {
    const slot = e.target;
    const elements = slot.assignedElements();
    
    // Optional: warn if no button element found
    if (elements.length === 0) {
      console.warn('m-button-slot: No button element provided');
      return;
    }
    
    const hasButton = elements.some(el => el.tagName === 'BUTTON');
    if (!hasButton) {
      console.warn('m-button-slot: Expected a <button> element');
    }
  }
  
  render() {
    return html`
      <slot @slotchange="${this._handleSlotChange}"></slot>
    `;
  }
}

/**
 * Register the component
 */
export function register(tagName = MButtonSlot.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonSlot);
  }
  return tagName;
}
```

## Advantages of This Approach

1. **Perfect native behavior** - The button IS a native button
2. **Full accessibility** - All button semantics preserved automatically
3. **Form integration** - Works perfectly with forms, no special handling needed
4. **ARIA support** - All ARIA attributes work as expected
5. **Simplest code** - Minimal JavaScript, mostly CSS
6. **Most predictable** - Developers understand exactly what's happening

## Disadvantages

1. **More verbose** - Developers must always provide `<button>` element
2. **Less "magic"** - Requires understanding of how to use it properly
3. **Limited enforcement** - Can't guarantee developers use it correctly
4. **::slotted() limitations** - Can only style direct slotted elements, not deeply nested content

## Styling Limitations

Note that `::slotted()` has limitations:
- Can only target the direct slotted element (the button)
- Cannot style children of the slotted element
- Specificity is lower than expected in some cases

Consider providing CSS custom properties as an alternative styling API:

```css
::slotted(button) {
  background: var(--m-button-bg, var(--m-color-primary, #0066cc));
  color: var(--m-button-text, var(--m-color-text, white));
  /* etc. */
}
```

Developers can then customize:

```html
<m-button-slot style="--m-button-bg: purple;">
  <button>Custom color</button>
</m-button-slot>
```

## Testing Focus

After implementation, test:
- ✅ All native button behavior (100% preserved)
- ✅ Form submission, reset, validation
- ✅ ARIA attributes work perfectly
- ✅ Keyboard navigation is native
- ✅ Design token application via ::slotted()
- ✅ Variant/size attributes work (if implemented)
- ✅ Validation warning works (if implemented)

## File Deliverable

Create: `/packages/components/src/button-evaluation/approach-3-slot/m-button-slot.js`

Make it a complete, working implementation ready for evaluation testing.
