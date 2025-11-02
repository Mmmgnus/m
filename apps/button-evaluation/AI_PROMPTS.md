# AI Implementation Prompts

Copy and paste these prompts to give to the three AIs building the button implementations.

---

## 🔨 Prompt for AI #1: Custom Implementation

```
You are building a button web component for the M Design System evaluation project.

**Your Task**: Create a fully custom button implementation built from scratch using Lit.

**File to Create**: 
`/Users/magnus/Code/Private/m/apps/button-evaluation/approach-1-custom/m-button-custom.js`

**Read These Files First**:
1. `/Users/magnus/Code/Private/m/apps/button-evaluation/approach-1-custom/SPEC.md` - Your detailed specification
2. `/Users/magnus/Code/Private/m/apps/button-evaluation/AI_IMPLEMENTER_GUIDE.md` - Quick reference

**Key Requirements**:
- Element name: `<m-button-custom>`
- Build entirely from scratch (NO native `<button>` element)
- Manually implement: keyboard handling (Space/Enter), focus management, ARIA attributes, form integration
- Use Lit's LitElement, html, and css
- Support properties: type, disabled, ariaLabel, ariaLabelledby, ariaDescribedby
- Use design tokens (CSS custom properties) from the spec
- Follow M Design System patterns (defaultTagName, register() function)
- Include comprehensive JSDoc documentation

**Critical Behaviors**:
- Tab navigation works
- Space key activates button (prevent default to avoid scroll)
- Enter key activates button
- Role="button" in ARIA
- Disabled buttons not focusable (tabindex="-1")
- Form submission when type="submit"
- Form reset when type="reset"

**Important Notes**:
- Form integration will be challenging without a native button - do your best
- Use `this.closest('form')` to find parent form
- Document any limitations in JSDoc

Create a complete, working implementation. Make sure it's production-ready with proper error handling and edge case coverage.
```

---

## 🎭 Prompt for AI #2: Shadow DOM Implementation

```
You are building a button web component for the M Design System evaluation project.

**Your Task**: Create a button that wraps a native `<button>` element inside shadow DOM using Lit.

**File to Create**: 
`/Users/magnus/Code/Private/m/apps/button-evaluation/approach-2-shadow/m-button-shadow.js`

**Read These Files First**:
1. `/Users/magnus/Code/Private/m/apps/button-evaluation/approach-2-shadow/SPEC.md` - Your detailed specification
2. `/Users/magnus/Code/Private/m/apps/button-evaluation/AI_IMPLEMENTER_GUIDE.md` - Quick reference

**Key Requirements**:
- Element name: `<m-button-shadow>`
- Render a native `<button>` element inside shadow DOM
- Use `delegatesFocus: true` in shadowRootOptions
- Support properties: type, disabled, ariaLabel, ariaLabelledby, ariaDescribedby, form
- Synchronize component properties to internal button attributes
- Use design tokens (CSS custom properties) from the spec
- Follow M Design System patterns (defaultTagName, register() function)
- Include comprehensive JSDoc documentation

**Critical Behaviors**:
- Focus delegation forwards focus to internal button
- All ARIA attributes applied to internal button
- Form association handled (use form attribute or manual submission via this.closest('form'))
- All button types work (button, submit, reset)
- Disabled state prevents interaction
- Events bubble correctly from shadow DOM

**Important Notes**:
- Shadow DOM can break form association - handle with `form` attribute or manual form.requestSubmit()
- Use `closest('form')` as fallback for form submission
- Test that events bubble properly

Create a complete, working implementation. Ensure the native button inside gets all the benefits while the component handles styling and design tokens.
```

---

## 🎰 Prompt for AI #3: Slot-Based Implementation

```
You are building a button web component for the M Design System evaluation project.

**Your Task**: Create a styled wrapper component where developers provide their own native `<button>` element via a slot.

**File to Create**: 
`/Users/magnus/Code/Private/m/apps/button-evaluation/approach-3-slot/m-button-slot.js`

**Read These Files First**:
1. `/Users/magnus/Code/Private/m/apps/button-evaluation/approach-3-slot/SPEC.md` - Your detailed specification
2. `/Users/magnus/Code/Private/m/apps/button-evaluation/AI_IMPLEMENTER_GUIDE.md` - Quick reference

**Key Requirements**:
- Element name: `<m-button-slot>`
- Provide a default slot for developer's `<button>` element
- Style the slotted button using `::slotted(button)` selector
- Optional properties: variant (primary/secondary), size (sm/md/lg)
- Use design tokens (CSS custom properties) from the spec
- Follow M Design System patterns (defaultTagName, register() function)
- Include comprehensive JSDoc documentation

**Critical Behaviors**:
- Component does NOT create the button - developers provide it
- Styles applied via `::slotted()` selector
- Optional: validate slotted content with slotchange event
- Optional: provide console warnings if non-button content is slotted
- All native button behavior preserved automatically (no JS needed)
- Support variant/size attributes for styling variations

**Important Notes**:
- Keep it SIMPLE - minimal JavaScript, mostly CSS
- `::slotted()` can only style direct slotted elements
- Provide CSS custom property hooks for further customization
- The button element itself is provided by the developer

**Example Usage**:
```html
<m-button-slot>
  <button type="submit">Submit</button>
</m-button-slot>

<m-button-slot variant="secondary">
  <button type="button" disabled>Cancel</button>
</m-button-slot>
```

Create a complete, working implementation. This should be the simplest of the three approaches with maximum native behavior preservation.
```

---

## 📝 General Instructions for All AIs

Include this context with each prompt:

```
**Project Context**:
- You're part of an evaluation to determine the best button pattern for the M Design System
- The system uses Lit, no build step, native ES modules, and design tokens
- Two other AIs are building alternative approaches
- Your implementation will be tested side-by-side in an interactive test harness

**Import Path**:
```javascript
import { LitElement, html, css } from 'lit';
import { nothing } from 'lit';
```

**Design Tokens** (use these in your styles):
```css
--m-color-primary: #0066cc
--m-color-primary-hover: #0052a3
--m-color-secondary: #6c757d
--m-color-text: white
--m-font-family: system-ui, -apple-system, sans-serif
--m-font-size-base: 1rem
--m-spacing-sm: 0.5rem
--m-spacing-md: 1rem
--m-border-radius: 0.25rem
--m-transition-duration: 0.2s
```

**Testing**:
After implementation, your button will be tested in `test-harness.html` for:
- Keyboard navigation (Tab, Space, Enter)
- Form integration (submit, reset, validation)
- ARIA attributes and screen reader compatibility
- Design token application
- Code quality and maintainability

**Success Criteria**:
- All accessibility tests pass
- Form integration works correctly
- Design tokens applied and customizable
- Clean, well-documented code
- No console errors

Read your SPEC.md file carefully - it contains detailed implementation guidance and examples.

Good luck! 🚀
```

---

## 🎯 How to Use These Prompts

1. **Copy the prompt** for the approach you want implemented
2. **Include the General Instructions** at the end
3. **Paste to your AI** of choice (Claude, GPT-4, etc.)
4. **Provide file access** so the AI can read SPEC.md and AI_IMPLEMENTER_GUIDE.md
5. **Review the implementation** when complete
6. **Repeat** for the other two approaches

---

## ✅ Expected Deliverables

Each AI should produce:
- A single `.js` file with the complete implementation
- Uses Lit (LitElement, html, css)
- Exports the component class and register() function
- Comprehensive JSDoc comments
- Production-ready code

---

## 🐛 If an AI Asks Clarifying Questions

Refer them to:
1. Their specific `approach-X/SPEC.md` file
2. The `AI_IMPLEMENTER_GUIDE.md` for quick reference
3. The `EVALUATION_CRITERIA.md` for what will be tested
4. The `test-harness.html` to see how it will be used

---

## 💡 Tips for Best Results

- Ask the AI to read the SPEC.md file first
- Encourage them to ask questions before implementing
- Request that they explain trade-offs they make
- Have them note any limitations in JSDoc comments
- Ask for a brief summary of their approach when done
