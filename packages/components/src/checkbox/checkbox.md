# m-checkbox

A checkbox component that wraps a native `<input type="checkbox">` element using the Shadow DOM + Slot pattern. This component provides style isolation while maintaining perfect accessibility and native form behavior.

## Features

- ✅ Shadow DOM for style isolation
- ✅ Perfect accessibility with native checkbox in light DOM
- ✅ Built-in label support
- ✅ Support for all native checkbox states (checked, indeterminate, disabled)
- ✅ Themeable via CSS custom properties
- ✅ Native form integration

## Usage

### Basic Usage

```html
<m-checkbox label="I agree to the terms">
  <input type="checkbox" name="terms">
</m-checkbox>
```

### Checked State

```html
<m-checkbox label="Subscribe to newsletter">
  <input type="checkbox" name="subscribe" checked>
</m-checkbox>
```

### Disabled State

```html
<m-checkbox label="Not available">
  <input type="checkbox" name="unavailable" disabled>
</m-checkbox>
```

### Without Label (External Label)

```html
<m-checkbox>
  <input type="checkbox" id="custom" name="custom">
</m-checkbox>
<label for="custom">Custom label outside</label>
```

### Indeterminate State

The indeterminate state must be set via JavaScript:

```html
<m-checkbox label="Select all">
  <input type="checkbox" id="select-all">
</m-checkbox>

<script type="module">
  const checkbox = document.getElementById('select-all');
  checkbox.indeterminate = true;
</script>
```

### Form Integration

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

### With ARIA Attributes

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
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `''` | Label text displayed next to the checkbox |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Native `<input type="checkbox">` element |

## CSS Custom Properties

### Size and Spacing

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-size` | `20px` | Size of the checkbox |
| `--m-checkbox-gap` | `8px` | Gap between checkbox and label |

### Border

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-border-width` | `2px` | Border width |
| `--m-checkbox-border-color` | `#ccc` | Border color (default state) |
| `--m-checkbox-border-radius` | `4px` | Border radius |

### Background

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-background` | `transparent` | Background color (unchecked) |
| `--m-checkbox-background-checked` | `var(--m-color-primary, #0066cc)` | Background color (checked) |

### Checkmark

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-checkmark-color` | `white` | Checkmark color |
| `--m-checkbox-checkmark-size` | `12px` | Checkmark size |

### States

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-border-color-hover` | `#999` | Border color on hover |
| `--m-checkbox-border-color-focus` | `var(--m-color-primary, #0066cc)` | Border color on focus |
| `--m-checkbox-border-color-checked` | `var(--m-color-primary, #0066cc)` | Border color when checked |
| `--m-checkbox-opacity-disabled` | `0.5` | Opacity when disabled |

### Indeterminate State

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-indeterminate-background` | `var(--m-color-primary, #0066cc)` | Background color (indeterminate) |
| `--m-checkbox-indeterminate-mark-color` | `white` | Indeterminate mark color |

### Focus Indicator

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-focus-outline-width` | `2px` | Focus outline width |
| `--m-checkbox-focus-outline-offset` | `2px` | Focus outline offset |
| `--m-checkbox-focus-outline-color` | `var(--m-color-primary, #0066cc)` | Focus outline color |

### Label

| Property | Default | Description |
|----------|---------|-------------|
| `--m-checkbox-label-color` | `inherit` | Label text color |

## Theming Example

```css
/* Custom theme */
m-checkbox {
  --m-checkbox-size: 24px;
  --m-checkbox-border-radius: 6px;
  --m-checkbox-background-checked: #10b981;
  --m-checkbox-border-color-checked: #10b981;
}
```

## Accessibility

The m-checkbox component maintains perfect accessibility by keeping the native `<input type="checkbox">` element in the light DOM:

- ✅ Screen readers announce "checkbox" role
- ✅ All keyboard navigation works natively (Tab, Space)
- ✅ All ARIA attributes work without shadow DOM limitations
- ✅ Focus indicators are clearly visible
- ✅ Label association works correctly
- ✅ Form validation works natively

## Registration

### Auto-register

```javascript
import '@frdh/m-components/auto-register';
```

### Manual registration

```javascript
import { register } from '@frdh/m-components/checkbox';

register(); // Registers as 'm-checkbox'
// or
register('custom-checkbox'); // Registers with custom name
```

### Use without registration

```javascript
import { MCheckbox } from '@frdh/m-components/checkbox';

customElements.define('my-checkbox', MCheckbox);
```
