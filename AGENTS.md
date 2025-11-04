# AI Agent Guide

This repository already contains extensive documentation. Use it as the primary source of truth before making changes.

## Key Principles
- Follow the no-build philosophy described in `.warp/project-context.md`. Never introduce bundlers or TypeScript files.
- Components must live under `packages/components/src/` and follow the file/class/tag naming conventions outlined in `.warp/project-context.md` and `docs/COMPONENT_GUIDELINES.md`.
- **Form components use the Shadow DOM + Slot pattern** documented in `docs/adr/001-shadow-dom-slot-pattern-for-form-components.md` for style isolation with perfect accessibility.
- Prefer native Web Components built with Lit (`import { LitElement, html, css } from 'lit';`).
- Keep JSDoc annotations up to date for components, properties, slots, and events.

## Workflow Expectations

### Adding New Components
1. **Create an RFC first** in `docs/rfc/` following the template in `docs/templates/rfc.template.md`
2. Implement the component in `packages/components/src/[component-name]/`
3. Update package exports in `packages/components/package.json`
4. Update auto-register in `packages/components/src/auto-register.js`
5. Create test page in `packages/components/test/[component-name].html`
6. Update test index in `packages/components/test/index.html`
7. Run `npm run build` to regenerate TypeScript definitions and Custom Elements Manifest

### Modifying Existing Components
- Update component code and JSDoc
- Run `npm run build` after changes
- Update test pages if behavior changes
- Update RFC if architectural decisions change

### Documentation
- RFCs go in `docs/rfc/` (use template from `docs/templates/rfc.template.md`)
- ADRs go in `docs/adr/` for architectural decisions
- Component patterns and guidelines live in `docs/` and `.warp/`
- Review existing documentation before making changes

## Pull Request Notes
- Summaries should highlight notable component additions/updates and mention if manifests or exports were refreshed.
- Reference relevant docs (`docs/rfc/`, `docs/adr/`, `.warp/`) when explaining design decisions.
- For new components, link to the RFC in the PR description.

