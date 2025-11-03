# RFC: m-radio Component

**Status:** Draft  
**Author:** LFDS Team  
**Created:** 2025-11-03  
**Updated:** 2025-11-03

---

## Summary

A radio button component that wraps a native `<input type="radio">` element using the Shadow DOM + Slot pattern. This component provides style isolation while maintaining perfect accessibility and native form behavior.

---

## Motivation

Radio buttons are fundamental form controls used for selecting a single option from a set of mutually exclusive choices. The m-radio component will:

- Provide consistent styling across the design system
- Maintain full accessibility without shadow DOM limitations
- Support theming through CSS custom properties
- Work seamlessly with native form behavior and validation
- Follow established patterns from m-button component

---

## Design

### Component Architecture

The m-radio component follows the **Shadow DOM + Slot pattern** for form components as defined in `ARCHITECTURE.md`:

- Uses shadow DOM for style isolation
- Native `<input type="radio">` stays in light DOM for accessibility
- Styles applied via `::slotted()` selectors and CSS custom properties
- Variants controlled via host attributes

### Visual States

The component supports the following visual states:

1. **Default** - Unchecked, enabled state
2. **Checked** - Selected state
3. **Disabled** - Both checked and unchecked disabled states
4. **Focus** - Keyboard focus indicator
5. **Hover** - Mouse hover state
6. **Error** - Invalid/error state (for form validation)

### Props/Attributes

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `string` | `'default'` | Visual variant (`default`, `primary`, `secondary`) |
| `size` | `string` | `'medium'` | Size variant (`small`, `medium`, `large`) |

**Note:** The native `<input type="radio">` element inside the slot maintains its own native attributes (`name`, `value`, `checked`, `disabled`, `required`, etc.).

---

## Accessibility Requirements

### WCAG Compliance

The component must meet WCAG 2.1 Level AAA standards:

#### Perceivable
- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text and UI components
- **Visual indicators:** Both color and shape changes for checked/unchecked states (not relying on color alone)
- **Focus indicators:** Clearly visible focus state with minimum 2px outline and appropriate contrast

#### Operable
- **Keyboard navigation:** Full keyboard support via native input behavior
  - `Tab` to navigate between form controls
  - `Space` to select/toggle radio button
  - Arrow keys to navigate within radio group (native behavior)
- **Touch targets:** Minimum 44×44px touch target size for mobile devices
- **No timing:** No time-based interactions required

#### Understandable
- **Labels:** Clear association between radio button and label
- **Error messages:** Clear, programmatically associated error messages
- **Grouping:** Radio buttons in a group must be associated via `<fieldset>` and `<legend>` or ARIA roles

#### Robust
- **Native semantics:** Uses native `<input type="radio">` for maximum compatibility
- **ARIA support:** All ARIA attributes work without shadow DOM limitations
  - `aria-labelledby`
  - `aria-describedby`
  - `aria-invalid`
  - `aria-required`

### Screen Reader Support

- Must announce role as "radio button"
- Must announce label text
- Must announce checked/unchecked state
- Must announce disabled state
- Must announce if part of a radio group
- Must announce error messages when invalid

### Keyboard Interaction

Following native HTML radio button behavior:

- `Tab`: Move focus to the radio group (or checked radio if one exists)
- `Arrow Keys` (↑↓←→): Navigate between radio buttons in the same group
- `Space`: Select the focused radio button

---

## API Design

### Component Usage

```html
<!-- Basic usage -->
<m-radio>
  <input type="radio" name="option" value="1">
</m-radio>

<!-- With variant -->
<m-radio variant="primary">
  <input type="radio" name="option" value="2">
</m-radio>

<!-- With size -->
<m-radio size="large">
  <input type="radio" name="option" value="3">
</m-radio>

<!-- Checked state -->
<m-radio variant="primary">
  <input type="radio" name="option" value="4" checked>
</m-radio>

<!-- Disabled state -->
<m-radio>
  <input type="radio" name="option" value="5" disabled>
</m-radio>
```

### Radio Group Pattern

```html
<fieldset>
  <legend>Choose an option</legend>
  
  <label>
    <m-radio>
      <input type="radio" name="choice" value="option1">
    </m-radio>
    Option 1
  </label>
  
  <label>
    <m-radio>
      <input type="radio" name="choice" value="option2" checked>
    </m-radio>
    Option 2
  </label>
  
  <label>
    <m-radio>
      <input type="radio" name="choice" value="option3">
    </m-radio>
    Option 3
  </label>
</fieldset>
```

### With ARIA Attributes

```html
<span id="group-label">Select your preference</span>
<span id="help-text">Choose one option from the list</span>

<div role="radiogroup" aria-labelledby="group-label" aria-describedby="help-text">
  <m-radio>
    <input type="radio" name="preference" value="a" id="opt-a">
  </m-radio>
  <label for="opt-a">Option A</label>
  
  <m-radio>
    <input type="radio" name="preference" value="b" id="opt-b">
  </m-radio>
  <label for="opt-b">Option B</label>
</div>
```

---

## CSS Custom Properties

### Component-Specific Properties

```css
/* Size and spacing */
--m-radio-size: 20px;
--m-radio-size-small: 16px;
--m-radio-size-large: 24px;

/* Border */
--m-radio-border-width: 2px;
--m-radio-border-color: #ccc;
--m-radio-border-radius: 50%;

/* Background */
--m-radio-background: transparent;
--m-radio-background-checked: var(--m-color-primary, #0066cc);

/* Inner dot/circle */
--m-radio-dot-size: 10px;
--m-radio-dot-color: white;

/* States */
--m-radio-border-color-hover: #999;
--m-radio-border-color-focus: var(--m-color-primary, #0066cc);
--m-radio-border-color-checked: var(--m-color-primary, #0066cc);
--m-radio-border-color-error: var(--m-color-error, #d32f2f);

/* Disabled state */
--m-radio-opacity-disabled: 0.5;

/* Focus indicator */
--m-radio-focus-outline-width: 2px;
--m-radio-focus-outline-offset: 2px;
--m-radio-focus-outline-color: var(--m-color-primary, #0066cc);
```

### Global Design Tokens

```css
/* Colors */
--m-color-primary: #0066cc;
--m-color-primary-hover: #0052a3;
--m-color-error: #d32f2f;

/* Typography */
--m-font-family: inherit;

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
   - Renders a single `<slot>` for the native input
   - Follows the pattern established by `m-button`

2. **Styling Strategy**
   - Use `::slotted(input[type="radio"])` for styling
   - Variants controlled via `:host([variant="..."])`
   - Size variations controlled via `:host([size="..."])`
   - All theming via CSS custom properties

3. **Native Input Behavior**
   - No JavaScript interception of native behavior
   - All form submission, validation, and serialization works natively
   - Radio grouping via native `name` attribute

### File Structure

```
packages/components/src/radio/
├── m-radio.js           # Component implementation
└── radio.md             # Usage documentation (optional)
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

- [ ] Visual states render correctly (default, checked, disabled, focus, hover)
- [ ] All size variants render correctly (small, medium, large)
- [ ] All style variants render correctly (default, primary, secondary)
- [ ] Focus indicator is clearly visible
- [ ] Keyboard navigation works (Tab, Space, Arrow keys)
- [ ] Radio grouping works correctly (only one selected at a time)
- [ ] Form submission includes correct values
- [ ] Disabled state prevents interaction
- [ ] CSS custom properties can be overridden
- [ ] Works in all supported browsers

### Accessibility Testing Checklist

- [ ] Screen reader announces "radio button"
- [ ] Screen reader announces checked/unchecked state
- [ ] Screen reader announces label text
- [ ] Screen reader announces disabled state
- [ ] Screen reader announces group context
- [ ] Keyboard-only navigation works completely
- [ ] Focus indicators meet WCAG AAA standards
- [ ] Color contrast meets WCAG AAA standards (7:1 for text, 4.5:1 for UI)
- [ ] Touch targets are minimum 44×44px
- [ ] ARIA attributes work correctly across shadow boundary

### Automated Testing

- Unit tests for component registration
- Custom Elements Manifest validation
- TypeScript definition validation

---

## Migration & Rollout

### Phase 1: Initial Implementation
- Create m-radio component following established patterns
- Generate Custom Elements Manifest and TypeScript definitions
- Create manual test page

### Phase 2: Documentation
- Add component to documentation site
- Create usage examples
- Document accessibility features

### Phase 3: Integration
- Add to auto-register.js
- Update package.json exports
- Create Storybook stories (if applicable)

---

## Open Questions

1. Should we provide a higher-level `m-radio-group` component for common grouping patterns?
2. Should we include built-in label positioning options (left/right/top/bottom)?
3. Should we support custom radio button shapes beyond circular (e.g., square variants)?
4. Do we need variant styles beyond default/primary/secondary?

---

## References

### Design System Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Form Components Architecture (Shadow DOM + Slot pattern)
- [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) - Form Component Template

### Existing Components
- [m-button](../packages/components/src/button/m-button.js) - Reference implementation using Shadow DOM + Slot pattern

### Standards & Specifications
- [HTML Standard: Radio Button](https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio))
- [ARIA: Radio Role](https://www.w3.org/TR/wax-aria/#radio)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices: Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

---

## Related Decisions (ADR)

_No ADRs exist yet for this project._

---

## Changelog

- **2025-11-03**: Initial RFC created by Magnus
