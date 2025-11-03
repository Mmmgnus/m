# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records (ADRs) for the M Design System.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Format

ADRs should follow this naming convention:
```
XXX-decision-title.md
```

Where:
- `XXX` is a sequential number (e.g., 001, 002, 003)
- `decision-title` is a short kebab-case description

## Example

```
001-shadow-dom-slot-pattern-for-form-components.md
002-css-custom-properties-theming-strategy.md
```

## Structure

Each ADR should contain:

1. **Title** - Short noun phrase
2. **Status** - Proposed, Accepted, Deprecated, Superseded
3. **Context** - What is the issue we're facing?
4. **Decision** - What is the change we're making?
5. **Consequences** - What becomes easier or more difficult?

## When to Create an ADR

Create an ADR when making decisions that:
- Affect the architecture or structure of the design system
- Have long-term implications
- Are difficult to reverse
- Need to be communicated to the team
- Should be referenced in RFCs

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
