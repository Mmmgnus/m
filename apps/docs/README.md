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
│   └── generate.js       # Static site generator
├── dist/                 # Generated documentation (git-ignored)
│   ├── index.html
│   ├── components/
│   ├── styles.css
│   └── components-src/   # Copied component sources for live examples
├── package.json
└── README.md
```

## How It Works

1. **Read CEM**: The generator reads `custom-elements.json` from the components package
2. **Extract Components**: Parses the manifest to extract component metadata (attributes, slots, etc.)
3. **Generate Pages**: Creates HTML pages using simple template functions
4. **Copy Sources**: Copies component source files so live examples can import them

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

## Customization

### Styles

The site styles are generated in `generate.js` in the `generateStyles()` function. To customize:
1. Edit the CSS in that function
2. Run `npm run build` to regenerate

### Layout

The HTML layout is defined in the `layout()` function in `generate.js`. Component pages use the `generateComponentPage()` function.

## Future Enhancements

- [ ] Add component examples from markdown files
- [ ] Support for component variants/states
- [ ] Dark mode support
- [ ] Search functionality
- [ ] Watch mode for auto-regeneration
- [ ] Better syntax highlighting for code blocks
- [ ] Component playground with live code editing
