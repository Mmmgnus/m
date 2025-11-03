# Component Tests

Manual test pages for M Design System components.

## Running Tests

The easiest way to view test pages is through the documentation site:

```bash
# From project root
npm run dev
```

Then navigate to the examples in the documentation.

## Viewing Test HTML Files

Since these use ES modules with bare specifiers (`import from 'lit'`), you need a dev server that resolves node_modules. 

From the **project root**:

```bash
npx @web/dev-server --node-resolve --open=/packages/components/test/radio.html
```

Or use any other dev server with module resolution support.

## Available Tests

- `radio.html` - Test page for m-radio and m-radio-group components
