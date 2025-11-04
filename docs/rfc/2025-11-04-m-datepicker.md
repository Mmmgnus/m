# RFC: m-datepicker Component

**Status:** Draft  
**Author:** ChatGPT (gpt-5-codex)  
**Created:** 2025-11-04  
**Updated:** 2025-11-04

---

## Summary

A datepicker form component that supports both single-date and range selection while meeting M Design System requirements for accessibility, localization, theming, and integration with existing form infrastructure. The component will wrap native form inputs using the **Shadow DOM + Slot pattern** mandated for form components, aligning with the architecture described in [ARCHITECTURE.md](../ARCHITECTURE.md) and ADR-001 so we retain perfect accessibility and native form behavior while achieving design-system styling.

---

## Motivation

Product teams currently assemble ad-hoc date pickers using third-party packages or plain text fields. This causes inconsistent UX, accessibility gaps, and duplicated validation logic. A first-party `m-datepicker` closes these gaps by:

- Delivering a unified, accessible calendar experience on desktop, touch, and keyboard-only environments
- Aligning with the [Shadow DOM + Slot pattern](../adr/001-shadow-dom-slot-pattern-for-form-components.md) so the control participates in native form submission, validation, and labeling while staying consistent with our no-build, standards-first architecture
- Centralizing theming, localization, and analytics hooks for date selection flows
- Reducing maintenance costs by consolidating custom implementations into a single component family

---

## Goals

1. Provide intuitive single-date and date-range selection with hover previews and clear affordances
2. Support min/max constraints, disabled dates, and preset shortcuts for common ranges
3. Integrate seamlessly with existing form fields via native inputs projected through the slot
4. Offer full keyboard support (arrow navigation, page jumps, escape to close) and WCAG-compliant focus states
5. Localize month/day labels, first day of week, and RTL layout behavior via Intl APIs
6. Expose extensibility hooks for custom rendering (header, day cells, footer) without breaking guidelines

---

## Non-Goals

- Implementing non-Gregorian calendars in the first release (architecture must allow adapters later)
- Handling time selection; a future datetime picker may extend this work
- Replacing native mobile pickers in platform-specific apps (web component only)

---

## Stakeholders

- **Design Systems Team:** Component owners responsible for design tokens and review
- **Product Integrators:** Feature teams embedding the datepicker into booking/scheduling flows
- **Accessibility Consultant:** Reviews keyboard, screen-reader, and contrast compliance
- **Localization Team:** Verifies locale data, RTL layout, and translations
- **QA Automation:** Builds regression coverage via Playwright and visual snapshots

---

## Architecture

### Component Family

1. **`<m-datepicker>` Root** – Hosts popover logic, state machine, and localization context. Follows the Shadow DOM + Slot pattern from [ARCHITECTURE.md](../ARCHITECTURE.md) and [Component Guidelines](../COMPONENT_GUIDELINES.md): the consumer provides a native `<input type="text">` or `<input type="hidden">` via the default slot so the value serializes with forms.
2. **Calendar Surface** – Rendered inside the shadow root using Lit templates. Includes header (month/year navigation), month grid (Day buttons), and footer (range actions, presets).
3. **Supporting Primitives** – Optional `<m-date-range-field>` composition for range inputs (two slotted native inputs) and shared utilities for date math.

### State Model

- **Modes:** `single` (single Date) and `range` (`[start, end]` Dates or `null`).
- **Controlled/Uncontrolled:** Mirrors other form components with `value`/`defaultValue` and `onChange` callbacks.
- **Open State:** `isOpen`, `defaultOpen`, `onOpenChange` for popover control.
- **Hover Preview:** In range mode, maintain `hoveredDate` to visualize provisional ranges.

### Shadow DOM + Slot Application

- The shadow root provides styling and popover structure.
- Consumers slot native inputs (`<input type="text">`, `<input type="hidden">`) to ensure form submission uses real `<input>` elements.
- Component wires focus/aria attributes to slotted elements using `slotchange` handlers, per ADR-001 requirements.
- Error messaging and descriptions rely on native `aria-describedby` and existing form field wrappers.

---

## API Proposal

```ts
interface DatepickerPreset {
  label: string;
  description?: string;
  getValue: () => Date | [Date, Date];
}

type DatepickerMode = 'single' | 'range';

type DatepickerValue = Date | [Date | null, Date | null] | null;

type DisabledDate = Date | { start: Date; end: Date } | ((date: Date) => boolean);

type DatepickerPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

interface MDatepickerProps {
  mode?: DatepickerMode;
  value?: DatepickerValue;
  defaultValue?: DatepickerValue;
  onChange?: (value: DatepickerValue) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  disabledDates?: DisabledDate | DisabledDate[];
  locale?: string | Intl.Locale;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showOutsideDays?: boolean;
  numberOfMonths?: 1 | 2;
  presets?: DatepickerPreset[];
  renderDay?: (params: DayRenderParams) => unknown;
  renderHeader?: (params: HeaderRenderParams) => unknown;
  renderFooter?: (params: FooterRenderParams) => unknown;
  placement?: DatepickerPlacement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  name?: string;
  required?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
```

`DayRenderParams` exposes `date`, `isSelected`, `isInRange`, `isRangeStart`, `isRangeEnd`, `isDisabled`, `isToday`, and `isOutsideMonth` booleans. Custom renderers must return Lit templates or DOM nodes.

---

## Accessibility

- Conform to WCAG 2.1 AA minimum; align with AAA targets where feasible (focus indicators, color contrast) following existing form component standards.
- Follow WAI-ARIA Authoring Practices for date pickers: `role="dialog"` for popover, `aria-live="polite"` for month changes, `aria-label` announcements for day focus.
- Maintain 44×44px minimum touch targets; use design tokens for spacing.
- Ensure keyboard navigation: Arrow keys move focus within grid; `Home`/`End` jump to week edges; `PageUp`/`PageDown` switch months; `Shift+PageUp/PageDown` change years; `Esc` closes popover and returns focus to slotted trigger input.
- Support assistive text via slotted input `aria-describedby` attributes—component must not break existing form-field wrappers.

---

## Localization & Internationalization

- Use `Intl.DateTimeFormat` for month/day labels, respecting provided locale or app default.
- Accept `firstDayOfWeek` override; fallback uses locale heuristics.
- Mirror layout in RTL contexts by flipping navigation icons and grid order.
- Expose adapter interface to swap underlying date library (`date-fns`, `Temporal`, etc.) while defaulting to `date-fns` for bundle size parity with existing components.

---

## Theming

- Consume design tokens via CSS custom properties for colors, typography, spacing, and elevation.
- Expose CSS parts (`calendar`, `header`, `month-grid`, `day`, `preset-list`) for deeper customization consistent with [Component Guidelines](../COMPONENT_GUIDELINES.md).
- Provide variants through host attributes, e.g., `variant="inline"` for always-visible calendars without popover.

---

## Validation & Error Handling

- Respect native validation: slotted input uses `required`, `min`, `max`, and custom validity where applicable.
- Provide `onValidationError` event emitted from shadow root when validation fails, passing the error type.
- In range mode, prevent invalid ranges (end before start) by auto-correcting or blocking second selection.
- Allow integrators to mark specific dates disabled with tooltips describing the reason.

---

## Analytics & Telemetry

- Fire `m-datepicker-open`, `m-datepicker-close`, `m-datepicker-select`, and `m-datepicker-preset` custom events with contextual detail (selected date(s), preset id) while ensuring PII-safe payloads.
- Support integration with existing analytics middleware by bubbling events.

---

## Testing Strategy

1. **Unit Tests:** Date math helpers, state reducers, disabled-date logic.
2. **Component Tests:** Keyboard navigation, range selection, popover open/close using Web Test Runner or Playwright.
3. **Accessibility Tests:** axe-core automated checks plus manual screen-reader audit (NVDA, VoiceOver).
4. **Visual Regression:** Playwright screenshot tests against fixtures in `apps/playground` to guard key states (single, range, disabled, inline, RTL).
5. **Localization Tests:** Snapshot tests verifying month/day labels for sample locales and RTL layout.

---

## Documentation & Examples

- Document the component in the `apps/docs` site using native ES module examples that can run without a build step.
- Provide runnable demos in `apps/playground` showing single-date, range, preset quick filters, inline variant, disabled dates, and controlled mode.
- Publish integration examples showing slotting native inputs into `m-form-field` wrappers for consistent labeling.

---

## Rollout Plan

1. **Design Finalization (1–2 weeks):** Align with design, accessibility, and localization stakeholders; confirm tokens.
2. **Core Implementation (3 weeks):** Build calendar primitives, popover wiring, single-date mode.
3. **Range Mode & Presets (2 weeks):** Implement range visualization, hover preview, preset list.
4. **Accessibility & Localization Polish (1 week):** Validate keyboard, screen reader, RTL support.
5. **Testing & Documentation (2 weeks):** Write automated tests, update docs site content, migration guidance.
6. **Beta Release (1 week):** Pilot with select product teams, collect feedback.
7. **General Availability (1 week):** Address feedback, finalize API, announce adoption plan.

---

## Future Enhancements

- Time selection (datetime picker) built atop shared calendar primitives.
- Multi-month grid display for wider range selection scenarios.
- Alternative calendar systems via pluggable adapters.
- Inline availability indicators (e.g., pricing or status badges) via slot extensibility.
- Mobile-optimized bottom sheet presentation using same core logic.

---

## Open Questions

1. Should we support keyboard shortcuts for jumping to preset ranges (e.g., `Alt+Number`)?
2. Do we need built-in timezone awareness, or can integrators normalize values externally?
3. Should inline variant expose additional layout tokens for embedding in dashboards?
4. What telemetry fields are required for analytics parity with existing reporting dashboards?

---

## References

- [ADR-001: Shadow DOM + Slot Pattern for Form Components](../adr/001-shadow-dom-slot-pattern-for-form-components.md)
- [Component Guidelines](../COMPONENT_GUIDELINES.md)
- [WAI-ARIA Date Picker Design Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

