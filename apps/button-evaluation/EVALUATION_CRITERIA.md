# Button Evaluation Criteria

This document provides a comprehensive checklist for evaluating each button implementation approach.

## 1. Accessibility (Critical)

### Keyboard Navigation
- [ ] **Tab navigation** - Can focus the button using Tab/Shift+Tab
- [ ] **Space key** - Activates the button (fires click event)
- [ ] **Enter key** - Activates the button (fires click event)
- [ ] **Focus indicator** - Clear visual focus ring/outline
- [ ] **Focus management** - Focus remains on button after activation (unless navigating away)

### ARIA Support
- [ ] **Default role** - Implicit or explicit button role
- [ ] **aria-label** - Custom labels work correctly
- [ ] **aria-labelledby** - Can reference external labels
- [ ] **aria-describedby** - Can reference descriptions
- [ ] **aria-pressed** - Toggle button state (for toggle variants)
- [ ] **aria-disabled** - Disabled state communicated to AT
- [ ] **aria-busy** - Loading state support (optional)
- [ ] **aria-expanded** - For buttons that control disclosure (optional)

### Screen Reader Testing (VoiceOver on macOS)
- [ ] **Announced as button** - "Button" or "Submit button" announced
- [ ] **Label read correctly** - Text content or aria-label read
- [ ] **Disabled state** - "Dimmed" or "unavailable" announced
- [ ] **State changes** - Pressed state changes announced (if applicable)
- [ ] **Form context** - Understood within form context

### Disabled State
- [ ] **Visual indication** - Clearly looks disabled
- [ ] **No interaction** - Cannot be clicked or focused
- [ ] **Keyboard skip** - Tab navigation skips disabled buttons
- [ ] **Cursor style** - Shows not-allowed or default cursor
- [ ] **ARIA or attribute** - Uses disabled attribute or aria-disabled

---

## 2. Form Integration (Critical)

### Form Submission
- [ ] **Submit type** - `type="submit"` submits parent form
- [ ] **Button type** - `type="button"` does NOT submit form
- [ ] **Reset type** - `type="reset"` resets parent form
- [ ] **Default behavior** - Defaults to "submit" if no type specified
- [ ] **Form attribute** - Can reference forms by ID (form="form-id")

### Form Association
- [ ] **Native association** - Works with FormData API
- [ ] **Name/value** - Submits name/value if specified
- [ ] **Form validation** - Triggers form validation on submit
- [ ] **Event bubbling** - Submit events bubble correctly

### Testing Scenarios
- [ ] Simple form submission test
- [ ] Multiple buttons in one form (different types)
- [ ] Form reset functionality
- [ ] Form validation trigger

---

## 3. Design Token Integration

### CSS Custom Properties
- [ ] **Primary color** - Uses `--m-color-primary`
- [ ] **Hover state** - Uses `--m-color-primary-hover`
- [ ] **Text color** - Uses `--m-color-text`
- [ ] **Font family** - Uses `--m-font-family`
- [ ] **Font size** - Uses `--m-font-size-base`
- [ ] **Spacing** - Uses `--m-spacing-sm` and `--m-spacing-md`
- [ ] **Border radius** - Uses `--m-border-radius`
- [ ] **Transitions** - Uses `--m-transition-duration`
- [ ] **Token override** - Can override tokens per instance

### Theming
- [ ] **Token fallbacks** - Provides sensible fallback values
- [ ] **Dynamic updates** - Updates when tokens change at runtime
- [ ] **Scoped theming** - Works with scoped token overrides

---

## 4. Component API & Developer Experience

### Properties/Attributes
- [ ] **type** - Supports button, submit, reset
- [ ] **disabled** - Boolean disabled state
- [ ] **label/aria-label** - Text label option
- [ ] **variant** - Style variants (primary, secondary, etc.) - optional
- [ ] **size** - Size variants (sm, md, lg) - optional
- [ ] **Reflect attributes** - Properties reflect to attributes appropriately

### Slots/Content
- [ ] **Default slot** - Text/icon content works
- [ ] **Named slots** - Icon slots if applicable (optional)
- [ ] **Slot fallback** - Handles empty content gracefully

### Events
- [ ] **click** - Standard click event fires
- [ ] **Event delegation** - Works with event listeners up the tree
- [ ] **Custom events** - Any custom events documented (optional)

### Usage Simplicity
- [ ] **Minimal boilerplate** - Easy to use out of the box
- [ ] **Intuitive API** - Matches developer expectations
- [ ] **Good defaults** - Sensible default behavior
- [ ] **Clear documentation** - JSDoc is comprehensive

---

## 5. Code Quality & Maintainability

### Code Structure
- [ ] **Follows M pattern** - Uses defaultTagName, register() pattern
- [ ] **Lit best practices** - Proper use of Lit decorators/APIs
- [ ] **Clear separation** - Logical organization of code
- [ ] **No unnecessary complexity** - Simple, readable code

### Documentation
- [ ] **JSDoc present** - Comprehensive JSDoc comments
- [ ] **@element tag** - Custom element tag documented
- [ ] **Properties documented** - All properties have JSDoc
- [ ] **Events documented** - Events described with @fires (if applicable)
- [ ] **Slots documented** - Slots described with @slot (if applicable)
- [ ] **Examples** - Usage examples provided

### Testing Considerations
- [ ] **Testable** - Easy to write unit tests for
- [ ] **Minimal dependencies** - Few external dependencies
- [ ] **Predictable** - Behavior is deterministic

---

## 6. Browser Standards Alignment

### Web Platform Adherence
- [ ] **Custom Elements v1** - Uses standard CE APIs
- [ ] **No polyfills needed** - Works in modern browsers without polyfills
- [ ] **Progressive enhancement** - Degrades gracefully if needed
- [ ] **Semantic HTML** - Uses or wraps semantic elements appropriately

### Shadow DOM Considerations
- [ ] **Style encapsulation** - Styles don't leak
- [ ] **Part exposure** - Uses ::part if customization needed (optional)
- [ ] **Focus delegation** - Focus works correctly with shadow DOM
- [ ] **Form internals** - Form association works (if applicable)

---

## 7. Performance

### Runtime Performance
- [ ] **First render** - Fast initial render
- [ ] **Updates** - Efficient re-renders on property changes
- [ ] **No layout thrashing** - No forced reflows

### Bundle Size
- [ ] **Minimal code** - No unnecessary code
- [ ] **Tree-shakeable** - Can be tree-shaken if needed

---

## Evaluation Scoring

For each approach, rate on a scale of 1-5:

| Criteria | Approach 1 | Approach 2 | Approach 3 |
|----------|-----------|-----------|-----------|
| Accessibility | ? | ? | ? |
| Form Integration | ? | ? | ? |
| Token Integration | ? | ? | ? |
| Developer Experience | ? | ? | ? |
| Code Maintainability | ? | ? | ? |
| Standards Alignment | ? | ? | ? |
| **Total** | ? | ? | ? |

### Rating Scale
- **5** - Excellent, exceeds expectations
- **4** - Good, meets all requirements
- **3** - Acceptable, minor issues
- **2** - Poor, significant issues
- **1** - Fails, does not meet requirements

---

## Final Recommendation

After completing the evaluation, answer:

1. Which approach best balances all criteria?
2. Are there any deal-breaker issues with any approach?
3. What modifications would improve the winning approach?
4. Should this pattern apply to other form components (input, select, etc.)?
