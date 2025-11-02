import { LitElement, html, css } from 'lit';

/**
 * A button wrapper component that styles a slotted native button element.
 * 
 * This approach uses light DOM (no shadow DOM) to ensure perfect compatibility
 * with labels and other form elements. It requires developers to provide their
 * own <button> element, which preserves all native button behavior and
 * accessibility while applying design system styling.
 * 
 * **Key Features:**
 * - No shadow DOM - perfect label/input connections
 * - Optional label property for convenience
 * - All native button features work perfectly
 * - Full ARIA support without limitations
 * 
 * @element m-button-slot
 * @slot - A native <button> element to be styled
 * 
 * @example
 * <m-button-slot>
 *   <button type="submit">Submit</button>
 * </m-button-slot>
 * 
 * @example
 * <m-button-slot label="Save document">
 *   <button type="submit">Save</button>
 * </m-button-slot>
 * 
 * @example
 * <m-button-slot variant="secondary">
 *   <button type="button" disabled>Cancel</button>
 * </m-button-slot>
 */
export class MButtonSlot extends LitElement {
  static defaultTagName = 'm-button-slot';
  
  static properties = {
    /**
     * Visual variant of the button
     * @type {'primary' | 'secondary'}
     * @default 'primary'
     */
    variant: { type: String, reflect: true },
    
    /**
     * Size variant of the button
     * @type {'sm' | 'md' | 'lg'}
     * @default 'md'
     */
    size: { type: String, reflect: true },
    
    /**
     * Optional label text. If provided, a <label> element will be
     * automatically created and connected to the slotted button.
     * @type {string}
     */
    label: { type: String }
  };
  
  // NO STYLES - Using light DOM with scoped CSS classes instead
  // This allows labels to work properly without shadow DOM boundaries
  
  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.label = '';
  }
  
  /**
   * Render in light DOM (no shadow DOM).
   * This ensures labels can reference buttons via 'for' attribute.
   * @returns {this}
   */
  createRenderRoot() {
    return this;
  }
  
  /**
   * After first render, ensure button has an ID and connect label if needed.
   * @private
   */
  firstUpdated() {
    this._ensureButtonId();
    this._connectLabel();
  }
  
  /**
   * When properties update, reconnect label if needed.
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('label')) {
      this._connectLabel();
    }
  }
  
  /**
   * Ensures the slotted button has a unique ID.
   * @private
   */
  _ensureButtonId() {
    const button = this.querySelector('button');
    if (!button) {
      console.warn('m-button-slot: No <button> element found. Please provide a <button> element.');
      return;
    }
    
    if (!button.id) {
      button.id = `button-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  
  /**
   * Connects the label to the button via 'for' attribute.
   * @private
   */
  _connectLabel() {
    const button = this.querySelector('button');
    const label = this.querySelector('.m-button-slot__label');
    
    if (label && button) {
      label.setAttribute('for', button.id);
    }
  }
  
  render() {
    // Get button attributes for styling
    const classes = ['m-button-slot'];
    classes.push(`m-button-slot--${this.variant}`);
    classes.push(`m-button-slot--${this.size}`);
    
    return html`
      <style>
        /* Scoped styles for this component instance */
        .m-button-slot {
          display: inline-block;
        }
        
        .m-button-slot__label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: var(--m-font-family, system-ui, -apple-system, sans-serif);
          font-size: var(--m-font-size-base, 1rem);
          font-weight: 500;
          color: var(--m-color-text, #333);
        }
        
        .m-button-slot__wrapper {
          position: relative;
        }
        
        /* Base button styles */
        .m-button-slot button {
          /* Reset */
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          font: inherit;
          cursor: pointer;
          text-decoration: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          
          /* Design tokens */
          background: var(--m-button-bg, var(--m-color-primary, #0066cc));
          color: var(--m-button-text, var(--m-color-text, white));
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
          width: 100%;
          min-height: 2.5rem;
          line-height: 1.5;
          font-weight: 500;
        }
        
        .m-button-slot button:hover:not(:disabled) {
          background: var(--m-button-bg-hover, var(--m-color-primary-hover, #0052a3));
        }
        
        .m-button-slot button:active:not(:disabled) {
          transform: translateY(1px);
        }
        
        .m-button-slot button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .m-button-slot button:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        
        /* Variant: Secondary */
        .m-button-slot--secondary button {
          background: var(--m-button-bg, var(--m-color-secondary, #6c757d));
        }
        
        .m-button-slot--secondary button:hover:not(:disabled) {
          background: var(--m-button-bg-hover, #5a6268);
        }
        
        /* Size: Small */
        .m-button-slot--sm button {
          font-size: 0.875rem;
          padding: 0.25rem 0.75rem;
          min-height: 2rem;
        }
        
        /* Size: Large */
        .m-button-slot--lg button {
          font-size: 1.125rem;
          padding: 0.75rem 1.5rem;
          min-height: 3rem;
        }
      </style>
      
      <div class="${classes.join(' ')}">
        ${this.label ? html`
          <label class="m-button-slot__label">${this.label}</label>
        ` : ''}
        <div class="m-button-slot__wrapper">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

/**
 * Register the m-button-slot component.
 * 
 * @param {string} [tagName='m-button-slot'] - The tag name to register the component as
 * @returns {string} The registered tag name
 * 
 * @example
 * import { register } from './m-button-slot.js';
 * register(); // Registers as 'm-button-slot'
 * 
 * @example
 * import { register } from './m-button-slot.js';
 * register('my-custom-button'); // Registers with custom name
 */
export function register(tagName = MButtonSlot.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonSlot);
  }
  return tagName;
}
