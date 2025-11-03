# Custom Elements Manifest Plugins

Custom plugins for the CEM Analyzer to enhance the generated manifest.

## Examples Plugin

The `examples-plugin.js` captures `@example` JSDoc tags from component files and includes them in the Custom Elements Manifest.

### How It Works

The plugin runs during the CEM analysis phase and:

1. Finds class declarations with `@example` JSDoc tags
2. Parses each example to extract:
   - **Title**: From lines starting with `#`
   - **Description**: Text outside code blocks
   - **Code**: Content inside triple-backtick code blocks
3. Adds the examples array to the component declaration in the CEM

### Example Format

In your component files:

```javascript
/**
 * Component description
 *
 * @element m-button
 *
 * @example
 * # Example Title
 * Optional description of what this example demonstrates
 * ```html
 * <m-button variant="primary">
 *   <button>Click me</button>
 * </m-button>
 * ```
 *
 * @example
 * # Another Example
 * ```html
 * <m-button size="large">
 *   <button>Large Button</button>
 * </m-button>
 * ```
 */
export class MButton extends LitElement {
  // ...
}
```

### Output in CEM

```json
{
  "kind": "class",
  "name": "MButton",
  "tagName": "m-button",
  "examples": [
    {
      "title": "Example Title",
      "description": "Optional description of what this example demonstrates",
      "code": "<m-button variant=\"primary\">\n  <button>Click me</button>\n</m-button>"
    },
    {
      "title": "Another Example",
      "description": "",
      "code": "<m-button size=\"large\">\n  <button>Large Button</button>\n</m-button>"
    }
  ]
}
```

### Benefits

✅ **Single Source of Truth**: Examples live with component code
✅ **CEM Integration**: Examples are part of the standard manifest
✅ **Tooling Support**: Any tool that reads CEM can access examples
✅ **Documentation Generation**: Docs site automatically includes examples
✅ **IDE Support**: Examples appear in JSDoc tooltips

## Configuration

The plugin is configured in `packages/components/custom-elements-manifest.config.js`:

```javascript
import { examplesPlugin } from '@frdh/m-tools/cem-plugins/examples-plugin';

export default {
  litelement: true,
  globs: ['src/**/*.js'],
  plugins: [
    examplesPlugin()
  ]
};
```

## Usage

After adding `@example` tags to your components:

```bash
# Regenerate CEM with examples
npm run analyze

# Build docs (will use examples from CEM)
npm run build --workspace=apps/docs
```

## Implementation Details

The plugin uses the TypeScript Compiler API to:
- Access JSDoc tags during AST traversal
- Extract comment text from `@example` tags
- Parse the structured format (title, description, code)
- Add the examples to the CEM declaration

The parsing logic handles:
- Optional titles (lines starting with `#`)
- Optional descriptions (text before code blocks)
- Code blocks (content between triple backticks)
- Multiple examples per component
