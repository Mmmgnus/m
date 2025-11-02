# Button Web Component Evaluation

## Purpose

This evaluation compares three different approaches to building an accessible, design-token-based button web component using Lit. The goal is to determine which approach provides the best balance of:

- **Accessibility** - Full ARIA support and native button behavior
- **Developer Experience** - Simple, intuitive API
- **Standards Alignment** - Stays close to web platform standards
- **Maintainability** - Clear, testable code
- **Token Integration** - Seamless use of CSS custom properties

## The Three Approaches

### Approach 1: Custom Implementation
**Location**: `approach-1-custom/`

A button built entirely from scratch using Lit. This approach implements all button functionality manually, including:
- Focus management
- Keyboard event handling (Space/Enter)
- Form association
- ARIA roles and attributes
- Type variants (button, submit, reset)

**Pros**: Full control, highly customizable
**Cons**: Most code to maintain, must replicate native behavior

---

### Approach 2: Native Button in Shadow DOM
**Location**: `approach-2-shadow/`

Wraps a native `<button>` element inside the component's shadow DOM. The component manages the button's attributes and styling.

**Pros**: Leverages native button behavior, less manual implementation
**Cons**: Shadow DOM can complicate ARIA relationships and form association

---

### Approach 3: Slot-Based Wrapper
**Location**: `approach-3-slot/`

The component provides a styled container while the developer supplies their own `<button>` element via a slot.

**Pros**: Least "magical", preserves all native behavior, clear separation of concerns
**Cons**: Requires developers to provide the button element themselves

## Evaluation Criteria

See `EVALUATION_CRITERIA.md` for the complete testing checklist.

Key areas assessed:
1. ✅ Accessibility compliance (ARIA, keyboard, screen readers)
2. ✅ Form integration (submission, reset, validation)
3. ✅ Design token application
4. ✅ Developer experience
5. ✅ Code maintainability

## Running the Evaluation

### 1. Start the dev server
```bash
cd apps/button-evaluation
npm run dev
```

### 2. Open the test harness
The browser will automatically open to: `http://localhost:3000/test-harness.html`

### 3. Test each approach
Use the interactive test page to:
- Click and keyboard navigate buttons
- Test form submission behavior
- Inspect with browser dev tools
- Test with VoiceOver (macOS): `Cmd+F5`

### 4. Document findings
Record observations in `EVALUATION_RESULTS.md`

## AI Implementation Specifications

Each AI should follow their respective specification file:
- `approach-1-custom/SPEC.md`
- `approach-2-shadow/SPEC.md`
- `approach-3-slot/SPEC.md`

All implementations must:
- Use Lit as the base framework
- Support design tokens (CSS custom properties)
- Follow the M Design System component pattern
- Include comprehensive JSDoc documentation
- Export a `register()` function

## Design Tokens Required

All button implementations should use these CSS custom properties:

```css
--m-color-primary
--m-color-primary-hover
--m-color-text
--m-font-family
--m-font-size-base
--m-spacing-sm
--m-spacing-md
--m-border-radius
--m-transition-duration
```

## Success Metrics

An approach is considered successful if it:
- ✅ Passes all accessibility tests
- ✅ Behaves identically to a native button in forms
- ✅ Properly applies and responds to design tokens
- ✅ Has clear, maintainable code
- ✅ Provides good developer experience

## Next Steps

After evaluation:
1. Review findings as a team
2. Select the winning approach
3. Refine the implementation
4. Create final `m-button` component
5. Document patterns for other form components
