# Button Component

A button component that wraps a native `<button>` element using shadow DOM with slots for style isolation while preserving perfect accessibility.

## Why Shadow DOM + Slot?

The button component uses shadow DOM with slots to provide:

- ✅ **Style isolation** - Component styles can't be accidentally overridden
- ✅ **Perfect accessibility** - Native button stays in light DOM, preserving ARIA
- ✅ **Microfrontend ready** - No CSS conflicts between teams
- ✅ **Theme-able via CSS variables** - Consistent theming across applications
- ✅ **Screen readers work perfectly** - No "Group" announcements
- ✅ **Form integration** - Native form behavior preserved

## Installation

```javascript
import { MButton, register } from '@frdh/m-components/button';
register();
```

Or use auto-register:

```javascript
import '@frdh/m-components/auto-register';
```

## Basic Usage

The component wraps a native `<button>` element that you provide:

```html
<m-button>
  <button type="button">Click me</button>
</m-button>
```

## Variants

### Default
```html
<m-button>
  <button type="button">Default Button</button>
</m-button>
```

### Primary
```html
<m-button variant="primary">
  <button type="submit">Submit</button>
</m-button>
```

### Secondary
```html
<m-button variant="secondary">
  <button type="button">Secondary</button>
</m-button>
```

### Outline
```html
<m-button variant="outline">
  <button type="button">Outline</button>
</m-button>
```

## Sizes

### Small
```html
<m-button size="small">
  <button type="button">Small</button>
</m-button>
```

### Medium (default)
```html
<m-button size="medium">
  <button type="button">Medium</button>
</m-button>
```

### Large
```html
<m-button size="large">
  <button type="button">Large</button>
</m-button>
```

## Combining Variants and Sizes

```html
<m-button variant="primary" size="large">
  <button type="submit">Large Primary Button</button>
</m-button>
```

## Form Integration

### Submit Button
```html
<form>
  <m-button variant="primary">
    <button type="submit">Submit Form</button>
  </m-button>
</form>
```

### Reset Button
```html
<form>
  <m-button variant="secondary">
    <button type="reset">Reset Form</button>
  </m-button>
</form>
```

### Disabled Button
```html
<m-button>
  <button type="button" disabled>Disabled</button>
</m-button>
```

## Accessibility

The light DOM pattern ensures perfect accessibility:

### With aria-describedby
```html
<span id="help-text">This will submit your form</span>
<m-button variant="primary">
  <button type="submit" aria-describedby="help-text">Submit</button>
</m-button>
```

### With External Label
```html
<label for="submit-btn">Confirm your submission</label>
<m-button variant="primary">
  <button id="submit-btn" type="submit">Submit</button>
</m-button>
```

## Theming

The button uses shadow DOM with CSS custom properties for theming. Set these at the root or component level:

```css
:root {
  /* Primary colors */
  --m-color-primary: #0066cc;
  --m-color-primary-hover: #0052a3;
  --m-color-primary-text: white;
  
  /* Secondary colors */
  --m-color-secondary: #6c757d;
  --m-color-secondary-hover: #5a6268;
  --m-color-secondary-text: white;
  
  /* Default button styling */
  --m-button-background: #f5f5f5;
  --m-button-background-hover: #e0e0e0;
  --m-button-color: inherit;
  --m-button-border-color: #ccc;
  --m-button-border-radius: 4px;
  
  /* Spacing */
  --m-button-padding: 8px 16px;
  --m-button-padding-small: 4px 12px;
  --m-button-padding-large: 12px 24px;
  
  /* Typography */
  --m-font-family: system-ui, sans-serif;
  --m-font-size-base: 1rem;
  --m-font-size-small: 0.875rem;
  --m-font-size-large: 1.125rem;
}
```

### Component-level theming
```css
/* Theme specific instance */
m-button.danger {
  --m-color-primary: #dc3545;
  --m-color-primary-hover: #c82333;
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `string` | `"default"` | Visual style variant: `default`, `primary`, `secondary`, `outline` |
| `size` | `string` | `"medium"` | Size variant: `small`, `medium`, `large` |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Native `<button>` element |

## Styling Limitations

Due to shadow DOM + `::slotted()`, there are some styling constraints:

### ✅ What You Can Style
- **Direct button element**: Padding, colors, borders, fonts
- **Button states**: `:hover`, `:focus`, `:disabled`
- **Via CSS custom properties**: All themeable aspects

### ❌ What You Cannot Style
- **Child elements of button**: Icons or spans inside buttons require manual styling
- **Complex descendant selectors**: `::slotted(button span)` doesn't work
- **Pseudo-elements**: `::slotted(button)::before` doesn't work

### Workaround for Icons
```html
<m-button variant="primary">
  <button type="submit" style="display: flex; align-items: center; gap: 0.5rem;">
    <svg width="16" height="16">...</svg>
    Save
  </button>
</m-button>
```

## Best Practices

1. **Always wrap a native button**: The component expects a `<button>` element as a child
2. **Set appropriate type**: Use `type="submit"`, `type="reset"`, or `type="button"` on the native button
3. **Use semantic HTML**: Let the native button handle all interactions
4. **Add ARIA attributes to the native button**: Not the wrapper component
5. **Style icons manually**: Use inline styles or classes on elements inside buttons
6. **Use CSS custom properties for theming**: Don't try to override with external CSS

## Examples

### Icon Button
```html
<m-button variant="primary" size="small">
  <button type="button">
    <svg><!-- icon --></svg>
    Save
  </button>
</m-button>
```

### Loading State
```html
<m-button variant="primary">
  <button type="submit" disabled aria-busy="true">
    Loading...
  </button>
</m-button>
```

### Button Group
```html
<div style="display: flex; gap: 0.5rem;">
  <m-button variant="outline">
    <button type="button">Cancel</button>
  </m-button>
  <m-button variant="primary">
    <button type="submit">Save</button>
  </m-button>
</div>
```
