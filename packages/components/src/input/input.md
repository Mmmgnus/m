# Input Component

An input field component that wraps a native `<input>` element using shadow DOM with slots for style isolation while preserving perfect accessibility.

## Why Shadow DOM + Slot?

The input component uses shadow DOM with slots to provide:

- ✅ **Style isolation** - Component styles can't be accidentally overridden
- ✅ **Perfect accessibility** - Native input stays in light DOM
- ✅ **Microfrontend ready** - No CSS conflicts between teams
- ✅ **ARIA element reflection** - Error/help text announced by screen readers (modern browsers)
- ✅ **Form integration** - Native form behavior preserved

## Installation

```javascript
import { MInput, register } from '@frdh/m-components/input';
register();
```

Or use auto-register:

```javascript
import '@frdh/m-components/auto-register';
```

## Basic Usage

```html
<m-input label="Email" required>
  <input type="email" name="email">
</m-input>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `""` | Label text to display |
| `error` | `string` | `""` | Error message (sets aria-invalid) |
| `help` | `string` | `""` | Help text for the input |
| `required` | `boolean` | `false` | Shows required indicator |
| `size` | `string` | `"medium"` | Size variant: `small`, `medium`, `large` |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Native `<input>` element (required) |
| `label` | Optional custom label element |

## Examples

### With Label Property

```html
<m-input label="Email" required>
  <input type="email" name="email" placeholder="you@example.com">
</m-input>
```

### With Custom Label Slot

```html
<m-input>
  <label slot="label" for="my-email">
    Email Address <abbr title="required">*</abbr>
  </label>
  <input id="my-email" type="email" name="email">
</m-input>
```

### With Help Text

```html
<m-input label="Password" help="Must be at least 8 characters">
  <input type="password" name="password">
</m-input>
```

### With Error Message

```html
<m-input label="Username" error="This username is already taken">
  <input type="text" name="username" value="john">
</m-input>
```

### Size Variants

```html
<!-- Small -->
<m-input label="Small Input" size="small">
  <input type="text">
</m-input>

<!-- Medium (default) -->
<m-input label="Medium Input">
  <input type="text">
</m-input>

<!-- Large -->
<m-input label="Large Input" size="large">
  <input type="text">
</m-input>
```

### Disabled Input

```html
<m-input label="Disabled Field">
  <input type="text" value="Cannot edit" disabled>
</m-input>
```

## Accessibility

### ARIA Element Reflection

The component uses **ARIA element reflection** (`ariaDescribedByElements`) to connect error/help text across the shadow boundary. This works in modern browsers:

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 16.4+
- ⚠️ Firefox (needs polyfill)

### Polyfill for Older Browsers

For maximum compatibility, include the ARIA reflection polyfill:

```bash
npm install aria-reflection
```

```javascript
// In your app entry point
import 'aria-reflection';
import '@frdh/m-components/auto-register';
```

Without the polyfill, error/help text won't be announced by screen readers in older browsers (but will still be visible).

### aria-describedby (External)

External `aria-describedby` references work in all browsers since both elements are in light DOM:

```html
<span id="email-help">Your primary contact email</span>
<m-input label="Email">
  <input type="email" aria-describedby="email-help">
</m-input>
```

### aria-label Override

You can override the visual label for screen readers:

```html
<m-input label="Email">
  <input 
    type="email" 
    name="email"
    aria-label="Primary contact email address for account recovery"
  >
</m-input>
```

**Visual**: Shows "Email"  
**Screen reader**: Reads "Primary contact email address for account recovery"

## Form Integration

```html
<form>
  <m-input label="Full Name" required>
    <input type="text" name="name" required>
  </m-input>
  
  <m-input label="Email" required help="We'll never share your email">
    <input type="email" name="email" required>
  </m-input>
  
  <m-button variant="primary">
    <button type="submit">Submit</button>
  </m-button>
</form>
```

## Theming

Customize via CSS custom properties:

```css
:root {
  /* Label */
  --m-input-label-font-size: 0.875rem;
  --m-input-label-font-weight: 500;
  --m-input-label-color: #333;
  --m-input-label-margin: 0.5rem;
  
  /* Input */
  --m-input-padding: 0.5rem 0.75rem;
  --m-input-border-color: #ccc;
  --m-input-border-radius: 0.25rem;
  --m-input-background: white;
  --m-input-color: inherit;
  --m-input-font-size: 1rem;
  
  /* Focus */
  --m-input-focus-shadow: rgba(0, 102, 204, 0.1);
  
  /* Disabled */
  --m-input-background-disabled: #f5f5f5;
  
  /* Placeholder */
  --m-input-placeholder-color: #999;
  
  /* Messages */
  --m-input-message-margin: 0.25rem;
  --m-input-message-font-size: 0.875rem;
  --m-input-help-color: #666;
  
  /* Error */
  --m-color-error: #dc3545;
  --m-input-error-shadow: rgba(220, 53, 69, 0.1);
  
  /* Sizes */
  --m-input-padding-small: 0.25rem 0.5rem;
  --m-input-font-size-small: 0.875rem;
  --m-input-padding-large: 0.75rem 1rem;
  --m-input-font-size-large: 1.125rem;
  
  /* Global */
  --m-font-family: system-ui, sans-serif;
  --m-color-primary: #0066cc;
}
```

## Validation

### Client-Side Validation

```html
<m-input label="Email" error="">
  <input 
    type="email" 
    name="email" 
    required 
    oninput="this.parentElement.error = this.validity.valid ? '' : 'Please enter a valid email'"
  >
</m-input>
```

### Server-Side Validation

```javascript
// After form submission
const emailInput = document.querySelector('m-input[label="Email"]');
emailInput.error = 'This email is already registered';
```

## Best Practices

1. **Always wrap a native input**: Component expects an `<input>` element
2. **Use appropriate input types**: `email`, `password`, `text`, `number`, etc.
3. **Set name attributes**: For proper form submission
4. **Add ARIA polyfill for production**: Ensures compatibility across all browsers
5. **Use error property for validation**: Automatically sets `aria-invalid`
6. **Preserve external aria-describedby**: Component maintains external ARIA references

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Basic functionality | ✅ | ✅ | ✅ | ✅ |
| ARIA reflection (native) | 90+ | 90+ | ❌ | 16.4+ |
| ARIA reflection (polyfilled) | ✅ | ✅ | ✅ | ✅ |

## Known Limitations

1. **ARIA reflection**: Older browsers need polyfill for error/help text announcement
2. **::slotted() limitations**: Can't style descendants of slotted input (icons, etc.)
3. **No automatic validation**: You must handle validation and set `error` property

## Related Components

- [`m-button`](../button/button.md) - Button component for forms
- More form components coming soon...
