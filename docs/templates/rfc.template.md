# RFC: [COMPONENT_NAME] Component

**Status:** Draft | In Review | Accepted | Implemented | Deprecated  
**Author:** LFDS Team [+ Co-Author Team Name]  
**Created:** YYYY-MM-DD  
**Updated:** YYYY-MM-DD

> 💬 **[Discuss this RFC](https://github.com/Mmmgnus/m/discussions/new?category=rfcs&title=RFC:%20[COMPONENT_NAME])** - Share feedback, ask questions, or suggest improvements

---

## Summary

[Brief 1-2 sentence description of the component and its purpose]

---

## Motivation

[Explain why this component is needed. What problem does it solve? How does it fit into the design system?]

- [Key benefit 1]
- [Key benefit 2]
- [Key benefit 3]

---

## Design

### Component Architecture

[Explain the technical architecture approach - Shadow DOM, Light DOM, or Shadow DOM + Slot pattern]

- [Architecture decision 1]
- [Architecture decision 2]

### Visual States

The component supports the following visual states:

1. **[State 1]** - [Description]
2. **[State 2]** - [Description]
3. **[State 3]** - [Description]

### Props/Attributes

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `[prop1]` | `[type]` | `'[default]'` | [Description] |
| `[prop2]` | `[type]` | `'[default]'` | [Description] |

---

## Accessibility Requirements

### WCAG Compliance

The component must meet WCAG 2.1 Level AAA standards:

#### Perceivable
- [Requirement 1]
- [Requirement 2]

#### Operable
- [Requirement 1]
- [Requirement 2]

#### Understandable
- [Requirement 1]
- [Requirement 2]

#### Robust
- [Requirement 1]
- [Requirement 2]

### Screen Reader Support

- [Requirement 1]
- [Requirement 2]

### Keyboard Interaction

- `[Key]`: [Action description]
- `[Key]`: [Action description]

---

## API Design

### Component Usage

```html
<!-- Basic usage -->
<m-[component]>
  [content]
</m-[component]>

<!-- With props -->
<m-[component] prop="value">
  [content]
</m-[component]>
```

### [Additional Usage Pattern 1]

```html
[Example code]
```

### [Additional Usage Pattern 2]

```html
[Example code]
```

---

## CSS Custom Properties

### Component-Specific Properties

```css
/* [Category 1] */
--m-[component]-[property]: [default-value];

/* [Category 2] */
--m-[component]-[property]: [default-value];
```

### Global Design Tokens

```css
/* [Category 1] */
--m-color-[name]: [default-value];
```

---

## Implementation Notes

### Technical Approach

1. **[Aspect 1]**
   - [Detail 1]
   - [Detail 2]

2. **[Aspect 2]**
   - [Detail 1]
   - [Detail 2]

### File Structure

```
packages/components/src/[component]/
├── m-[component].js           # Component implementation
└── [component].md             # Usage documentation (optional)
```

### Dependencies

- `lit` (version 3.0+)
- [Additional dependencies if any]

### Browser Support

All modern browsers supporting:
- Custom Elements v1
- Shadow DOM v1
- ES Modules
- [Additional requirements]

---

## Testing Requirements

### Manual Testing Checklist

- [ ] [Test case 1]
- [ ] [Test case 2]
- [ ] [Test case 3]

### Accessibility Testing Checklist

- [ ] [Accessibility test 1]
- [ ] [Accessibility test 2]
- [ ] [Accessibility test 3]

### Automated Testing

- [Test type 1]
- [Test type 2]

---

## Migration & Rollout

### Phase 1: [Phase Name]
- [Task 1]
- [Task 2]

### Phase 2: [Phase Name]
- [Task 1]
- [Task 2]

### Phase 3: [Phase Name]
- [Task 1]
- [Task 2]

---

## Open Questions

1. [Question 1]
2. [Question 2]
3. [Question 3]

---

## References

### Design Specifications
- [Design spec Figma file](URL) - [Description]

### Exploration Files
- [Exploration Figma file](URL) - [Description]

### Design System Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - [Relevant section]
- [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) - [Relevant section]

### Existing Components
- [m-component](../packages/components/src/component/m-component.js) - [Why referenced]

### Related Discussions
- [Ticket/Chat reference](URL) - [Description]

### Standards & Specifications
- [Standard name](URL) - [Description]

---

## Related Decisions (ADR)

- [ADR-XXX: Decision Title](./adr/XXX-decision-title.md) - [Why relevant]

_Or: No related ADRs exist for this component._

---

## Changelog

- **YYYY-MM-DD**: [Change description]
- **YYYY-MM-DD**: Initial RFC created by [Author]
