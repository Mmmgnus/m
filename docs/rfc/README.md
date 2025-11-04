# Request for Comments (RFC)

This directory contains RFCs for the M Design System. RFCs are design documents that describe new features, components, or significant changes to the design system.

## Purpose

RFCs help us:
- **Document design decisions** before implementation
- **Gather feedback** from the team early in the process
- **Create transparency** about what we're working on
- **Build consensus** on approach and API design
- **Preserve context** for future reference

## RFC Process

### 1. Create an RFC

When proposing a new component or significant change:

1. Copy the template from `docs/templates/rfc.template.md`
2. Name it `YYYY-MM-DD-[component-name].md` (e.g., `2025-11-03-m-button.md`)
3. Fill in all sections following the template
4. Set status to **Draft**
5. Add the discussion link (GitHub will auto-create the discussion)

### 2. Gather Feedback

- Share the RFC with the team
- Open a GitHub Discussion using the link in the RFC
- Iterate based on feedback
- Update the RFC document as needed
- Change status to **In Review** when ready

### 3. Decision

Once feedback is gathered and incorporated:
- Team makes a decision (Accept or Reject)
- Update status to **Accepted** or **Rejected**
- Document decision rationale if rejected

### 4. Implementation

For accepted RFCs:
- Create an ADR if architectural decisions were made
- Implement the component following the RFC
- Update status to **Implemented** when complete
- Link to the component source code

## Discussion Guidelines

Use GitHub Discussions (linked in each RFC) to:
- ✅ Ask clarifying questions
- ✅ Suggest alternative approaches
- ✅ Share use cases or requirements
- ✅ Point out accessibility concerns
- ✅ Discuss implementation details
- ✅ Vote with reactions (👍 👎)

## RFC Statuses

| Status | Description |
|--------|-------------|
| **Draft** | RFC is being written, not ready for full review |
| **In Review** | RFC is ready for team feedback |
| **Accepted** | RFC has been approved for implementation |
| **Implemented** | Component/feature has been built |
| **Rejected** | RFC was not approved (with rationale) |
| **Deprecated** | Implemented feature has been deprecated |

## Resources

- [RFC Template](../templates/rfc.template.md)
- [Component Guidelines](../COMPONENT_GUIDELINES.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [ADRs](../adr/)
- [GitHub Discussions](https://github.com/Mmmgnus/m/discussions/categories/rfcs)

## Examples

- [RFC: m-checkbox Component](./2025-11-03-m-checkbox.md)
- [RFC: m-radio Component](./2025-11-03-m-radio.md)
