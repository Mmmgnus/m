# AI Agent Guide

This repository already contains extensive documentation. Use it as the primary source of truth before making changes.

## Key Principles
- Follow the no-build philosophy described in `.warp/project-context.md`. Never introduce bundlers or TypeScript files.
- Components must live under `packages/components/src/` and follow the file/class/tag naming conventions outlined in `.warp/project-context.md` and `docs/COMPONENT_GUIDELINES.md`.
- Prefer native Web Components built with Lit (`import { LitElement, html, css } from 'lit';`).
- Keep JSDoc annotations up to date for components, properties, slots, and events.

## Workflow Expectations
- When adding or modifying components, remember to update package exports in `packages/components/package.json` and the auto-register entry in `packages/components/src/auto-register.js`.
- Run `npm run build` after component changes to regenerate TypeScript definitions and the Custom Elements Manifest.
- Documentation and patterns for components live in `docs/` and `.warp/`; review them for detailed guidance.

## Pull Request Notes
- Summaries should highlight notable component additions/updates and mention if manifests or exports were refreshed.
- Reference relevant docs (`docs/`, `.warp/`) when explaining design decisions.

