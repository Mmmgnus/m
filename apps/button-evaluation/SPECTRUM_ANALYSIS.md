# Spectrum Button Analysis

## Key Finding

**Adobe Spectrum's `<sp-button>` works better than Material Design's `<md-filled-button>` in our tests.**

Based on runtime observation and source code inspection, here's what Spectrum does differently:

---

## What Spectrum Does Differently

### 1. Host Element as the Button (`role="button"`)

**Key Difference**: Spectrum applies `role="button"` directly to the **host element** (`<sp-button>`), not to an internal element.

From ButtonBase.js (decompiled):
```javascript
manageAnchor() {
  if (this.href && this.href.length > 0) {
    this.setAttribute('role', 'link');
  } else {
    this.setAttribute('role', 'button');  // ← Sets role on HOST
  }
}

firstUpdated() {
  this.setAttribute('tabindex', '0');  // ← Makes HOST focusable
  this.manageAnchor();
}
```

**Impact**: 
- Screen readers see the HOST as the button, not a container
- Reduces (but doesn't eliminate) the "Group" announcement problem
- Makes the component itself semantically a button

---

### 2. Focusable Host with Tabindex

Spectrum makes the **host element** focusable:

```javascript
firstUpdated() {
  if (!this.hasAttribute('tabindex')) {
    this.setAttribute('tabindex', '0');  // ← HOST is focusable
  }
}
```

**Our Approach (Approach 1 & 2)**:
- We make an INTERNAL element focusable
- The host is not in the tab order
- Creates extra accessibility tree node

**Spectrum's Approach**:
- The host IS the focusable element
- Simpler accessibility tree
- Closer to native behavior

---

### 3. Form Integration with createElement Trick

For form submission without a real button, Spectrum does something clever:

```javascript
shouldProxyClick(event) {
  if (this.type !== 'button') {
    // Create temporary button to submit form!
    const btn = document.createElement('button');
    btn.type = this.type;
    this.insertAdjacentElement('afterend', btn);
    btn.click();  // ← Triggers form submit
    btn.remove(); // ← Cleans up
    return true;
  }
}
```

**Why This Works**:
- Creates a real native button temporarily
- Button triggers actual form submission
- Immediately removes it
- No need for `formAssociated` API

**Pros**:
- Works with form validation
- Handles implicit submission
- Compatible with FormData

**Cons**:
- Hacky workaround
- Creates/destroys DOM elements
- Doesn't solve the ARIA issues

---

### 4. Manual Keyboard Handling

Spectrum manually handles ALL keyboard events:

```javascript
handleKeydown(e) {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      this.active = true;  // Visual feedback
      break;
  }
}

handleKeyup(e) {
  switch (e.code) {
    case 'Space':
      this.active = false;
      this.click();  // ← Activates button
      break;
  }
}

handleKeypress(e) {
  switch (e.code) {
    case 'Enter':
    case 'NumpadEnter':
      this.click();
      break;
  }
}
```

**Similar to our Approach 1**, but combined with `role="button"` on host.

---

## What Material Design Does Wrong

Based on observation, Material uses a different pattern:

1. **No `role="button"` on host** - Leaves host as generic container
2. **Internal button element** - Actual button is deep in shadow DOM
3. **More shadow DOM nesting** - More accessibility barriers
4. **Less ARIA management** - Doesn't set roles/tabindex on host

Result: **Worse screen reader experience**

---

## Comparison Table

| Feature | Our Approach 1 | Our Approach 2 | Spectrum | Material | Native |
|---------|---------------|---------------|----------|----------|--------|
| **role="button" on host** | ❌ On div | ❌ Internal | ✅ On host | ❌ No | ✅ Native |
| **tabindex on host** | ❌ On div | ❌ Internal | ✅ On host | ❌ No | ✅ Native |
| **Form submit trick** | ❌ No | ✅ Manual | ✅ createElement | ❌ No | ✅ Native |
| **Screen reader** | ❌ Group→Button | ❌ Group→Button | 🟡 Better | ❌ Worse | ✅ Perfect |
| **aria-describedby** | ❌ Broken | ❌ Broken | ❌ Broken | ❌ Broken | ✅ Works |
| **Focus indicator** | ✅ Fixed | ✅ Fixed | ✅ Works | ❌ Poor | ✅ Works |

---

## Key Lessons from Spectrum

### ✅ What We Can Adopt:

1. **Apply `role="button"` to the HOST element**
   ```javascript
   connectedCallback() {
     super.connectedCallback();
     this.setAttribute('role', 'button');
     this.setAttribute('tabindex', this.disabled ? '-1' : '0');
   }
   ```

2. **Make the HOST focusable**, not internal elements
   - Simpler accessibility tree
   - Better screen reader experience

3. **Use createElement trick for form submission**
   ```javascript
   _handleFormSubmit() {
     if (this.type === 'submit' || this.type === 'reset') {
       const btn = document.createElement('button');
       btn.type = this.type;
       this.insertAdjacentElement('afterend', btn);
       btn.click();
       btn.remove();
     }
   }
   ```

### ❌ What Still Doesn't Work:

1. **ARIA ID references still broken**
   - `aria-describedby` doesn't work in Spectrum either
   - Shadow DOM limitation can't be solved

2. **Screen reader still not perfect**
   - Better than Material, but not as good as native
   - May still announce host before content

3. **Not truly native behavior**
   - Still using workarounds
   - More complex than slot approach

---

## Should We Adopt Spectrum's Pattern?

### For Approach 1 (Custom):

**YES** - Apply these changes:
1. Add `role="button"` to host
2. Add `tabindex` to host  
3. Use createElement trick for forms
4. Keep manual keyboard handling

**Benefits**:
- Better screen reader experience
- Simpler accessibility tree
- Better form integration

**Still Won't Match Slot Approach**:
- ARIA references still broken
- More code complexity
- Not truly native

---

### For Approach 2 (Shadow DOM):

**MAYBE** - Could improve it:
1. Add `role="button"` to host
2. Keep delegatesFocus
3. Use createElement trick

**But**:
- Already has native button inside
- Would be duplicating semantics
- Probably not worth it

---

### For Approach 3 (Slot):

**NO** - Already perfect as-is:
- Native button in light DOM
- All ARIA works
- All form behavior native
- No workarounds needed

---

## Recommendation

1. **Update Approach 1** with Spectrum's techniques:
   - `role="button"` on host
   - `tabindex` on host
   - createElement form trick
   
2. **Keep Approach 3 as the recommended solution**
   - Still the only fully accessible option
   - No workarounds needed
   - Perfect native behavior

3. **Note in documentation**: 
   - Even with Spectrum's improvements, shadow DOM still has ARIA limitations
   - Major design systems (Google, Adobe) face the same issues
   - Slot-based is the only way to truly solve it

---

## Updated Findings

**Even Adobe (Spectrum) with all their resources and expertise:**
- Can't fully solve shadow DOM accessibility issues
- Still uses workarounds (createElement trick)
- Still has broken ARIA references
- Still not perfect with screen readers

**This validates our conclusion**: For form components requiring full accessibility, **slot-based approach (Approach 3) is the only viable solution**.
