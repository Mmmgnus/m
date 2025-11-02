# M Design System Architecture

## Philosophy: No-Build, Standards-First

M Design System is built on the principle of staying as close to web standards as possible, avoiding unnecessary build complexity while maintaining developer experience.

## Core Principles

### 1. No-Build Development
- **Native ES Modules**: Direct browser support, no bundling required
- **Web Components**: Standards-based custom elements with Lit
- **TypeScript via JSDoc**: Type safety without compilation
- **Direct Import/Export**: Clear, traceable dependency chains

### 2. Runtime Registration
Components are designed for flexible registration:
```javascript
// Option 1: Auto-register all components
import '@frdh/m-components/auto-register';

// Option 2: Manual registration with default names
import { register as registerButton } from '@frdh/m-components/button';
registerButton();

// Option 3: Custom tag names
import { MButton, register } from '@frdh/m-components/button';
register('custom-button');
```

### 3. Component Structure
Every component follows this pattern:
- **Class Export**: The component class itself
- **Register Function**: For custom element registration
- **Default Tag Name**: Consistent naming convention
- **Rich JSDoc**: Type information and API documentation

## Technical Stack

### Core Technologies
- **Lit 3.0**: Lightweight web component library
- **Native ES Modules**: No bundler required
- **Custom Elements Manifest**: API documentation generation
- **TypeScript Definitions**: Generated from JSDoc annotations

### Development Tools
- **CEM Analyzer**: Generates `custom-elements.json`
- **TypeScript Compiler**: Generates `.d.ts` files from JSDoc
- **Native Browser APIs**: For development and testing

## File Organization

### Monorepo Structure
```
m/
├── packages/
│   ├── components/       # Web components library
│   └── css/             # CSS utilities & tokens (future)
├── apps/
│   ├── docs/            # Documentation site (future)
│   └── playground/      # Interactive examples (future)
└── tools/               # Development utilities
```

### Component Package Structure
```
packages/components/
├── src/
│   ├── _shared/         # Shared utilities
│   ├── button/
│   │   └── m-button.js  # Component implementation
│   └── auto-register.js # Convenience registration
├── types/               # Generated TypeScript definitions
├── custom-elements.json # Generated API manifest
└── package.json         # Export map and scripts
```

## Export Strategy

### Package.json Exports
```json
{
  "exports": {
    "./button": "./src/button/m-button.js",
    "./auto-register": "./src/auto-register.js"
  }
}
```

### Import Patterns
```javascript
// Individual components
import { MButton, register } from '@frdh/m-components/button';

// Auto-registration (development/demos)
import '@frdh/m-components/auto-register';
```

## Documentation Generation

### Custom Elements Manifest
- Generated via CEM Analyzer
- Provides machine-readable API documentation
- Powers static site generation
- Enables IDE tooling and autocomplete

### TypeScript Definitions
- Generated from JSDoc annotations
- Preserves type safety without compilation
- Enables rich IDE experience
- Compatible with TypeScript projects

## Future Considerations

### CSS Architecture (Planned)
- Design tokens as CSS custom properties
- Utility-first CSS classes
- Component-specific styles when needed
- Zero-runtime CSS-in-JS via Lit

### Build Optimization (Optional)
While maintaining no-build development:
- Optional bundling for production
- Tree-shaking friendly exports
- CDN-friendly distribution
- Backwards compatibility with build tools

## Design Decisions

### Why No Build?
1. **Faster Development**: Instant refresh, no compilation wait
2. **Debugging Clarity**: Source maps unnecessary, direct browser debugging
3. **Standard Compliance**: Future-proof, works with any bundler or none
4. **Reduced Complexity**: Less tooling, fewer dependencies

### Why JSDoc over TypeScript?
1. **Runtime Ready**: No compilation step required
2. **Standards Based**: JavaScript with annotations
3. **Tool Friendly**: CEM and TypeScript compiler understand JSDoc
4. **Gradual Adoption**: Easy migration path if build step becomes necessary

### Why Custom Registration?
1. **Flexibility**: Different apps can use different tag names
2. **Conflict Avoidance**: Prevents custom element naming conflicts
3. **Tree Shaking**: Only register components you use
4. **Testing**: Easier to test components in isolation

## Form Components Architecture

### Light DOM Pattern for Forms

Form components in M Design System use **light DOM** (no shadow DOM) to ensure perfect accessibility and standards compliance.

#### Why Light DOM for Forms?

**Accessibility Requirements:**
- Labels must connect to inputs via `for` attribute
- ARIA references (`aria-describedby`, `aria-labelledby`) must work across elements
- Screen readers need clean semantic structure
- Form validation and submission must work natively

**Shadow DOM Limitations:**
- ID references don't cross shadow boundaries
- `<label for="id">` can't reference input inside shadow DOM
- `aria-describedby="id"` can't reference external elements
- Creates unnecessary complexity in accessibility tree

#### Form Component Pattern

```javascript
export class MInput extends LitElement {
  // Render in light DOM
  createRenderRoot() {
    return this; // No shadow DOM
  }
  
  render() {
    return html`
      <style>
        /* Scoped styles using BEM naming */
        .m-input { }
        .m-input__label { }
      </style>
      
      <div class="m-input">
        ${this.label ? html`<label class="m-input__label">${this.label}</label>` : ''}
        <slot></slot>
      </div>
    `;
  }
}
```

#### Style Encapsulation Strategy

Without shadow DOM, we use:
1. **BEM Naming Convention**: `.m-component__element--modifier`
2. **Inline Styles**: `<style>` tags in template (scoped per instance)
3. **CSS Custom Properties**: For theming and design tokens
4. **Namespaced Classes**: `m-` prefix prevents global conflicts

#### Component Comparison

| Component Type | DOM Strategy | Use Case |
|----------------|--------------|----------|
| **Form Components** | Light DOM | button, input, checkbox, select, textarea, radio |
| **Presentational** | Shadow DOM | card, badge, avatar, chip, spinner |
| **Interactive Non-Form** | Shadow DOM | modal, dropdown, tooltip, accordion |
| **Layout** | Shadow DOM | container, grid, stack |

#### Benefits of This Approach

**Accessibility:**
- ✅ Perfect label/input connections
- ✅ All ARIA attributes work without limitations
- ✅ Screen readers work perfectly
- ✅ Keyboard navigation works natively

**Standards Compliance:**
- ✅ Uses native HTML form behavior
- ✅ No shadow DOM workarounds needed
- ✅ WCAG AAA compliant out of the box
- ✅ Works with any assistive technology

**Developer Experience:**
- ✅ Familiar HTML patterns
- ✅ External labels "just work"
- ✅ Form validation works natively
- ✅ No surprise behaviors

**Trade-offs:**
- ⚠️ Less style encapsulation (mitigated by BEM)
- ⚠️ Inline styles add some HTML weight
- ✅ But: Accessibility is non-negotiable

### Form Component List

All these components use light DOM:
- `m-button` - Button wrapper with optional label
- `m-input` - Text input wrapper with label, error, help text
- `m-textarea` - Textarea wrapper with label, error, help text
- `m-checkbox` - Checkbox wrapper with label
- `m-radio` - Radio button wrapper with label
- `m-select` - Select dropdown wrapper with label
- `m-form` - Form container with validation (future)

---

This architecture supports both simple script tag usage and sophisticated application integration while maintaining the benefits of modern development tooling.
