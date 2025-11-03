import { LitElement, html, css } from 'lit';

/**
 * A button label component for organizing button content with icons.
 * Provides start and end slots for icon positioning around the label text.
 *
 * @element m-button-label
 * @slot start - Content to display before the label (typically an icon)
 * @slot - Default slot for the label text
 * @slot end - Content to display after the label (typically an icon)
 *
 * @example
 * <button>
 *   <m-button-label>
 *     <svg slot="start">...</svg>
 *     Save Document
 *   </m-button-label>
 * </button>
 *
 * @example
 * <button>
 *   <m-button-label>
 *     Send
 *     <svg slot="end">...</svg>
 *   </m-button-label>
 * </button>
 */
export class MButtonLabel extends LitElement {
  static defaultTagName = 'm-button-label';

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--m-button-label-gap, 0.5rem);
      justify-content: center;
    }

    :host([hidden]) {
      display: none;
    }

    /* Icon slots */
    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
      display: inline-flex;
      flex-shrink: 0;
      width: var(--m-button-icon-size, 1em);
      height: var(--m-button-icon-size, 1em);
    }

    /* Ensure SVG icons inherit color */
    ::slotted(svg) {
      fill: currentColor;
      width: 100%;
      height: 100%;
    }

    /* Default slot (label text) */
    slot:not([name]) {
      display: inline-block;
    }
  `;

  render() {
    return html`
      <slot name="start"></slot>
      <slot></slot>
      <slot name="end"></slot>
    `;
  }
}

/**
 * Register the MButtonLabel component
 * @param {string} [tagName='m-button-label'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MButtonLabel.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonLabel);
  }
  return tagName;
}
