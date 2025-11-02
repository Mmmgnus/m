# Guide for AI Implementers

This document provides a quick reference for the three AIs building the button implementations.

---

## Your Mission

Build a fully functional, accessible button web component using Lit that:
- ✅ Supports all native button behaviors
- ✅ Has excellent accessibility (ARIA, keyboard, screen readers)
- ✅ Integrates with HTML forms correctly
- ✅ Uses design tokens (CSS custom properties)
- ✅ Follows the M Design System patterns

---

## Which Approach Are You Implementing?

### 🔨 Approach 1: Custom Implementation
**File**: `approach-1-custom/m-button-custom.js`  
**Spec**: `approach-1-custom/SPEC.md`  
**Element**: `<m-button-custom>`

**Your Task**: Build a button from scratch without using a native `<button>` element. Manually implement all button behaviors including keyboard handling, focus management, and form integration.

**Key Challenges**:
- Replicating all native button behaviors
- Form association without native button
- ARIA role and attributes
- Keyboard event handling (Space, Enter)

---

### 🎭 Approach 2: Native Button in Shadow DOM
**File**: `approach-2-shadow/m-button-shadow.js`  
**Spec**: `approach-2-shadow/SPEC.md`  
**Element**: `<m-button-shadow>`

**Your Task**: Wrap a native `<button>` element inside your component's shadow DOM. The button gets all the benefits of being native, but you need to handle shadow DOM complexities.

**Key Challenges**:
- Form association across shadow boundary
- Focus delegation
- ARIA relationships across shadow DOM
- Event handling and bubbling

---

### 🎰 Approach 3: Slot-Based Wrapper
**File**: `approach-3-slot/m-button-slot.js`  
**Spec**: `approach-3-slot/SPEC.md`  
**Element**: `<m-button-slot>`

**Your Task**: Create a styled wrapper component where developers provide their own `<button>` element via a slot. This is the most "web standards" approach.

**Key Challenges**:
- Styling with `::slotted()` selector
- Minimal abstraction
- Optional validation of slotted content
- Variant system for different styles

---

## Required Imports

All implementations need:

```javascript
import { LitElement, html, css } from 'lit';
```

You may also need:
```javascript
import { nothing } from 'lit';
```

---

## M Design System Pattern

All implementations must follow this structure:

```javascript
/**
 * Component description
 * 
 * @element tag-name
 * @fires eventname - Description
 * @slot - Description
 */
export class ComponentName extends LitElement {
  static defaultTagName = 'tag-name';
  
  static properties = {
    // properties
  };
  
  static styles = css`/* styles */`;
  
  constructor() {
    super();
    // initialize properties
  }
  
  render() {
    return html`<!-- template -->`;
  }
}

/**
 * Register the component
 */
export function register(tagName = ComponentName.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ComponentName);
  }
  return tagName;
}
```

---

## Design Tokens Reference

All buttons should use these CSS custom properties:

```css
--m-color-primary: #0066cc
--m-color-primary-hover: #0052a3
--m-color-secondary: #6c757d
--m-color-text: white
--m-font-family: system-ui, -apple-system, sans-serif
--m-font-size-base: 1rem
--m-spacing-sm: 0.5rem
--m-spacing-md: 1rem
--m-border-radius: 0.25rem
--m-transition-duration: 0.2s
```

Usage in styles:
```css
background: var(--m-color-primary, #0066cc);
```

Always provide fallback values!

---

## Required Properties

All implementations should support:

```javascript
type: 'button' | 'submit' | 'reset'  // default: 'submit'
disabled: boolean                     // default: false
ariaLabel: string                     // optional
ariaLabelledby: string               // optional
ariaDescribedby: string              // optional
```

---

## Accessibility Checklist

Before you submit, verify:

- [ ] Role="button" is present (implicit or explicit)
- [ ] Focusable with Tab key
- [ ] Activates with Space key
- [ ] Activates with Enter key
- [ ] Disabled buttons are not focusable
- [ ] Clear focus indicator (outline)
- [ ] ARIA attributes applied correctly
- [ ] Disabled state uses `aria-disabled` or `disabled` attribute

---

## Form Integration Checklist

- [ ] `type="submit"` submits the parent form
- [ ] `type="reset"` resets the parent form
- [ ] `type="button"` does nothing (no form action)
- [ ] Default type is "submit" (if no type specified)
- [ ] Works when button is inside `<form>` element

**Note**: Approach 1 may have limitations here due to lack of native button.

---

## Testing Your Implementation

Once you've created your file, test it by:

1. Opening `test-harness.html` in a browser
2. Clicking your buttons
3. Testing keyboard navigation (Tab, Space, Enter)
4. Testing form submission
5. Testing with VoiceOver (⌘+F5 on macOS)
6. Inspecting the accessibility tree in DevTools

---

## Common Pitfalls

### Approach 1 (Custom)
- ❌ Forgetting to prevent Space key default (page scroll)
- ❌ Not handling Enter key
- ❌ Missing `tabindex="0"`
- ❌ Using `disabled` attribute instead of `aria-disabled`

### Approach 2 (Shadow DOM)
- ❌ Not using `delegatesFocus: true`
- ❌ Forgetting to handle form association manually
- ❌ Missing `form` attribute support

### Approach 3 (Slot)
- ❌ Trying to style deeply nested elements (not possible with `::slotted()`)
- ❌ Over-complicating the component (keep it simple!)
- ❌ Not providing proper console warnings for validation

---

## JSDoc Best Practices

```javascript
/**
 * Brief one-line description
 * 
 * Longer description explaining behavior, limitations, usage.
 * 
 * @element m-button-name
 * @fires click - Fires when button is activated
 * @slot - Default slot for button content
 * 
 * @example
 * <m-button-name type="submit">Click Me</m-button-name>
 */
```

For properties:
```javascript
/**
 * The type of button
 * @type {'button' | 'submit' | 'reset'}
 * @default 'submit'
 */
type = 'submit';
```

---

## Questions?

Refer to your specific SPEC.md file for detailed implementation guidance.

Good luck! 🚀
