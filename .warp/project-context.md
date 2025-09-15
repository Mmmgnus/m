# M Design System - AI Project Context

This document provides AI-specific context about the M Design System project to enable better assistance and code generation.

## Project Identity

- **Project Name**: M Design System
- **Owner**: Magnus Fredlundh (magnus.dev)
- **Repository**: https://github.com/Mmmgnus/m.git
- **Package Scope**: `@frdh/m-components`

## Core Philosophy & Constraints

### No-Build Development
- **NEVER suggest build tools** (Webpack, Rollup, Vite, etc.) for development
- **Always use native ES modules** with `.js` file extensions
- **JSDoc for TypeScript** - no `.ts` files or compilation
- **Direct browser imports** - no bundling required

### Web Standards First
- Use native Web Components and Custom Elements v1
- Leverage Shadow DOM for encapsulation
- ES2020+ features are acceptable
- Avoid polyfills unless absolutely necessary

## File Structure Patterns

### Component File Pattern
```
packages/components/src/[component-name]/
├── m-[component-name].js    # Main component file
├── [component-name].md      # Documentation (optional)
└── [component-name].stories.js # Examples (optional)
```

### Component Code Pattern
```javascript
// Always start with this import
import { LitElement, html, css } from 'lit';

// Class naming: M + PascalCase
export class MComponentName extends LitElement {
  static defaultTagName = 'm-component-name'; // kebab-case
  // ... rest of component
}

// Always include register function
export function register(tagName = MComponentName.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MComponentName);
  }
  return tagName;
}
```

## Naming Conventions

### Files & Components
- **Component files**: `m-component-name.js` (kebab-case, m- prefix)
- **Class names**: `MComponentName` (PascalCase, M prefix) 
- **Tag names**: `m-component-name` (kebab-case, m- prefix)
- **Directories**: `component-name` (kebab-case, no prefix)

### Properties & Attributes
- **JavaScript properties**: `camelCase`
- **HTML attributes**: `kebab-case`
- **CSS custom properties**: `--m-component-property`

## Package.json Export Strategy

Always update exports when adding components:
```json
{
  "exports": {
    "./button": "./src/button/m-button.js",
    "./new-component": "./src/new-component/m-new-component.js",
    "./auto-register": "./src/auto-register.js"
  }
}
```

## JSDoc Requirements

### Component Documentation
```javascript
/**
 * Brief one-line description
 *
 * Longer description with details
 *
 * @element m-component-name
 * @slot - Default slot description
 * @fires custom-event - Event description
 */
```

### Property Documentation
```javascript
static properties = {
  /**
   * Property purpose and usage
   * @type {string}
   * @default 'default-value'
   */
  propertyName: { type: String, attribute: 'property-name' }
};
```

## Development Workflow

### Adding New Components
1. Create directory: `packages/components/src/component-name/`
2. Use template: `docs/templates/component.js.template`
3. Update package exports
4. Add to auto-register
5. Run `npm run build` to regenerate manifests

### Testing Components
- Create simple HTML files with script imports
- Use browser dev server (serve, http-server, etc.)
- No build step needed - direct file changes

## Common Anti-Patterns to Avoid

### ❌ Don't Do This
```javascript
// TypeScript files
import { Component } from './component.ts';

// Build tool imports
import styles from './styles.css';

// Node-style imports without extensions
import { MButton } from './button';

// Complex build configurations
// webpack.config.js, rollup.config.js, etc.
```

### ✅ Do This Instead
```javascript
// JavaScript with JSDoc
import { LitElement } from 'lit';

// Lit CSS
import { css } from 'lit';

// Full file paths with extensions
import { MButton } from './button/m-button.js';

// Simple package.json scripts for CEM generation
```

## Styling Approach

### Component Styles
- Use `css` template literal from Lit
- Include `:host` styles for the component container
- Use CSS custom properties for theming
- Logical CSS properties preferred (margin-inline, etc.)

### CSS Custom Properties Pattern
```css
:host {
  /* Component defaults */
  --m-component-color: var(--m-color-primary, #0066cc);
  --m-component-padding: var(--m-spacing-md, 1rem);
}
```

## Registration Patterns

### Development/Testing
```javascript
import { register } from './src/button/m-button.js';
register(); // Uses default tag name
```

### Custom Tag Names
```javascript
import { MButton, register } from './src/button/m-button.js';
register('my-custom-button');
```

### Auto-registration
```javascript
import './src/auto-register.js'; // Registers all components
```

## Future Considerations

### Planned Features
- CSS utilities package (`packages/css/`)
- Documentation site generation from CEM
- Optional production bundling (while maintaining no-build dev)

### Technology Constraints
- Must work in all modern browsers
- No Node.js runtime dependencies for components
- CDN-friendly distribution
- Framework agnostic (works with React, Vue, etc.)

This context should guide all AI assistance to maintain consistency with the project's no-build, standards-first philosophy.