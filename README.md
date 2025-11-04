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
│   │   ├── src/          # Component source files
│   │   ├── test/         # Manual test pages
│   │   ├── types/        # Generated TypeScript definitions
│   │   └── custom-elements.json
│   └── css/             # CSS utilities & tokens (planned)
├── apps/
│   ├── docs/            # Documentation site generator
│   └── playground/      # Interactive examples (planned)
├── docs/                # Project documentation
│   ├── rfc/             # Request for Comments (RFCs)
│   ├── adr/             # Architecture Decision Records (ADRs)
│   ├── templates/       # RFC and component templates
│   ├── ARCHITECTURE.md  # Technical decisions & patterns
│   ├── COMPONENT_GUIDELINES.md # How to create components
│   └── DEVELOPMENT.md   # Development workflows
├── .warp/               # AI-specific context
├── AGENTS.md            # AI agent workflow guide
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

- **m-button** - Button wrapper with variants and sizes ✅
- **m-input** - Text input with label, error, and help text ✅
- **m-checkbox** - Checkbox with label support ✅
- **m-radio** - Radio button with label support ✅
- **m-radio-group** - Radio button group wrapper ✅
- More components coming soon...

## Documentation

### For Developers
- [**Architecture Guide**](./docs/ARCHITECTURE.md) - Technical decisions and patterns
- [**Component Guidelines**](./docs/COMPONENT_GUIDELINES.md) - How to create new components  
- [**Development Guide**](./docs/DEVELOPMENT.md) - Common workflows and troubleshooting

### Design & Planning
- [**RFCs**](./docs/rfc/README.md) - Request for Comments for new components and features
- [**ADRs**](./docs/adr/README.md) - Architecture Decision Records
- [**GitHub Discussions**](https://github.com/Mmmgnus/m/discussions) - Discuss RFCs and ask questions

### For AI Assistance
- [**AGENTS.md**](./AGENTS.md) - Complete AI agent workflow guide
- [**Project Context**](./.warp/project-context.md) - AI-specific context and constraints
- [**Component Patterns**](./.warp/component-patterns.md) - Common patterns and tasks

## Creating Components

### 1. Create an RFC
Before implementing a new component, create an RFC to gather feedback:

```bash
cp docs/templates/rfc.template.md docs/rfc/YYYY-MM-DD-m-component-name.md
```

See [RFC Guide](./docs/rfc/README.md) for the full process.

### 2. Implement the Component

1. **Use the template**:
   ```bash
   cp docs/templates/component.js.template packages/components/src/your-component/m-your-component.js
   ```

2. **Follow the guidelines** in [`docs/COMPONENT_GUIDELINES.md`](./docs/COMPONENT_GUIDELINES.md)

3. **Update package exports** in `packages/components/package.json`

4. **Update auto-register** in `packages/components/src/auto-register.js`

5. **Create test page** in `packages/components/test/your-component.html`

6. **Generate manifests**:
   ```bash
   npm run build
   ```

For complete workflow, see [AGENTS.md](./AGENTS.md).

## Documentation Site

The design system includes a CEM-based documentation site that automatically generates pages from the Custom Elements Manifest.

```bash
# From the project root:
npm run dev         # Build and serve the docs site
npm run docs:build  # Just build the docs

# Or from apps/docs:
cd apps/docs
npm run dev
```

The documentation site:
- Automatically reads `custom-elements.json` from the components package
- Generates static HTML pages with component API documentation
- Includes live, interactive component examples
- Requires no build step to view (pure HTML/CSS/JS)

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
