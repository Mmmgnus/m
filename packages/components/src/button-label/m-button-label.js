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
 * # Icon Before Text
 * ```html
 * <m-button variant="primary">
 *   <button>
 *     <m-button-label>
 *       <svg slot="start" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
 *         <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
 *       </svg>
 *       Dashboard
 *     </m-button-label>
 *   </button>
 * </m-button>
 * <m-button variant="secondary">
 *   <button>
 *     <m-button-label>
 *       <svg slot="start" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
 *         <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
 *         <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
 *       </svg>
 *       Settings
 *     </m-button-label>
 *   </button>
 * </m-button>
 * ```
 *
 * @example
 * # Icon After Text
 * ```html
 * <m-button variant="primary">
 *   <button>
 *     <m-button-label>
 *       Next Step
 *       <svg slot="end" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
 *         <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
 *       </svg>
 *     </m-button-label>
 *   </button>
 * </m-button>
 * <m-button variant="secondary">
 *   <button>
 *     <m-button-label>
 *       Download
 *       <svg slot="end" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
 *         <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
 *         <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
 *       </svg>
 *     </m-button-label>
 *   </button>
 * </m-button>
 * ```
 *
 * @example
 * # Icon Only
 * ```html
 * <m-button variant="primary">
 *   <button aria-label="Search">
 *     <m-button-label>
 *       <svg slot="start" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
 *         <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
 *       </svg>
 *     </m-button-label>
 *   </button>
 * </m-button>
 * <m-button variant="outline">
 *   <button aria-label="Close">
 *     <m-button-label>
 *       <svg slot="start" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
 *         <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
 *       </svg>
 *     </m-button-label>
 *   </button>
 * </m-button>
 * ```
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
