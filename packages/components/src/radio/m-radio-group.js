import { LitElement, html, css } from 'lit';

/**
 * A radio group component that provides semantic grouping for radio buttons.
 * Renders a fieldset with legend for proper accessibility.
 *
 * @element m-radio-group
 * @slot - One or more <m-radio> components
 *
 * @example
 * # Basic usage
 * ```html
 * <m-radio-group name="choice" label="Choose an option">
 *   <m-radio label="Option 1">
 *     <input type="radio" name="choice" value="1">
 *   </m-radio>
 *   <m-radio label="Option 2">
 *     <input type="radio" name="choice" value="2">
 *   </m-radio>
 * </m-radio-group>
 * ```
 *
 * @example
 * # Horizontal layout
 * ```html
 * <m-radio-group name="size" label="Select size" orientation="horizontal">
 *   <m-radio label="Small">
 *     <input type="radio" name="size" value="s">
 *   </m-radio>
 *   <m-radio label="Medium">
 *     <input type="radio" name="size" value="m">
 *   </m-radio>
 *   <m-radio label="Large">
 *     <input type="radio" name="size" value="l">
 *   </m-radio>
 * </m-radio-group>
 * ```
 */
export class MRadioGroup extends LitElement {
  static defaultTagName = 'm-radio-group';

  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    fieldset {
      border: none;
      margin: 0;
      padding: 0;
      min-width: 0;
    }

    legend {
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-font-size-base, 1rem);
      font-weight: var(--m-radio-group-legend-font-weight, 600);
      color: var(--m-radio-group-legend-color, inherit);
      margin-bottom: var(--m-radio-group-legend-margin, 8px);
      padding: 0;
    }

    legend:empty {
      display: none;
      margin-bottom: 0;
    }

    .radio-container {
      display: flex;
      flex-direction: column;
      gap: var(--m-radio-group-gap, 12px);
    }

    :host([orientation="horizontal"]) .radio-container {
      flex-direction: row;
      flex-wrap: wrap;
    }

    ::slotted(m-radio) {
      display: inline-flex;
    }
  `;

  static properties = {
    /**
     * Name attribute for all radio buttons in the group
     * @type {string}
     */
    name: { type: String },

    /**
     * Group label displayed as legend
     * @type {string}
     */
    label: { type: String },

    /**
     * Layout direction for radio buttons
     * @type {'vertical'|'horizontal'}
     */
    orientation: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.name = '';
    this.label = '';
    this.orientation = 'vertical';
  }

  render() {
    return html`
      <fieldset>
        ${this.label ? html`<legend>${this.label}</legend>` : ''}
        <div class="radio-container">
          <slot></slot>
        </div>
      </fieldset>
    `;
  }
}

/**
 * Register the MRadioGroup component
 * @param {string} [tagName='m-radio-group'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MRadioGroup.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MRadioGroup);
  }
  return tagName;
}
