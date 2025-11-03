# M Development Tools

Development utilities and tooling used across the M Design System monorepo.

## Package

This is an internal workspace package (`@frdh/m-tools`) that provides development tooling for other packages in the monorepo.

## Directory Structure

```
packages/tools/
├── package.json
├── README.md
└── cem-plugins/              # Custom Elements Manifest analyzer plugins
    ├── examples-plugin.js    # Captures @example JSDoc tags
    └── README.md            # Plugin documentation
```

## CEM Plugins

Custom plugins for the [Custom Elements Manifest Analyzer](https://custom-elements-manifest.open-wc.org/) that enhance the generated manifest with additional metadata.

### Examples Plugin

Extracts `@example` JSDoc tags from component files and includes them in the CEM. This allows examples to:
- Live with component code (single source of truth)
- Be included in the standard CEM JSON
- Be consumed by documentation generators and other tools

See [cem-plugins/README.md](./cem-plugins/README.md) for details.

## Usage

These tools are imported and used by packages in the monorepo:

```javascript
// packages/components/custom-elements-manifest.config.js
import { examplesPlugin } from '@frdh/m-tools/cem-plugins/examples-plugin';

export default {
  plugins: [examplesPlugin()]
};
```

## Adding New Tools

When adding new development tools:
1. Create a descriptive subdirectory (e.g., `lint-rules/`, `build-scripts/`)
2. Include a README explaining the tool's purpose
3. Keep tools focused and reusable across packages
4. Document any configuration required

## Philosophy

Tools in this directory should:
- ✅ Be reusable across multiple packages
- ✅ Enhance the development workflow
- ✅ Support the no-build philosophy where possible
- ✅ Be well-documented and maintainable
