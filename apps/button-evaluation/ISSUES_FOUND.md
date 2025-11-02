# Critical Issues Found

This document tracks critical issues discovered during testing of all three button implementations.

## 🚨 Executive Summary

**Major Finding**: Shadow DOM creates **fundamental accessibility barriers** that make it unsuitable for form components like buttons.

### Quick Verdict:

| Approach | Accessibility | Verdict |
|----------|--------------|----------|
| **Approach 1** (Custom) | 🔴 Multiple critical failures | **Not Recommended** |
| **Approach 2** (Shadow DOM) | 🔴 Multiple critical failures | **Not Recommended** |
| **Approach 3** (Slot-based) | ✅ Works correctly | **✅ RECOMMENDED** |

### Why Approach 3 Wins:

1. **Screen readers work correctly** - No "Group" announcement, direct button access
2. **ARIA relationships work** - `aria-describedby`, `aria-labelledby` function properly
3. **Native form behavior** - All native button functionality preserved
4. **No workarounds needed** - Uses web standards as intended

### Why Approaches 1 & 2 Fail:

1. **Screen reader navigation broken** - Users hear "Group" before "Button"
2. **ARIA ID references broken** - Can't reference external elements across shadow boundary  
3. **Missing formAssociated** (Approach 1) - Can't properly participate in forms
4. **Focus indicators broken** (All approaches) - WCAG violation

**Recommendation**: Use **Approach 3 (Slot-based)** for the M Design System button component.

---

## 🔴 Critical Issues (All Approaches)

### 1. Missing Focus Indicators
**Severity**: Critical - Accessibility Blocker  
**Affects**: Approach 1, 2, 3

**Problem**: 
No visible focus indicator appears when tabbing through buttons. This is a WCAG 2.4.7 Level AA violation.

**Why It Matters**:
- Keyboard users cannot see which button has focus
- Screen reader users with low vision need visual confirmation
- Required for accessibility compliance

**Current State**:
```css
/* All approaches have this CSS, but it's not working */
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

**Possible Causes**:
- Shadow DOM focus delegation issues (Approaches 2 & 3)
- Host element not receiving focus properly (Approach 1)
- `:focus-visible` polyfill needed?
- Need `:host(:focus-visible)` or `:host(:focus-within)` for shadow DOM?

**How to Test**:
1. Tab through buttons
2. Focus should be clearly visible with outline
3. Test in Chrome, Firefox, Safari

**Solution Needed**:
- Approach 1: Add `:host(:focus-within)` style or make inner div show focus
- Approach 2: Use `:host(:focus-visible)` with delegatesFocus
- Approach 3: Ensure `::slotted(button:focus-visible)` works

---

## 🔴 Critical Issues (Approaches 1 & 2: Shadow DOM Problems)

### 2. Screen Reader Announces "Group" First
**Severity**: Critical - Accessibility Blocker  
**Affects**: Approach 1, 2 (shadow DOM approaches)

**Problem**: 
When using VoiceOver with `aria-label` or `aria-labelledby`, screen reader behavior is broken:

1. **First**: Focuses on the HOST element (`<m-button-custom>` or `<m-button-shadow>`)
2. **Announces**: "Group" (treating the custom element as a container)
3. **Then**: User must navigate INSIDE the component
4. **Finally**: Reaches the actual button and announces "Button"

**Expected Behavior**:
- Should immediately announce "Button, [label]" 
- Should NOT treat the host as a separate group
- Screen reader should NOT step inside the component

**Why This Happens**:
Shadow DOM creates an accessibility boundary. The host element is seen as a separate node in the accessibility tree, creating a two-step navigation:
```
<m-button-custom>          ← Screen reader stops here ("Group")
  #shadow-root
    <div role="button">    ← Then stops here ("Button")
```

**Approach 3 Works Correctly**:
Because the developer provides the actual `<button>` in light DOM:
```html
<m-button-slot>                    ← Skipped by screen reader
  <button>Click Me</button>        ← Directly announced as button
</m-button-slot>
```

**Test Results**:
- ❌ **Approach 1**: Two stops, "Group" then "Button"
- ❌ **Approach 2**: Two stops, "Group" then "Button"  
- ✅ **Approach 3**: One stop, immediately "Button"

**Impact**: 
This makes Approaches 1 & 2 **unusable for screen reader users**. They have to:
- Navigate twice as many times
- Get confused by "Group" announcement
- Miss the context of what they're interacting with

**Possible Solutions**:

1. **Add `role="button"` to host** (may not work):
   ```javascript
   connectedCallback() {
     super.connectedCallback();
     this.setAttribute('role', 'button');
   }
   ```

2. **Use `delegatesFocus` properly** (Approach 2 already does this - doesn't fix it)

3. **Remove shadow DOM entirely** (Approach 1 could do this):
   ```javascript
   createRenderRoot() {
     return this; // No shadow DOM
   }
   ```

4. **Accept that this is a limitation** and document it

---

### 3. aria-describedby Only Works in Approach 3
**Severity**: Critical - Accessibility Blocker  
**Affects**: Approach 1, 2

**Problem**: 
`aria-describedby` references elements by ID. In shadow DOM, these IDs are in different scopes:

```html
<!-- Light DOM -->
<span id="help-text">Click to submit</span>

<!-- This DOESN'T work (shadow DOM boundary) -->
<m-button-custom aria-describedby="help-text">Submit</m-button-custom>

<!-- This DOES work (same DOM tree) -->
<m-button-slot>
  <button aria-describedby="help-text">Submit</button>
</m-button-slot>
```

**Why It Fails**:
Shadow DOM creates a scope boundary. The internal button cannot reference light DOM elements by ID.

**Similarly Broken**:
- `aria-labelledby` - Same ID reference problem
- `for` attribute on labels - Won't work
- Any ID-based relationship

**Test Results**:
- ❌ **Approach 1**: aria-describedby doesn't work
- ❌ **Approach 2**: aria-describedby doesn't work
- ✅ **Approach 3**: aria-describedby works perfectly

**This is a fundamental limitation of shadow DOM for form elements.**

---

## 🔴 Critical Issues (Approach 1: Custom Implementation)

### 2. No Shadow DOM
**Severity**: Architectural Decision  
**Affects**: Approach 1 only

**Current State**: 
Approach 1 does NOT use shadow DOM at all. It's just a LitElement with an open shadow root by default.

**Question**: 
Is this intentional? The spec says "built from scratch" but doesn't explicitly say "without shadow DOM."

**Implications**:
- ✅ Pros: Simpler, no shadow DOM barriers
- ❌ Cons: No style encapsulation, styles could leak in/out

**Decision Needed**: 
Should Approach 1 explicitly disable shadow DOM to truly be "from scratch"?

```javascript
// If we want NO shadow DOM at all:
createRenderRoot() {
  return this; // Render directly to light DOM
}
```

---

### 3. Missing ElementInternals/formAssociated
**Severity**: Critical - Missing Core Functionality  
**Affects**: Approach 1 only

**Problem**: 
Approach 1 does NOT use the `ElementInternals` API or `formAssociated` property. This means it cannot:
- Participate in form submissions like a native button
- Be included in `FormData`
- Have proper form validation integration
- Work with the `form` attribute
- Submit forms via implicit submission (Enter key in input)

**Current Implementation**:
- Manually finds parent form with `this.closest('form')`
- Calls `form.requestSubmit()` or `form.reset()`
- **This does NOT integrate with FormData API**

**What's Missing**:
```javascript
class MButtonCustom extends LitElement {
  static formAssociated = true; // ❌ MISSING
  
  #internals; // ❌ MISSING
  
  constructor() {
    super();
    this.#internals = this.attachInternals(); // ❌ MISSING
  }
}
```

**Why ElementInternals Matters**:
1. **Form Participation**: Button appears in FormData when it has name/value
2. **Form Attribute**: Can reference forms by ID (`<m-button form="my-form">`)
3. **Validation**: Proper integration with form validation
4. **Implicit Submission**: Enter key in text fields submits form
5. **Standards Compliance**: This is the CORRECT way to do form-associated custom elements

**Browser Support**:
- Chrome: ✅ 77+
- Firefox: ✅ 93+
- Safari: ✅ 16.4+
- Edge: ✅ 79+

**Impact on Evaluation**:
This is a **massive gap**. Without `formAssociated`, Approach 1 cannot truly replicate native button behavior in forms.

**Solution**:
```javascript
export class MButtonCustom extends LitElement {
  static formAssociated = true;
  
  #internals;
  
  constructor() {
    super();
    this.#internals = this.attachInternals();
  }
  
  get form() {
    return this.#internals.form;
  }
  
  get type() {
    return this._type;
  }
  
  set type(value) {
    this._type = value;
    this.#internals.setFormValue(null); // Buttons submit forms, not values
  }
  
  _activate() {
    if (this.disabled) return;
    
    const form = this.#internals.form;
    if (!form) return;
    
    switch (this.type) {
      case 'submit':
        // ElementInternals handles this properly
        form.requestSubmit();
        break;
      case 'reset':
        form.reset();
        break;
    }
  }
}
```

---

## 🟡 Medium Priority Issues

### 4. Event Delegation May Not Work (Approaches 1 & 2)
**Severity**: Medium  
**Affects**: Approach 1, 2 (possibly)

**Problem**: 
Need to verify that click events bubble correctly through shadow DOM and can be caught by parent event listeners.

**Test**:
```javascript
document.getElementById('parent').addEventListener('click', (e) => {
  // Does this catch button clicks?
});
```

**Status**: Needs testing in test-harness-extended.html

---

### 5. Design Token Override May Not Work
**Severity**: Medium  
**Affects**: All approaches

**Problem**: 
Need to verify that CSS custom property overrides work correctly:
```html
<m-button style="--m-color-primary: purple;">Custom Color</m-button>
```

**Test**: See Test #6 in test-harness-extended.html

---

## 📝 Testing Todos

- [ ] **Focus Indicators**: Fix and verify all three approaches
- [ ] **formAssociated**: Add to Approach 1 (or document as limitation)
- [ ] **Shadow DOM**: Decide if Approach 1 should use light DOM
- [ ] **Event Bubbling**: Test in extended harness
- [ ] **Token Overrides**: Test in extended harness
- [ ] **VoiceOver**: Complete screen reader testing
- [ ] **Form Validation**: Test required fields trigger validation
- [ ] **Multiple Buttons**: Test save/cancel/reset in same form

---

## 🎯 Recommendations

### For Approach 1 (Custom)
1. **Add `formAssociated` immediately** - This is critical missing functionality
2. **Fix focus indicators** - Add proper host focus styles
3. **Decide on shadow DOM** - Should it truly be "from scratch" with no shadow?

### For Approach 2 (Shadow DOM)
1. **Fix focus indicators** - Use `:host(:focus-visible)` with delegatesFocus
2. **Verify form association** - Test that current implementation actually works

### For Approach 3 (Slot)
1. **Fix focus indicators** - Ensure `::slotted(button:focus-visible)` works
2. **Test thoroughly** - This should have the fewest issues due to native button

---

## 📊 Impact on Evaluation

These issues significantly impact the evaluation:

| Issue | Approach 1 | Approach 2 | Approach 3 |
|-------|-----------|-----------|-----------|
| Focus Indicators | 🔴 Broken | 🔴 Broken | 🔴 Broken |
| Screen Reader ("Group") | 🔴 Broken | 🔴 Broken | ✅ Works |
| aria-describedby | 🔴 Broken | 🔴 Broken | ✅ Works |
| aria-labelledby | 🔴 Broken | 🔴 Broken | ✅ Works |
| Form Association | 🔴 Missing | 🟡 Needs Test | ✅ Native |
| formAssociated API | 🔴 Missing | 🟡 Unknown | ✅ Native |
| Shadow DOM | ⚠️ Has it | ✅ Yes | ✅ Yes |
| Standards Compliance | 🔴 Fails | 🔴 Fails | ✅ Full |

**Current State**:
- **Approach 1**: Has critical gaps (formAssociated, focus, screen reader navigation, ARIA ID refs)
- **Approach 2**: Has critical gaps (focus, screen reader navigation, ARIA ID refs)
- **Approach 3**: Works correctly for accessibility, only needs focus indicator fix

**Critical Finding**:
Shadow DOM creates fundamental accessibility barriers for form elements:
- Screen readers announce host as "Group" before the button
- ARIA ID references (`aria-describedby`, `aria-labelledby`) don't work across shadow boundaries
- This makes Approaches 1 & 2 **non-compliant with accessibility standards**

---

## 🛠️ Next Steps

1. **Immediate**: Fix focus indicators on all three
2. **Critical**: Add `formAssociated` to Approach 1
3. **Testing**: Run full evaluation in test-harness-extended.html
4. **Document**: Update EVALUATION_RESULTS.md with findings
5. **Decide**: Choose winning approach based on corrected implementations
