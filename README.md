# M Design System

A no-build, standards-first design system built with native Web Components and Lit.

## Philosophy

M Design System is built on the principle of staying as close to web standards as possible, avoiding unnecessary build complexity while maintaining excellent developer experience.

- **No-Build Development**: Native ES modules, no bundling required
- **Web Components**: Standards-based custom elements with Lit
- **TypeScript via JSDoc**: Type safety without compilation
- **Runtime Registration**: Flexible component registration patterns

## Project Structure

```
m/
├── packages/
│   ├── components/       # Web components library
│   │   ├── src/
│   │   │   ├── button/   # Component directories
│   │   │   └── auto-register.js
│   │   ├── types/        # Generated TypeScript definitions
│   │   └── custom-elements.json
│   └── css/             # CSS utilities & tokens (planned)
├── apps/
│   ├── docs/            # Documentation site (planned)
│   └── playground/      # Interactive examples (planned)
├── docs/                # Project documentation
│   ├── ARCHITECTURE.md  # Technical decisions & patterns
│   ├── COMPONENT_GUIDELINES.md # How to create components
│   ├── DEVELOPMENT.md   # Development workflows
│   └── templates/       # Component templates
├── .warp/               # AI-specific context
└── tools/               # Development utilities
```

## Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/Mmmgnus/m.git
cd m

# Install dependencies
npm ci
```

### Development

Since we use a no-build approach, development is simple:

```bash
# Generate TypeScript definitions and Custom Elements Manifest
npm run build

# Create a test HTML file and use any local server
npx serve .
# or
python3 -m http.server 8000
```

### Using Components

#### Individual Component Import
```javascript
import { MButton, register } from '@frdh/m-components/button';
register(); // Registers as <m-button>
```

#### Auto-register All Components (Development)
```javascript
import '@frdh/m-components/auto-register';
// All components are now available
```

#### HTML Usage
```html
<m-button disabled>Disabled Button</m-button>
<m-button>Active Button</m-button>
```

## Architecture

- **Framework**: Lit 3.0 (Web Components)
- **Build System**: None for development, CEM + TypeScript for manifests
- **Package Manager**: npm workspaces
- **Module System**: Native ES modules
- **Styling**: Lit CSS with CSS custom properties
- **Documentation**: Custom Elements Manifest based

## Available Components

- **MButton** (`m-button`) - Simple button component ✅
- More components coming soon...

## Documentation

### For Developers
- [**Architecture Guide**](./docs/ARCHITECTURE.md) - Technical decisions and patterns
- [**Component Guidelines**](./docs/COMPONENT_GUIDELINES.md) - How to create new components  
- [**Development Guide**](./docs/DEVELOPMENT.md) - Common workflows and troubleshooting

### For AI Assistance
- [**Project Context**](./.warp/project-context.md) - AI-specific context and constraints
- [**Component Patterns**](./.warp/component-patterns.md) - Common patterns and tasks

## Creating Components

1. **Use the template**:
   ```bash
   cp docs/templates/component.js.template packages/components/src/your-component/m-your-component.js
   ```

2. **Follow the guidelines** in [`docs/COMPONENT_GUIDELINES.md`](./docs/COMPONENT_GUIDELINES.md)

3. **Update package exports** and auto-register

4. **Generate manifests**:
   ```bash
   npm run build
   ```

## Scripts

```bash
# Workspace management
npm run workspaces          # List all workspaces
npm run workspaces:list     # List workspaces with details

# Build and analysis
npm run build               # Generate types and CEM
npm run types               # Generate TypeScript definitions  
npm run analyze             # Generate Custom Elements Manifest

# Development
npm run dev                 # Start development (if configured)
npm run test                # Run tests (if configured)
npm run lint                # Lint code (if configured)

# Dependencies
npm run deps:update         # Update dependencies
npm run deps:outdated       # Check outdated dependencies
```

## Browser Support

All modern browsers that support:
- Custom Elements v1
- Shadow DOM v1  
- ES Modules
- ES2020+ features

## Contributing

1. **Read the guides**: Start with [`docs/COMPONENT_GUIDELINES.md`](./docs/COMPONENT_GUIDELINES.md)
2. **Follow conventions**: Use established patterns and naming
3. **Update documentation**: Keep JSDoc and manifests current
4. **Test your components**: Create test HTML files
5. **Follow git workflow**: Use conventional commits

## License

ISC © Magnus Fredlundh (magnus.dev)

## Links

- **Repository**: https://github.com/Mmmgnus/m.git
- **Package**: `@frdh/m-components`
- **Author**: Magnus Fredlundh (magnus.dev)
