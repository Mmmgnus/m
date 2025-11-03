import { LitElement, html, css } from 'lit';

/**
 * A radio button component that wraps a native radio input element.
 * Uses shadow DOM with slots for style isolation while preserving perfect accessibility.
 * Wraps content in a <label> element for implicit label association.
 *
 * @element m-radio
 * @slot - Native <input type="radio"> element
 * @slot label - Custom label content (alternative to label prop)
 *
 * @example
 * # Basic usage with label prop
 * ```html
 * <m-radio label="Option 1">
 *   <input type="radio" name="choice" value="1">
 * </m-radio>
 * ```
 *
 * @example
 * # Custom slotted label
 * ```html
 * <m-radio>
 *   <input type="radio" name="choice" value="2">
 *   <span slot="label">Custom <strong>label</strong></span>
 * </m-radio>
 * ```
 *
 * @example
 * # Disabled state
 * ```html
 * <m-radio label="Option 3">
 *   <input type="radio" name="choice" value="3" disabled>
 * </m-radio>
 * ```
 */
export class MRadio extends LitElement {
  static defaultTagName = 'm-radio';

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    .radio-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--m-radio-gap, 8px);
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    /* Radio button styling */
    ::slotted(input[type="radio"]) {
      width: var(--m-radio-size, 20px);
      height: var(--m-radio-size, 20px);
      margin: 0;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      
      border: var(--m-radio-border-width, 2px) solid var(--m-radio-border-color, #ccc);
      border-radius: var(--m-radio-border-radius, 50%);
      background: var(--m-radio-background, transparent);
      
      transition: all 0.15s ease;
      position: relative;
      flex-shrink: 0;
    }

    /* Hover state */
    ::slotted(input[type="radio"]:hover) {
      border-color: var(--m-radio-border-color-hover, #999);
    }

    /* Focus state */
    ::slotted(input[type="radio"]:focus-visible) {
      outline: var(--m-radio-focus-outline-width, 2px) solid var(--m-radio-focus-outline-color, var(--m-color-primary, #0066cc));
      outline-offset: var(--m-radio-focus-outline-offset, 2px);
    }

    /* Checked state */
    ::slotted(input[type="radio"]:checked) {
      border-color: var(--m-radio-border-color-checked, var(--m-color-primary, #0066cc));
      background: var(--m-radio-background-checked, var(--m-color-primary, #0066cc));
      background-image: radial-gradient(
        circle,
        var(--m-radio-dot-color, white) 0%,
        var(--m-radio-dot-color, white) 40%,
        transparent 40%
      );
    }

    /* Disabled state */
    ::slotted(input[type="radio"]:disabled) {
      opacity: var(--m-radio-opacity-disabled, 0.5);
      cursor: not-allowed;
    }

    :host(:has(input[type="radio"]:disabled)) {
      cursor: not-allowed;
    }

    /* Label styling */
    .label-text {
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-font-size-base, 1rem);
      line-height: 1.5;
      color: var(--m-radio-label-color, inherit);
      user-select: none;
    }

    .label-text:empty {
      display: none;
    }

    ::slotted([slot="label"]) {
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-font-size-base, 1rem);
      line-height: 1.5;
      color: var(--m-radio-label-color, inherit);
      user-select: none;
    }
  `;

  static properties = {
    /**
     * Label text displayed next to the radio button
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
    const wrapper = this.shadowRoot.querySelector('.radio-wrapper');
    wrapper.addEventListener('click', (e) => {
      const input = this.querySelector('input[type="radio"]');
      // Only click if we didn't click the input itself and it's not disabled
      if (input && e.target !== input && !input.disabled) {
        input.click();
        input.focus();
      }
    });
  }

  render() {
    return html`
      <label class="radio-wrapper">
        <slot></slot>
        <slot name="label">
          ${this.label ? html`<span class="label-text">${this.label}</span>` : ''}
        </slot>
      </label>
    `;
  }
}

/**
 * Register the MRadio component
 * @param {string} [tagName='m-radio'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MRadio.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MRadio);
  }
  return tagName;
}
