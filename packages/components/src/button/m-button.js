import { LitElement, html, css } from 'lit';

/**
 * A button component that wraps a native button element.
 * Uses shadow DOM with slots for style isolation while preserving perfect accessibility.
 *
 * @element m-button
 * @slot - Native <button> element
 *
 * @example
 * # Variants
 * ```html
 * <m-button>
 *   <button type="button">Default</button>
 * </m-button>
 * <m-button variant="primary">
 *   <button type="button">Primary</button>
 * </m-button>
 * <m-button variant="secondary">
 *   <button type="button">Secondary</button>
 * </m-button>
 * <m-button variant="outline">
 *   <button type="button">Outline</button>
 * </m-button>
 * ```
 *
 * @example
 * # Sizes
 * ```html
 * <m-button size="small" variant="primary">
 *   <button type="button">Small</button>
 * </m-button>
 * <m-button size="medium" variant="primary">
 *   <button type="button">Medium</button>
 * </m-button>
 * <m-button size="large" variant="primary">
 *   <button type="button">Large</button>
 * </m-button>
 * ```
 *
 * @example
 * # States
 * ```html
 * <m-button variant="primary">
 *   <button type="button">Enabled</button>
 * </m-button>
 * <m-button variant="primary">
 *   <button type="button" disabled>Disabled</button>
 * </m-button>
 * ```
 */
export class MButton extends LitElement {
  static defaultTagName = 'm-button';

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    /* Default variant styles */
    ::slotted(button) {
      padding: var(--m-button-padding, 8px 16px);
      border: 1px solid var(--m-button-border-color, #ccc);
      border-radius: var(--m-button-border-radius, 4px);
      background: var(--m-button-background, #f5f5f5);
      color: var(--m-button-color, inherit);
      cursor: pointer;
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-font-size-base, 1rem);
      line-height: 1.5;
      transition: background 0.15s ease, border-color 0.15s ease;
      box-sizing: border-box;
    }

    ::slotted(button:hover) {
      background: var(--m-button-background-hover, #e0e0e0);
    }

    ::slotted(button:focus-visible) {
      outline: 2px solid var(--m-color-primary, #0066cc);
      outline-offset: 2px;
    }

    ::slotted(button:disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Variant: primary */
    :host([variant="primary"]) ::slotted(button) {
      background: var(--m-color-primary, #0066cc);
      color: var(--m-color-primary-text, white);
      border-color: var(--m-color-primary, #0066cc);
    }

    :host([variant="primary"]) ::slotted(button:hover) {
      background: var(--m-color-primary-hover, #0052a3);
      border-color: var(--m-color-primary-hover, #0052a3);
    }

    /* Variant: secondary */
    :host([variant="secondary"]) ::slotted(button) {
      background: var(--m-color-secondary, #6c757d);
      color: var(--m-color-secondary-text, white);
      border-color: var(--m-color-secondary, #6c757d);
    }

    :host([variant="secondary"]) ::slotted(button:hover) {
      background: var(--m-color-secondary-hover, #5a6268);
      border-color: var(--m-color-secondary-hover, #5a6268);
    }

    /* Variant: outline */
    :host([variant="outline"]) ::slotted(button) {
      background: transparent;
      color: var(--m-color-primary, #0066cc);
      border-color: var(--m-color-primary, #0066cc);
    }

    :host([variant="outline"]) ::slotted(button:hover) {
      background: var(--m-color-primary, #0066cc);
      color: var(--m-color-primary-text, white);
    }

    /* Size: small */
    :host([size="small"]) ::slotted(button) {
      padding: var(--m-button-padding-small, 4px 12px);
      font-size: var(--m-font-size-small, 0.875rem);
    }

    /* Size: large */
    :host([size="large"]) ::slotted(button) {
      padding: var(--m-button-padding-large, 12px 24px);
      font-size: var(--m-font-size-large, 1.125rem);
    }
  `;

  static properties = {
    /**
     * Visual variant of the button
     * @type {string}
     */
    variant: { type: String, reflect: true },
    
    /**
     * Size variant of the button
     * @type {string}
     */
    size: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'medium';
  }

  render() {
    return html`<slot></slot>`;
  }
}

/**
 * Register the MButton component
 * @param {string} [tagName='m-button'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MButton.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButton);
  }
  return tagName;
}
