# Design System Button Research

## Goal
Evaluate how major design systems (Material Design, Adobe Spectrum) implement accessible buttons with web components and learn from their approaches.

---

## Design Systems to Evaluate

### 1. Material Web Components (Google)
**Package**: `@material/web`  
**Repo**: https://github.com/material-components/material-web  
**Docs**: https://material-web.dev/  
**Element**: `<md-filled-button>`, `<md-outlined-button>`, etc.

**Status**: Material 3 (latest), production-ready  
**Technology**: Lit-based web components

### 2. Adobe Spectrum Web Components
**Package**: `@spectrum-web-components/button`  
**Repo**: https://github.com/adobe/spectrum-web-components  
**Docs**: https://opensource.adobe.com/spectrum-web-components/  
**Element**: `<sp-button>`

**Status**: Production-ready  
**Technology**: Lit-based web components

---

## Research Questions

### 1. Shadow DOM Strategy
- Do they use shadow DOM?
- If yes, how do they handle accessibility barriers?
- Do they have workarounds for ARIA ID references?

### 2. Screen Reader Support
- Test with VoiceOver: Do they announce "Group" before "Button"?
- How do they handle the accessibility tree?
- Any special techniques to avoid shadow DOM issues?

### 3. ARIA Attributes
- Does `aria-describedby` work?
- Does `aria-labelledby` work?
- How do they handle cross-boundary ARIA references?

### 4. Form Integration
- Do they use `formAssociated`?
- How do they handle form submission?
- Does the `form` attribute work?

### 5. Focus Management
- Are focus indicators visible?
- How do they style focus?
- Any special focus delegation techniques?

### 6. Implementation Patterns
- What's their overall architecture?
- Any clever solutions we can learn from?
- What compromises did they make?

---

## Testing Plan

### Phase 1: Installation & Setup
1. Create test page with Material button
2. Create test page with Adobe Spectrum button
3. Add our test harness tests to compare

### Phase 2: Accessibility Testing
1. **VoiceOver Testing**
   - Navigate with Control+Option+Arrow
   - Document what's announced
   - Compare to native button

2. **ARIA Testing**
   - Test `aria-label`, `aria-labelledby`, `aria-describedby`
   - Check accessibility tree in DevTools
   - Verify relationships work

3. **Keyboard Testing**
   - Tab navigation
   - Space/Enter activation
   - Focus indicators

4. **Form Testing**
   - Submit, reset, button types
   - Form validation
   - Multiple buttons in form

### Phase 3: Code Analysis
1. Read their source code
2. Document their approach
3. Identify techniques we can use
4. Note any compromises they made

---

## Installation

### Material Web
```bash
npm install @material/web
```

### Adobe Spectrum
```bash
npm install @spectrum-web-components/button @spectrum-web-components/theme
```

---

## Expected Findings

### Hypothesis:
Major design systems likely face the same shadow DOM accessibility issues we discovered. They may have:

1. **Accepted the limitations** and documented them
2. **Avoided shadow DOM** for form components (unlikely given style encapsulation needs)
3. **Found workarounds** we haven't discovered
4. **Compromised on full accessibility** for other benefits

---

## Deliverables

1. **Research findings document** - What we learned
2. **Comparison test page** - Side-by-side with our buttons
3. **Recommendations** - What patterns to adopt or avoid
4. **Updated approach** - How to improve our implementation

---

## Timeline

- [ ] Install packages
- [ ] Create test pages
- [ ] Run accessibility tests
- [ ] Analyze source code
- [ ] Document findings
- [ ] Update recommendations
