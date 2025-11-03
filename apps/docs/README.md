# M Design System Documentation Site

A simple, no-build documentation site generator that reads the Custom Elements Manifest and generates static HTML pages.

## Features

- **CEM-Based**: Automatically generates documentation from `custom-elements.json`
- **No Build Step**: Pure HTML/CSS/JS output, no bundler required
- **Live Examples**: Component examples work directly in the browser using native ES modules
- **Clean Design**: Simple, accessible documentation interface

## Usage

### Build the documentation

```bash
npm run build
```

This reads the Custom Elements Manifest from `packages/components/custom-elements.json` and generates:
- `dist/index.html` - Homepage with component catalog
- `dist/components/*.html` - Individual component pages
- `dist/styles.css` - Site styles

### Serve locally

```bash
npm run serve
```

Or use any static server:
```bash
npx serve dist
# or
cd dist && python3 -m http.server 8000
```

### Development

```bash
npm run dev
```

Builds and serves the site in one command.

## Structure

```
apps/docs/
├── scripts/
│   ├── generate.js              # Main orchestrator
│   ├── generators/
│   │   ├── layout.js            # HTML layout templates
│   │   ├── pages.js             # Page generation  
│   │   ├── styles.js            # CSS generation
│   │   └── examples.js          # Example rendering
│   └── utils/
│       └── cem.js               # CEM reading and parsing
├── dist/                        # Generated documentation (git-ignored)
│   ├── index.html
│   ├── components/
│   ├── styles.css
│   └── components-src/          # Copied component sources for live examples
├── package.json
└── README.md
```

## How It Works

1. **Read CEM**: The generator reads `custom-elements.json` from the components package
2. **Extract Components**: Parses the manifest to extract component metadata (attributes, slots, examples, etc.)
3. **Generate Pages**: Creates HTML pages using modular template functions
4. **Copy Sources**: Copies component source files so live examples can import them

### CEM as Source of Truth

The Custom Elements Manifest is the **single source of truth** for all component documentation. Examples are captured from `@example` JSDoc tags during CEM analysis via a custom plugin (`packages/tools/cem-plugins/examples-plugin.js`).

This means:
- ✅ No duplication - examples live in component files only
- ✅ No parsing at docs build time - everything comes from CEM
- ✅ Any tool that reads CEM can access examples
- ✅ Examples are versioned with the components

## Live Examples

Component pages include live examples that use the actual web components via:

```html
<script type="module">
  import '@frdh/m-components/auto-register';
</script>
```

This works because:
- The documentation is served from the monorepo root context
- Components use native ES modules
- No build step is required

## Writing Examples

Examples are defined in component files using JSDoc `@example` tags:

```javascript
/**
 * Component description
 *
 * @element m-button
 *
 * @example
 * # Variants
 * Different visual styles for the button
 * ```html
 * <m-button variant="primary">
 *   <button>Primary</button>
 * </m-button>
 * <m-button variant="secondary">
 *   <button>Secondary</button>
 * </m-button>
 * ```
 *
 * @example
 * # Sizes
 * ```html
 * <m-button size="small">
 *   <button>Small</button>
 * </m-button>
 * <m-button size="large">
 *   <button>Large</button>
 * </m-button>
 * ```
 */
export class MButton extends LitElement {
  // ...
}
```

### Example Format

Each `@example` tag should follow this format:

- **Title**: First line starting with `#` (optional)
- **Description**: Text before the code block (optional)  
- **Code**: HTML/JS wrapped in triple backticks

The parser extracts:
- `title`: From `# Title` line
- `description`: Text outside code blocks
- `code`: Content inside ```html or ```js blocks

### Benefits

✅ **Single Source of Truth**: Examples live with component code
✅ **No Duplication**: No need to maintain examples separately
✅ **IDE Support**: Examples show up in JSDoc tooltips
✅ **Easy to Update**: Change component and examples together

## Customization

### Styles

The site styles are in `scripts/generators/styles.js`. Edit the `generateStyles()` function and rebuild.

### Layout

The HTML layout is in `scripts/generators/layout.js`. Component pages are generated in `scripts/generators/pages.js`.

### Examples

Example rendering logic is in `scripts/generators/examples.js`.

## Future Enhancements

- [x] Modular architecture for better maintainability
- [x] Extract examples from @example JSDoc tags
- [ ] Dark mode support
- [ ] Search functionality
- [ ] Watch mode for auto-regeneration
- [ ] Better syntax highlighting for code blocks
- [ ] Component playground with live code editing
