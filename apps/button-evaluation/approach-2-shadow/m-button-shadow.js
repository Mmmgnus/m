import { LitElement, html, css } from 'lit';
import { nothing } from 'lit';

/**
 * A button component wrapping a native button element in shadow DOM.
 * 
 * This approach uses a native `<button>` element inside the shadow DOM,
 * which provides built-in button semantics.
 * 
 * **Known Limitations:**
 * - Shadow DOM creates accessibility barriers:
 *   - Screen readers announce host as "Group" before reaching the button
 *   - aria-describedby and aria-labelledby don't work across shadow boundary
 * - These are fundamental limitations of shadow DOM for form elements
 * - Form association handled through `form` attribute or manual submission
 * 
 * @element m-button-shadow
 * @fires click - Fires when the button is clicked
 * @slot - Button content (text, icons, etc.)
 * 
 * @example
 * <m-button-shadow type="submit">Submit</m-button-shadow>
 * 
 * @example
 * <m-button-shadow type="button" disabled>Disabled</m-button-shadow>
 * 
 * @example
 * <m-button-shadow form="my-form">External Submit</m-button-shadow>
 */
export class MButtonShadow extends LitElement {
  static defaultTagName = 'm-button-shadow';
  
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };
  
  static properties = {
    /**
     * The type of button
     * @type {'button' | 'submit' | 'reset'}
     * @default 'submit'
     */
    type: { type: String },
    
    /**
     * Whether the button is disabled
     * @type {boolean}
     * @default false
     */
    disabled: { type: Boolean, reflect: true },
    
    /**
     * Accessible label for the button
     * @type {string}
     */
    ariaLabel: { type: String, attribute: 'aria-label' },
    
    /**
     * ID of element that labels this button
     * @type {string}
     */
    ariaLabelledby: { type: String, attribute: 'aria-labelledby' },
    
    /**
     * ID of element that describes this button
     * @type {string}
     */
    ariaDescribedby: { type: String, attribute: 'aria-describedby' },
    
    /**
     * Form ID to associate with (for form submission across shadow boundary)
     * @type {string}
     */
    form: { type: String }
  };
  
  static styles = css`
    :host {
      display: inline-block;
      /* Allow custom properties to cascade */
    }

    /* Focus indicator on host when button has focus */
    :host(:focus-visible),
    :host(:focus-within) {
      outline: 2px solid var(--m-color-primary, #0066cc);
      outline-offset: 2px;
      border-radius: var(--m-border-radius, 0.25rem);
    }
    
    button {
      /* Reset default button styles */
      border: none;
      margin: 0;
      padding: 0;
      background: none;
      font: inherit;
      cursor: pointer;
      
      /* Apply design tokens */
      background: var(--m-color-primary, #0066cc);
      color: var(--m-color-text, white);
      font-family: var(--m-font-family, system-ui, -apple-system, sans-serif);
      font-size: var(--m-font-size-base, 1rem);
      padding: var(--m-spacing-sm, 0.5rem) var(--m-spacing-md, 1rem);
      border-radius: var(--m-border-radius, 0.25rem);
      transition: background var(--m-transition-duration, 0.2s);
      
      /* Layout */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 2.5rem;
      
      /* Ensure button fills host */
      width: 100%;
    }
    
    button:hover:not(:disabled) {
      background: var(--m-color-primary-hover, #0052a3);
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    
    button:active:not(:disabled) {
      transform: translateY(1px);
    }
  `;
  
  constructor() {
    super();
    this.type = 'submit';
    this.disabled = false;
    this.ariaLabel = '';
    this.ariaLabelledby = '';
    this.ariaDescribedby = '';
    this.form = '';
  }
  
  /**
   * Handles button clicks for form interaction.
   * 
   * Since buttons in shadow DOM may not automatically participate in form
   * submission, we handle it manually when needed. If the `form` attribute
   * is set, the native button will handle association. Otherwise, we find
   * the closest parent form and submit/reset it.
   * 
   * @param {MouseEvent} e - Click event
   * @private
   */
  _handleClick(e) {
    // If the button is disabled, do nothing
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    
    // If form attribute is set, the native button handles submission
    if (this.form) {
      return;
    }
    
    // For submit/reset without form attribute, find and interact with parent form
    if (this.type === 'submit' || this.type === 'reset') {
      const form = this.closest('form');
      if (form) {
        e.preventDefault(); // Prevent default to control submission
        if (this.type === 'submit') {
          // Use requestSubmit to trigger validation and submit event
          form.requestSubmit();
        } else if (this.type === 'reset') {
          form.reset();
        }
      }
    }
  }
  
  render() {
    return html`
      <button
        type="${this.type}"
        ?disabled="${this.disabled}"
        aria-label="${this.ariaLabel || nothing}"
        aria-labelledby="${this.ariaLabelledby || nothing}"
        aria-describedby="${this.ariaDescribedby || nothing}"
        form="${this.form || nothing}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }
}

/**
 * Register the component with the custom elements registry.
 * 
 * @param {string} [tagName='m-button-shadow'] - The tag name to register
 * @returns {string} The registered tag name
 * 
 * @example
 * import { register } from './m-button-shadow.js';
 * register(); // Registers as 'm-button-shadow'
 * 
 * @example
 * import { register } from './m-button-shadow.js';
 * register('my-button'); // Registers as 'my-button'
 */
export function register(tagName = MButtonShadow.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonShadow);
  }
  return tagName;
}
