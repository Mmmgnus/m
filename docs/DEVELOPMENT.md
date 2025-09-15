# Development Guide

This guide covers common development workflows and tasks for M Design System.

## Quick Start

### Initial Setup
```bash
# Clone and install
git clone https://github.com/Mmmgnus/m.git
cd m
npm ci

# Verify setup
npm run workspaces:list
```

### Development Server
Since we're using a no-build approach, development is as simple as:

1. **Create test HTML files** in project root or use live server
2. **Import components directly** from source files
3. **No compilation step** needed - changes are immediately visible

Example test file (`test.html`):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>M Design System Test</title>
</head>
<body>
  <h1>Component Testing</h1>
  
  <m-button disabled>Disabled Button</m-button>
  <m-button>Active Button</m-button>

  <script type="module">
    import { register } from './packages/components/src/button/m-button.js';
    register();
  </script>
</body>
</html>
```

## Common Workflows

### Adding a New Component

1. **Create component directory:**
   ```bash
   mkdir packages/components/src/your-component
   ```

2. **Create component file:**
   ```bash
   # Use the template from docs/templates/component.js.template
   cp docs/templates/component.js.template packages/components/src/your-component/m-your-component.js
   ```

3. **Update package exports:**
   ```json
   // packages/components/package.json
   {
     "exports": {
       "./your-component": "./src/your-component/m-your-component.js"
     }
   }
   ```

4. **Add to auto-register:**
   ```javascript
   // packages/components/src/auto-register.js
   import { register as registerYourComponent } from './your-component/m-your-component.js';
   registerYourComponent();
   export { MYourComponent } from './your-component/m-your-component.js';
   ```

5. **Regenerate manifests:**
   ```bash
   npm run build
   ```

### Testing Components

#### Manual Testing
Create test files for each component:
```bash
# Create test directory
mkdir -p test/components

# Create component test file
cat > test/components/button-test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Button Component Test</title>
  <style>
    body { font-family: system-ui; margin: 2rem; }
    .test-group { margin: 2rem 0; padding: 1rem; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>M-Button Tests</h1>
  
  <div class="test-group">
    <h2>Basic Button</h2>
    <m-button>Click me</m-button>
  </div>
  
  <div class="test-group">
    <h2>Disabled Button</h2>
    <m-button disabled>Can't click me</m-button>
  </div>

  <script type="module">
    import { register } from '../../packages/components/src/button/m-button.js';
    register();
  </script>
</body>
</html>
EOF
```

#### Live Server Testing
```bash
# Install a simple server (if not already available)
npx serve .

# Or use Python
python3 -m http.server 8000

# Or use Node
npx http-server
```

### Documentation Workflows

#### Generate Component Manifests
```bash
# Generate TypeScript definitions and CEM
npm run build

# Or run individually
npm run types    # Generate .d.ts files
npm run analyze  # Generate custom-elements.json
```

#### View Generated Documentation
```bash
# Check the generated manifest
cat packages/components/custom-elements.json | jq '.modules[].declarations[] | .name'

# View TypeScript definitions
ls packages/components/types/
```

### Package Management

#### Working with Workspaces
```bash
# List all workspaces
npm run workspaces:list

# Install dependencies in specific workspace
npm install lit --workspace=packages/components

# Run scripts across workspaces
npm run build --workspaces --if-present
npm run test --workspaces --if-present
```

#### Dependency Management
```bash
# Check for outdated dependencies
npm run deps:outdated

# Update dependencies
npm run deps:update

# Install new dependency in root
npm install --save-dev some-tool

# Install in specific package
npm install lit --workspace=packages/components
```

## Development Tools

### VS Code Setup

#### Recommended Extensions
- **Lit Plugin**: Syntax highlighting and IntelliSense
- **Custom Elements Manifest**: Component documentation
- **JavaScript and TypeScript**: Built-in language support

#### Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.preferences.allowIncompleteCompletions": true,
  "html.customData": ["packages/components/custom-elements.json"]
}
```

### Browser DevTools

#### Custom Elements Inspector
Modern browsers provide excellent debugging for web components:
- Chrome DevTools → Elements → Show custom elements
- Firefox DevTools → Inspector → Custom elements

#### Performance Profiling
Since components are native web components:
- Use browser's built-in performance tools
- Profile shadow DOM rendering
- Monitor custom element lifecycle

## Troubleshooting

### Common Issues

#### Import Resolution
**Problem**: Module not found errors
**Solution**: Use relative paths or check package.json exports

```javascript
// ❌ Won't work without bundler
import { MButton } from '@frdh/m-components/button';

// ✅ Works in development
import { MButton } from './packages/components/src/button/m-button.js';
```

#### Custom Element Registration
**Problem**: Component not rendering
**Solution**: Ensure component is registered

```javascript
// ❌ Forgot to register
import { MButton } from './src/button/m-button.js';
// <m-button> won't work

// ✅ Properly registered
import { MButton, register } from './src/button/m-button.js';
register();
// <m-button> will work
```

#### TypeScript Errors
**Problem**: TypeScript can't find component types
**Solution**: Regenerate type definitions

```bash
npm run types
```

### Debugging Components

#### Shadow DOM Inspection
```javascript
// In browser console
const button = document.querySelector('m-button');
console.log(button.shadowRoot); // Inspect shadow DOM
```

#### Component State
```javascript
// Access component properties
const button = document.querySelector('m-button');
console.log(button.disabled);
button.disabled = true;
```

#### Event Debugging
```javascript
// Listen for custom events
document.addEventListener('m-button-click', (e) => {
  console.log('Button clicked:', e.detail);
});
```

## Git Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feature/new-component
git checkout -b fix/button-styling
git checkout -b docs/component-guide

# After development
git add .
git commit -m "feat: add input component with validation"
git push origin feature/new-component
```

### Commit Messages
Follow conventional commits:
- `feat:` - New component or feature
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code formatting, no logic changes
- `refactor:` - Code structure changes
- `test:` - Adding or updating tests

### Pre-commit Checks
```bash
# Run before committing
npm run lint
npm run build
npm test
```

## Production Considerations

### Bundle Preparation (Future)
While maintaining no-build development:
```bash
# Optional: Generate production bundle
npm run bundle  # (not implemented yet)

# Always generate latest manifests
npm run build
```

### CDN Distribution
Components are designed to work from CDN:
```html
<script type="module">
  import { register } from 'https://cdn.jsdelivr.net/npm/@frdh/m-components@latest/src/button/m-button.js';
  register();
</script>
```

This development guide ensures smooth workflows while maintaining the no-build philosophy of M Design System.