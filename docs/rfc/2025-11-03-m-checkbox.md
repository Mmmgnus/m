# RFC: m-checkbox Component

**Status:** Draft  
**Author:** LFDS Team  
**Created:** 2025-11-03  
**Updated:** 2025-11-03

> 💬 **[Discuss this RFC](https://github.com/Mmmgnus/m/discussions/new?category=rfcs&title=RFC:%20m-checkbox%20Component)** - Share feedback, ask questions, or suggest improvements

---

## Summary

A checkbox component that wraps a native `<input type="checkbox">` element using the Shadow DOM + Slot pattern. This component provides style isolation while maintaining perfect accessibility and native form behavior.

---

## Motivation

Checkboxes are fundamental form controls used for toggling options and selecting multiple items from a set. The m-checkbox component will:

- Provide consistent styling across the design system
- Maintain full accessibility without shadow DOM limitations
- Support theming through CSS custom properties
- Work seamlessly with native form behavior and validation
- Follow established patterns from m-button and m-radio components

---

## Design

### Component Architecture

The m-checkbox component follows the **Shadow DOM + Slot pattern** for form components as defined in `ARCHITECTURE.md`:

- Uses shadow DOM for style isolation
- Native `<input type="checkbox">` stays in light DOM for accessibility
- Styles applied via `::slotted()` selectors and CSS custom properties
- Variants controlled via host attributes
- Built-in label support via `label` property

### Visual States

The component supports the following visual states:

1. **Default** - Unchecked, enabled state
2. **Checked** - Selected state
3. **Indeterminate** - Partially selected state (for nested checkboxes)
4. **Disabled** - Both checked and unchecked disabled states
5. **Focus** - Keyboard focus indicator
6. **Hover** - Mouse hover state
7. **Error** - Invalid/error state (for form validation)

### Props/Attributes

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `''` | Label text displayed next to the checkbox |

**Note:** The native `<input type="checkbox">` element inside the slot maintains its own native attributes (`name`, `value`, `checked`, `disabled`, `required`, `indeterminate`, etc.).

---

## Accessibility Requirements

### WCAG Compliance

The component must meet WCAG 2.1 Level AAA standards:

#### Perceivable
- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text and UI components
- **Visual indicators:** Both color and shape changes for checked/unchecked states (not relying on color alone)
- **Focus indicators:** Clearly visible focus state with minimum 2px outline and appropriate contrast
- **Indeterminate state:** Visually distinct from checked and unchecked states

#### Operable
- **Keyboard navigation:** Full keyboard support via native input behavior
  - `Tab` to navigate between form controls
  - `Space` to toggle checkbox on/off
- **Touch targets:** Minimum 44×44px touch target size for mobile devices
- **No timing:** No time-based interactions required

#### Understandable
- **Labels:** Clear association between checkbox and label
- **Error messages:** Clear, programmatically associated error messages
- **State indication:** Clear visual and programmatic indication of checked/unchecked/indeterminate states

#### Robust
- **Native semantics:** Uses native `<input type="checkbox">` for maximum compatibility
- **ARIA support:** All ARIA attributes work without shadow DOM limitations
  - `aria-labelledby`
  - `aria-describedby`
  - `aria-invalid`
  - `aria-required`
  - `aria-checked` (automatically managed by native checkbox)

### Screen Reader Support

- Must announce role as "checkbox"
- Must announce label text
- Must announce checked/unchecked/indeterminate state
- Must announce disabled state
- Must announce error messages when invalid

### Keyboard Interaction

Following native HTML checkbox behavior:

- `Tab`: Move focus to the checkbox
- `Space`: Toggle the checkbox on/off
- `Shift + Tab`: Move focus to previous control

---

## API Design

### Component Usage

```html
<!-- Basic usage -->
<m-checkbox label="I agree to the terms">
  <input type="checkbox" name="terms">
</m-checkbox>

<!-- Checked state -->
<m-checkbox label="Subscribe to newsletter">
  <input type="checkbox" name="subscribe" checked>
</m-checkbox>

<!-- Disabled state -->
<m-checkbox label="Not available">
  <input type="checkbox" name="unavailable" disabled>
</m-checkbox>

<!-- Without label (custom positioning) -->
<m-checkbox>
  <input type="checkbox" id="custom" name="custom">
</m-checkbox>
<label for="custom">Custom label outside</label>
```

### With Form Integration

```html
<form>
  <m-checkbox label="Remember me">
    <input type="checkbox" name="remember" value="yes">
  </m-checkbox>
  
  <m-checkbox label="Accept terms and conditions">
    <input type="checkbox" name="terms" value="accepted" required>
  </m-checkbox>
  
  <button type="submit">Submit</button>
</form>
```

### Indeterminate State

```html
<m-checkbox label="Select all">
  <input type="checkbox" id="select-all">
</m-checkbox>

<script type="module">
  // Indeterminate state must be set via JavaScript
  const checkbox = document.getElementById('select-all');
  checkbox.indeterminate = true;
</script>
```

### With ARIA Attributes and Help Text

```html
<span id="terms-help">Please read our terms carefully</span>

<m-checkbox label="I agree to the terms and conditions">
  <input 
    type="checkbox" 
    name="terms" 
    required
    aria-describedby="terms-help"
    aria-invalid="false">
</m-checkbox>

<span id="terms-error" role="alert" hidden>
  You must accept the terms to continue
</span>
```

---

## CSS Custom Properties

### Component-Specific Properties

```css
/* Size and spacing */
--m-checkbox-size: 20px;
--m-checkbox-gap: 8px;

/* Border */
--m-checkbox-border-width: 2px;
--m-checkbox-border-color: #ccc;
--m-checkbox-border-radius: 4px;

/* Background */
--m-checkbox-background: transparent;
--m-checkbox-background-checked: var(--m-color-primary, #0066cc);

/* Checkmark */
--m-checkbox-checkmark-color: white;
--m-checkbox-checkmark-size: 12px;

/* States */
--m-checkbox-border-color-hover: #999;
--m-checkbox-border-color-focus: var(--m-color-primary, #0066cc);
--m-checkbox-border-color-checked: var(--m-color-primary, #0066cc);
--m-checkbox-border-color-error: var(--m-color-error, #d32f2f);

/* Indeterminate state */
--m-checkbox-indeterminate-background: var(--m-color-primary, #0066cc);
--m-checkbox-indeterminate-mark-color: white;

/* Disabled state */
--m-checkbox-opacity-disabled: 0.5;

/* Focus indicator */
--m-checkbox-focus-outline-width: 2px;
--m-checkbox-focus-outline-offset: 2px;
--m-checkbox-focus-outline-color: var(--m-color-primary, #0066cc);

/* Label */
--m-checkbox-label-color: inherit;
```

### Global Design Tokens

```css
/* Colors */
--m-color-primary: #0066cc;
--m-color-primary-hover: #0052a3;
--m-color-error: #d32f2f;

/* Typography */
--m-font-family: inherit;
--m-font-size-base: 1rem;

/* Spacing */
--m-spacing-sm: 4px;
--m-spacing-md: 8px;
--m-spacing-lg: 12px;
```

---

## Implementation Notes

### Technical Approach

1. **Component Structure**
   - Extends `LitElement`
   - Uses shadow DOM for style isolation
   - Wraps content in a `<label>` element for implicit label association
   - Renders native input in default slot with optional label text
   - Follows the pattern established by `m-radio`

2. **Styling Strategy**
   - Use `::slotted(input[type="checkbox"])` for styling
   - Custom checkbox appearance via `appearance: none`
   - Checkmark rendered via CSS (pseudo-element or background-image)
   - Indeterminate state styled differently from checked state
   - All theming via CSS custom properties

3. **Native Input Behavior**
   - No JavaScript interception of native behavior
   - All form submission, validation, and serialization works natively
   - Indeterminate state managed via JavaScript property (standard behavior)

4. **Label Click Handling**
   - Shadow DOM label wrapper forwards clicks to light DOM input
   - JavaScript event listener ensures label clicks toggle checkbox
   - Maintains native behavior and accessibility

### File Structure

```
packages/components/src/checkbox/
├── m-checkbox.js           # Checkbox component
└── checkbox.md             # Usage documentation (optional)
```

### Dependencies

- `lit` (version 3.0+)
- No additional dependencies

### Browser Support

All modern browsers supporting:
- Custom Elements v1
- Shadow DOM v1
- ES Modules
- CSS Custom Properties

---

## Testing Requirements

### Manual Testing Checklist

- [ ] Visual states render correctly (default, checked, indeterminate, disabled, focus, hover)
- [ ] Label displays correctly when provided
- [ ] Label click toggles checkbox
- [ ] Focus indicator is clearly visible
- [ ] Keyboard navigation works (Tab, Space)
- [ ] Indeterminate state displays correctly
- [ ] Form submission includes correct values
- [ ] Disabled state prevents interaction
- [ ] CSS custom properties can be overridden
- [ ] Works in all supported browsers

### Accessibility Testing Checklist

- [ ] Screen reader announces "checkbox"
- [ ] Screen reader announces checked/unchecked/indeterminate state
- [ ] Screen reader announces label text
- [ ] Screen reader announces disabled state
- [ ] Keyboard-only navigation works completely
- [ ] Focus indicators meet WCAG AAA standards
- [ ] Color contrast meets WCAG AAA standards (7:1 for text, 4.5:1 for UI)
- [ ] Touch targets are minimum 44×44px
- [ ] ARIA attributes work correctly across shadow boundary
- [ ] Label association works correctly

### Automated Testing

- Unit tests for component registration
- Custom Elements Manifest validation
- TypeScript definition validation

---

## Migration & Rollout

### Phase 1: Initial Implementation
- Create m-checkbox component with built-in label support
- Generate Custom Elements Manifest and TypeScript definitions
- Create manual test page

### Phase 2: Documentation
- Add component to documentation site
- Create usage examples
- Document accessibility features
- Document indeterminate state usage

### Phase 3: Integration
- Add m-checkbox to auto-register.js
- Update package.json exports
- Create usage examples and stories

---

## Open Questions

_No open questions at this time._

---

## References

### Design System Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Form Components Architecture (Shadow DOM + Slot pattern)
- [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) - Form Component Template

### Existing Components
- [m-button](../packages/components/src/button/m-button.js) - Reference implementation using Shadow DOM + Slot pattern
- [m-radio](../packages/components/src/radio/m-radio.js) - Similar form component with label support

### Standards & Specifications
- [HTML Standard: Checkbox State](https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox))
- [ARIA: Checkbox Role](https://www.w3.org/TR/wai-aria/#checkbox)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices: Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)

---

## Related Decisions (ADR)

- [ADR-001: Shadow DOM + Slot Pattern for Form Components](../adr/001-shadow-dom-slot-pattern-for-form-components.md) - Architectural decision for form component implementation pattern

---

## Changelog

- **2025-11-03**: Initial RFC created by Magnus
