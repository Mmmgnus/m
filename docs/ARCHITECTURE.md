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

This architecture supports both simple script tag usage and sophisticated application integration while maintaining the benefits of modern development tooling.