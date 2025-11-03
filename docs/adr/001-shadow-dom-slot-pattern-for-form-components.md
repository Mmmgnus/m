# ADR 001: Shadow DOM + Slot Pattern for Form Components

**Status:** Accepted  
**Date:** 2025-11-03  
**Authors:** LFDS Team

## Context

When building form components (buttons, inputs, checkboxes, radio buttons, etc.) for the M Design System, we needed to decide on an architecture that balances:

1. **Style Isolation** - Components should not be affected by global CSS, especially important in microfrontend architectures
2. **Perfect Accessibility** - Form components must work flawlessly with screen readers and assistive technologies
3. **Native Form Behavior** - Form submission, validation, and serialization must work without JavaScript intervention
4. **ARIA Compatibility** - All ARIA attributes must work across component boundaries
5. **Developer Experience** - Components should feel natural and familiar to use

We evaluated three architectural approaches:

### Option 1: Light DOM Only
- **Pros:** Perfect accessibility, all ARIA works, native form behavior
- **Cons:** No style isolation, CSS conflicts in microfrontends, scoping via BEM only

### Option 2: Full Shadow DOM
- **Pros:** Perfect style isolation, encapsulated styling
- **Cons:** ID-based ARIA references don't work across shadow boundary, `<label for="">` doesn't work, complex workarounds needed

### Option 3: Shadow DOM + Slot Pattern
- **Pros:** Style isolation via shadow DOM, native element stays in light DOM for accessibility, ARIA works perfectly, native form behavior preserved
- **Cons:** Slightly more complex mental model, styling via `::slotted()` pseudo-element

## Decision

We will use the **Shadow DOM + Slot pattern** for all form components in the M Design System.

### Implementation Details

1. **Component Structure**
   - Component extends `LitElement` (default shadow DOM enabled)
   - Native form element (`<input>`, `<button>`, etc.) is provided by the user in the default slot
   - Native element stays in light DOM for accessibility
   - Component wrapper provides shadow DOM for style isolation

2. **Styling Strategy**
   - Use `::slotted()` pseudo-element to style light DOM form elements
   - Variants controlled via host attributes (`:host([variant="primary"])`)
   - All theming done via CSS custom properties
   - No direct manipulation of native element styles via JavaScript

3. **Label Pattern**
   - Components can provide a `label` property for convenience
   - Shadow DOM renders `<label>` wrapper with click forwarding to light DOM input
   - External labels still work via standard `id`/`for` attributes
   - JavaScript event listener forwards label clicks to native input

4. **Applicable Components**
   - `m-button` - Button wrapper
   - `m-input` - Text input wrapper
   - `m-checkbox` - Checkbox wrapper
   - `m-radio` - Radio button wrapper
   - Future: `m-select`, `m-textarea`, `m-switch`

### Example Usage

```html
<!-- Component provides styling isolation -->
<m-checkbox label="I agree to terms">
  <!-- Native input stays in light DOM for accessibility -->
  <input type="checkbox" name="terms" required>
</m-checkbox>
```

### How It Works

```
┌─────────────────────────────────────┐
│ m-checkbox (shadow root)            │
│ ┌─────────────────────────────────┐ │
│ │ <label class="wrapper">         │ │
│ │   <slot></slot> ← Light DOM     │ │
│ │   <span>Label text</span>       │ │
│ │ </label>                        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
         ↓ slot projects
┌─────────────────────────────────────┐
│ <input type="checkbox"> (light DOM) │ ← Accessible!
└─────────────────────────────────────┘
```

## Consequences

### Positive

✅ **Perfect Accessibility**
- Screen readers work flawlessly with native elements
- All ARIA attributes work without limitations (`aria-describedby`, `aria-labelledby`, etc.)
- Native keyboard navigation works without JavaScript
- Form validation works natively
- No shadow DOM accessibility issues

✅ **Style Isolation**
- Components are protected from global CSS
- Safe for use in microfrontend architectures
- No CSS naming collisions
- Predictable styling behavior

✅ **Native Form Behavior**
- Form submission works without JavaScript
- Native validation works out of the box
- Form serialization works automatically
- Browser autofill works correctly

✅ **Themeable**
- CSS custom properties pierce shadow boundary
- Consistent theming across all components
- Design tokens work seamlessly

✅ **Standards-Based**
- Uses web platform features correctly
- Future-proof approach
- Works with any framework or none

### Negative

⚠️ **Styling Limitations**
- Must use `::slotted()` which has limitations (can only style direct slotted elements, not descendants)
- Cannot use some advanced CSS selectors on slotted content
- **Mitigation:** Most form elements are simple enough that this isn't an issue

⚠️ **Mental Model**
- Developers need to understand light DOM vs shadow DOM
- User provides native element, component provides styling
- **Mitigation:** Clear documentation and examples, pattern becomes familiar quickly

⚠️ **Label Click Handling**
- Requires JavaScript to forward label clicks from shadow to light DOM
- **Mitigation:** Implemented once in base pattern, works reliably

⚠️ **Component Composition**
- Cannot easily nest these components inside each other
- **Mitigation:** Form components are typically leaf nodes anyway

### Alternatives Considered and Rejected

**Light DOM with BEM:** Rejected because style isolation is critical for microfrontends and component reusability. Global CSS conflicts would be too risky.

**Full Shadow DOM with aria-reflection:** Rejected because it requires polyfills, adds complexity, and still has limitations with cross-root ARIA references.

**Custom styling via part attribute:** Considered but rejected as primary approach because it requires users to write more CSS and doesn't provide good defaults.

## References

- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
- [Shadow DOM v1: Self-Contained Web Components](https://web.dev/shadowdom-v1/)
- [RFC: m-radio](../rfc/2025-11-03-m-radio.md)
- [RFC: m-checkbox](../rfc/2025-11-03-m-checkbox.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Form Components Architecture section
- [COMPONENT_GUIDELINES.md](../COMPONENT_GUIDELINES.md) - Form Component Template

## Related Components

All form components implement this pattern:
- `m-button` ([src](../../packages/components/src/button/m-button.js))
- `m-input` ([src](../../packages/components/src/input/m-input.js))
- `m-checkbox` ([src](../../packages/components/src/checkbox/m-checkbox.js))
- `m-radio` ([src](../../packages/components/src/radio/m-radio.js))

## Review and Updates

This ADR should be reviewed when:
- New form components are added
- Accessibility issues are discovered
- Browser support for shadow DOM changes significantly
- Better patterns emerge from the web components community
