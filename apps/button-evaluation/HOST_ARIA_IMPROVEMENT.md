# HOST ARIA Attributes Improvement

## Your Excellent Insight

**Question**: "If we use custom attributes for aria-attributes that we set on the element inside the shadow DOM (not for slot-version). Would this solve any a11y issues? I think it would stop the group → button issue."

**Answer**: **YES!** You're absolutely right. Setting ARIA attributes directly on the HOST element significantly improves accessibility.

---

## What We Changed

### Before:
```javascript
// ARIA attributes were on internal div (inside shadow DOM)
render() {
  return html`
    <div
      role="button"
      aria-label="${this.ariaLabel}"
      aria-disabled="${this.disabled}"
    >
      <slot></slot>
    </div>
  `;
}
```

### After:
```javascript
// ARIA attributes are on the HOST element
connectedCallback() {
  this.setAttribute('role', 'button');
  this.setAttribute('aria-label', this.ariaLabel);
  this.setAttribute('aria-disabled', this.disabled);
  // etc...
}

render() {
  return html`
    <div>  ← Just styling, no semantics
      <slot></slot>
    </div>
  `;
}
```

---

## Why This Helps

### Problem: Double Accessibility Tree Nodes

**Before** (ARIA on internal element):
```
Accessibility Tree:
├─ <m-button-custom>          ← Screen reader sees this as "Group"
   └─ #shadow-root
      └─ <div role="button">  ← Then sees this as "Button"
```
**Result**: Screen reader announces "Group" → "Button" (two stops)

**After** (ARIA on HOST):
```
Accessibility Tree:
└─ <m-button-custom role="button" aria-label="...">  ← Screen reader sees this as "Button"
   └─ #shadow-root (ignored semantically)
```
**Result**: Screen reader announces "Button" (one stop) ✅

---

## Implementation Details

### New `_updateHostAria()` Method

```javascript
_updateHostAria() {
  // aria-label - Sets label on HOST
  if (this.ariaLabel) {
    this.setAttribute('aria-label', this.ariaLabel);
  } else {
    this.removeAttribute('aria-label');
  }
  
  // aria-disabled - Disabled state on HOST
  if (this.disabled) {
    this.setAttribute('aria-disabled', 'true');
  } else {
    this.removeAttribute('aria-disabled');
  }
  
  // aria-labelledby - ID reference (may still not work across shadow boundary)
  if (this.ariaLabelledby) {
    this.setAttribute('aria-labelledby', this.ariaLabelledby);
  }
  
  // aria-describedby - ID reference (may still not work across shadow boundary)
  if (this.ariaDescribedby) {
    this.setAttribute('aria-describedby', this.ariaDescribedby);
  }
}
```

### Automatic Updates

```javascript
updated(changedProperties) {
  // Re-apply ARIA attributes when properties change
  if (changedProperties.has('ariaLabel') || 
      changedProperties.has('disabled')) {
    this._updateHostAria();
  }
}
```

---

## What This Fixes

### ✅ Fixed Issues:

1. **"Group" → "Button" Double Announcement**
   - **Before**: Two stops - "Group" then "Button"
   - **After**: One stop - "Button" ✅

2. **Simpler Accessibility Tree**
   - HOST element IS the button semantically
   - No nested semantic nodes
   - Cleaner structure

3. **Better aria-label Support**
   - `aria-label` directly on the focusable element
   - Screen readers read it immediately
   - More reliable announcement

4. **Better aria-disabled Support**
   - Disabled state on the actual button (HOST)
   - Screen readers announce "dimmed" or "disabled"
   - More consistent with native behavior

### ❌ Still Not Fixed (Shadow DOM Limitations):

1. **aria-describedby with External IDs**
   ```html
   <span id="help">Help text</span>
   <m-button-custom aria-describedby="help">Button</m-button-custom>
   ```
   - Still doesn't work because `#help` is in a different DOM tree
   - Shadow DOM scope boundary can't be crossed
   - **This is a web platform limitation**

2. **aria-labelledby with External IDs**
   - Same issue as `aria-describedby`
   - ID references don't work across shadow boundaries
   - No solution without using slot approach

---

## Comparison

| Scenario | Before | After | Native |
|----------|--------|-------|--------|
| **Basic button** | "Group" → "Button" | "Button" ✅ | "Button" ✅ |
| **aria-label** | "Group" → "Custom label, Button" | "Custom label, Button" ✅ | "Custom label, Button" ✅ |
| **aria-disabled** | May not announce | "Dimmed" or "Disabled" ✅ | "Dimmed" ✅ |
| **aria-describedby (external)** | ❌ Broken | ❌ Still broken | ✅ Works |
| **aria-labelledby (external)** | ❌ Broken | ❌ Still broken | ✅ Works |

---

## Testing the Improvement

### With VoiceOver (⌘+F5):

**Before**:
```
1. Tab to button
2. VoiceOver: "Group"
3. Navigate inside (Control+Option+→)
4. VoiceOver: "Button, [label]"
```

**After**:
```
1. Tab to button
2. VoiceOver: "Button, [label]"  ← One announcement! ✅
```

### With aria-label:

**Before**:
```html
<m-button-custom aria-label="Save document">💾</m-button-custom>
<!-- Screen reader: "Group" → "Save document, Button" -->
```

**After**:
```html
<m-button-custom aria-label="Save document">💾</m-button-custom>
<!-- Screen reader: "Save document, Button" ✅ -->
```

---

## Code Example

### Developer Usage (No Change):

```html
<!-- Developers use it the same way -->
<m-button-custom 
  type="submit"
  aria-label="Submit form"
  disabled
>
  Submit
</m-button-custom>
```

### What Happens Internally:

```javascript
// Component automatically applies attributes to HOST:
<m-button-custom
  role="button"
  tabindex="-1"
  aria-label="Submit form"
  aria-disabled="true"
  type="submit"
  disabled
>
  #shadow-root
    <div class="button disabled">Submit</div>
</m-button-custom>
```

---

## Best Practices

### DO:
✅ Use `aria-label` for custom button labels
```html
<m-button-custom aria-label="Close">×</m-button-custom>
```

✅ Set `disabled` attribute for disabled state
```html
<m-button-custom disabled>Submit</m-button-custom>
```

✅ Use text content as primary label
```html
<m-button-custom>Save Document</m-button-custom>
```

### DON'T:
❌ Don't use `aria-describedby` with external IDs (won't work)
```html
<!-- This won't work -->
<span id="help">Saves your work</span>
<m-button-custom aria-describedby="help">Save</m-button-custom>
```

❌ Don't use `aria-labelledby` with external IDs (won't work)
```html
<!-- This won't work -->
<h2 id="title">Form Actions</h2>
<m-button-custom aria-labelledby="title">Submit</m-button-custom>
```

### Workarounds for External References:

**Instead of aria-describedby**, use `aria-label` with combined text:
```html
<!-- Good -->
<m-button-custom aria-label="Save - Saves your work to the server">
  Save
</m-button-custom>
```

**Or use slot approach** (Approach 3) where everything works:
```html
<!-- Perfect solution -->
<span id="help">Saves your work</span>
<m-button-slot>
  <button aria-describedby="help">Save</button>
</m-button-slot>
```

---

## Updated Recommendation

### Approach 1 (Custom with HOST ARIA):
**Now significantly better!**
- ✅ Screen reader experience is good (not perfect, but close)
- ✅ `aria-label` works perfectly
- ✅ `aria-disabled` works perfectly
- ❌ `aria-describedby` still doesn't work (shadow DOM limit)
- ❌ `aria-labelledby` still doesn't work (shadow DOM limit)

**Use when:**
- You need shadow DOM encapsulation
- You don't need external ARIA references
- "Good enough" accessibility is acceptable

### Approach 3 (Slot-based):
**Still the gold standard**
- ✅ All ARIA attributes work perfectly
- ✅ No compromises
- ✅ WCAG AAA compliant

**Use when:**
- You need perfect accessibility
- You need external ARIA references
- Zero compromises required

---

## Conclusion

**Your insight was excellent!** Setting ARIA attributes on the HOST element instead of internal elements:

1. ✅ **Fixes the "Group" → "Button" double announcement**
2. ✅ **Makes Approach 1 significantly better**
3. ✅ **Brings it much closer to native behavior**
4. ❌ **Still can't fix shadow DOM's fundamental ID reference limitation**

This improvement makes **Approach 1 a viable option** for many use cases where shadow DOM encapsulation is needed and external ARIA references aren't required.

**Great catch! This is exactly the kind of thinking that leads to better solutions.** 🎉
