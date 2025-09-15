import { LitElement, html, css } from 'lit';

/**
 * A simple button component for M Design System
 *
 * @element m-button
 * @slot - Button content
 */
export class MButton extends LitElement {
  static defaultTagName = 'm-button';

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
      font: inherit;
    }

    button:hover {
      background: #e0e0e0;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  static properties = {
    /**
     * Whether the button is disabled
     * @type {boolean}
     */
    disabled: { type: Boolean, reflect: true }
  };

  render() {
    return html`
      <button ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
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
