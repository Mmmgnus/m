import { LitElement, html, css } from 'lit';

/**
 * A checkbox component that wraps a native checkbox input element.
 * Uses shadow DOM with slots for style isolation while preserving perfect accessibility.
 * Wraps content in a <label> element for implicit label association.
 *
 * @element m-checkbox
 * @slot - Native <input type="checkbox"> element
 *
 * @example
 * # Basic usage with label prop
 * ```html
 * <m-checkbox label="I agree to the terms">
 *   <input type="checkbox" name="terms">
 * </m-checkbox>
 * ```
 *
 * @example
 * # Without label (use external label)
 * ```html
 * <m-checkbox>
 *   <input type="checkbox" id="terms" name="terms">
 * </m-checkbox>
 * <label for="terms">External label</label>
 * ```
 *
 * @example
 * # Disabled state
 * ```html
 * <m-checkbox label="Not available">
 *   <input type="checkbox" name="unavailable" disabled>
 * </m-checkbox>
 * ```
 */
export class MCheckbox extends LitElement {
  static defaultTagName = 'm-checkbox';

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--m-checkbox-gap, 8px);
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    /* Checkbox styling */
    ::slotted(input[type="checkbox"]) {
      width: var(--m-checkbox-size, 20px);
      height: var(--m-checkbox-size, 20px);
      margin: 0;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      
      border: var(--m-checkbox-border-width, 2px) solid var(--m-checkbox-border-color, #ccc);
      border-radius: var(--m-checkbox-border-radius, 4px);
      background: var(--m-checkbox-background, transparent);
      
      transition: all 0.15s ease;
      position: relative;
      flex-shrink: 0;
    }

    /* Hover state */
    ::slotted(input[type="checkbox"]:hover) {
      border-color: var(--m-checkbox-border-color-hover, #999);
    }

    /* Focus state */
    ::slotted(input[type="checkbox"]:focus-visible) {
      outline: var(--m-checkbox-focus-outline-width, 2px) solid var(--m-checkbox-focus-outline-color, var(--m-color-primary, #0066cc));
      outline-offset: var(--m-checkbox-focus-outline-offset, 2px);
    }

    /* Checked state */
    ::slotted(input[type="checkbox"]:checked) {
      border-color: var(--m-checkbox-border-color-checked, var(--m-color-primary, #0066cc));
      background: var(--m-checkbox-background-checked, var(--m-color-primary, #0066cc));
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: var(--m-checkbox-checkmark-size, 12px);
    }

    /* Indeterminate state */
    ::slotted(input[type="checkbox"]:indeterminate) {
      border-color: var(--m-checkbox-border-color-checked, var(--m-color-primary, #0066cc));
      background: var(--m-checkbox-indeterminate-background, var(--m-color-primary, #0066cc));
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: var(--m-checkbox-checkmark-size, 12px);
    }

    /* Disabled state */
    ::slotted(input[type="checkbox"]:disabled) {
      opacity: var(--m-checkbox-opacity-disabled, 0.5);
      cursor: not-allowed;
    }

    :host(:has(input[type="checkbox"]:disabled)) {
      cursor: not-allowed;
    }

    /* Label styling */
    .label-text {
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-font-size-base, 1rem);
      line-height: 1.5;
      color: var(--m-checkbox-label-color, inherit);
      user-select: none;
    }

    .label-text:empty {
      display: none;
    }
  `;

  static properties = {
    /**
     * Label text displayed next to the checkbox
     * @type {string}
     */
    label: { type: String },
  };

  constructor() {
    super();
    this.label = '';
  }

  firstUpdated() {
    // Forward label clicks to input (shadow DOM -> light DOM)
    const wrapper = this.shadowRoot.querySelector('.checkbox-wrapper');
    wrapper.addEventListener('click', (e) => {
      const input = this.querySelector('input[type="checkbox"]');
      // Only click if we didn't click the input itself and it's not disabled
      if (input && e.target !== input && !input.disabled) {
        input.click();
        input.focus();
      }
    });
  }

  render() {
    return html`
      <label class="checkbox-wrapper">
        <slot></slot>
        ${this.label ? html`<span class="label-text">${this.label}</span>` : ''}
      </label>
    `;
  }
}

/**
 * Register the MCheckbox component
 * @param {string} [tagName='m-checkbox'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MCheckbox.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MCheckbox);
  }
  return tagName;
}
