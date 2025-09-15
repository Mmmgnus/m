# Component Patterns - AI Reference

This document contains common patterns and tasks for M Design System components to help AI provide consistent assistance.

## Component Creation Pattern

### Step-by-Step Component Creation
When asked to create a new component:

1. **Determine component purpose** and gather requirements
2. **Create component directory**: `packages/components/src/[component-name]/`
3. **Generate component file** using template pattern
4. **Update package.json exports**
5. **Add to auto-register.js**
6. **Generate manifests** with `npm run build`

### Template Replacement Pattern
When using `docs/templates/component.js.template`:

```javascript
// Replace these placeholders:
[COMPONENT_NAME] → kebab-case name (e.g., "text-input")
[COMPONENT_NAME_PASCAL] → PascalCase name (e.g., "TextInput") 
[COMPONENT_DESCRIPTION] → Brief description
[PROPERTY_NAME] → camelCase property name
[ATTRIBUTE_NAME] → kebab-case attribute name
[DEFAULT_VALUE] → appropriate default value
[PROPERTY_DESCRIPTION] → property purpose
[DEFAULT_SLOT_DESCRIPTION] → what goes in default slot
[EXAMPLE_ATTRIBUTE] → example attribute for docs
[EXAMPLE_CONTENT] → example content for docs
```

## Common Component Types & Patterns

### Form Input Components
```javascript
export class MTextInput extends LitElement {
  static properties = {
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true }
  };

  render() {
    return html`
      <input 
        .value=${this.value}
        .placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?required=${this.required}
        @input=${this._handleInput}
      />
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('m-input', {
      detail: { value: this.value },
      bubbles: true
    }));
  }
}
```

### Interactive Button Components  
```javascript
export class MButton extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    variant: { type: String },
    size: { type: String }
  };

  render() {
    return html`
      <button 
        ?disabled=${this.disabled}
        class="button button--${this.variant} button--${this.size}"
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick(e) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('m-click', {
        detail: { target: this },
        bubbles: true
      }));
    }
  }
}
```

### Container/Layout Components
```javascript
export class MCard extends LitElement {
  static properties = {
    elevated: { type: Boolean, reflect: true },
    padding: { type: String }
  };

  render() {
    return html`
      <div class="card" part="container">
        <slot name="header" part="header"></slot>
        <div class="card__content" part="content">
          <slot></slot>
        </div>
        <slot name="footer" part="footer"></slot>
      </div>
    `;
  }
}
```

## CSS Patterns

### Host Styles Template
```css
:host {
  display: block; /* or inline-block, flex, etc. */
  box-sizing: border-box;
  
  /* CSS custom properties with fallbacks */
  --m-component-color: var(--m-color-primary, #0066cc);
  --m-component-spacing: var(--m-spacing-md, 1rem);
}

:host([hidden]) {
  display: none !important;
}

:host([disabled]) {
  opacity: 0.6;
  pointer-events: none;
}
```

### Responsive Design Pattern
```css
:host {
  /* Mobile first */
  --component-size: var(--m-size-sm, 2rem);
}

@media (min-width: 768px) {
  :host {
    --component-size: var(--m-size-md, 2.5rem);
  }
}

@media (min-width: 1024px) {
  :host {
    --component-size: var(--m-size-lg, 3rem);
  }
}
```

## Event Handling Patterns

### Custom Events
```javascript
// Naming: m-[action] or m-[component]-[action]
this.dispatchEvent(new CustomEvent('m-change', {
  detail: { value: this.newValue, oldValue: this.previousValue },
  bubbles: true,
  composed: true // crosses shadow DOM boundary
}));
```

### Form Integration
```javascript
// For form-associated custom elements
static formAssociated = true;

constructor() {
  super();
  this._internals = this.attachInternals();
}

_updateFormValue() {
  this._internals.setFormValue(this.value);
}
```

## Accessibility Patterns

### ARIA Support
```javascript
render() {
  return html`
    <button
      role="button" 
      aria-label=${this.ariaLabel || this.label}
      aria-disabled=${this.disabled}
      aria-describedby=${this.describedBy}
    >
      <slot></slot>
    </button>
  `;
}
```

### Keyboard Navigation
```javascript
_handleKeyDown(e) {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      this._handleActivation();
      break;
    case 'Escape':
      this._handleEscape();
      break;
  }
}
```

## Package.json Export Updates

### Adding New Component Export
```json
{
  "exports": {
    "./button": "./src/button/m-button.js",
    "./input": "./src/input/m-input.js",
    "./card": "./src/card/m-card.js",
    "./auto-register": "./src/auto-register.js"
  }
}
```

### Auto-register.js Updates
```javascript
import { register as registerButton } from './button/m-button.js';
import { register as registerInput } from './input/m-input.js';
import { register as registerCard } from './card/m-card.js';

// Auto-register all components
registerButton();
registerInput();
registerCard();

// Export classes for direct usage
export { MButton } from './button/m-button.js';
export { MInput } from './input/m-input.js';
export { MCard } from './card/m-card.js';
```

## Testing Patterns

### Basic HTML Test Template
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Component Test</title>
  <style>
    body { font-family: system-ui; margin: 2rem; }
    .test-group { margin: 2rem 0; padding: 1rem; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>M-Component Tests</h1>
  
  <div class="test-group">
    <h2>Basic Usage</h2>
    <m-component>Test Content</m-component>
  </div>

  <script type="module">
    import { register } from './packages/components/src/component/m-component.js';
    register();
  </script>
</body>
</html>
```

## Common Questions & Responses

### "Create a new [X] component"
1. Ask for clarification on specific features needed
2. Create component directory and files
3. Update package exports and auto-register
4. Provide basic test HTML example

### "Add [feature] to existing component"  
1. Read current component implementation
2. Add property/method following established patterns
3. Update JSDoc documentation
4. Regenerate manifests if needed

### "Style the component to look like [description]"
1. Add CSS using Lit's `css` template literal
2. Use CSS custom properties for theming
3. Follow existing design patterns
4. Include responsive considerations

### "How do I use this component?"
1. Provide import and registration examples  
2. Show basic HTML usage
3. List available properties and events
4. Include common use cases

## Error Handling Patterns

### Property Validation
```javascript
willUpdate(changedProperties) {
  if (changedProperties.has('variant')) {
    const validVariants = ['primary', 'secondary', 'outline'];
    if (!validVariants.includes(this.variant)) {
      console.warn(`Invalid variant "${this.variant}". Using "primary".`);
      this.variant = 'primary';
    }
  }
}
```

### Graceful Degradation
```javascript
connectedCallback() {
  super.connectedCallback();
  
  // Check for required APIs
  if (!('customElements' in window)) {
    console.error('Custom Elements not supported');
    return;
  }
}
```

This pattern guide ensures consistent AI assistance while maintaining the project's no-build, standards-first approach.