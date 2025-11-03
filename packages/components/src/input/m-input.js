import { LitElement, html, css } from 'lit';

/**
 * An input field component that wraps a native input element.
 * Uses shadow DOM with slots for style isolation while preserving perfect accessibility.
 *
 * @element m-input
 * @slot label - Optional custom label element (for full control)
 * @slot - Native <input> element (required)
 * @slot error - Optional custom error message (rendered in light DOM for ARIA)
 * @slot help - Optional custom help text (rendered in light DOM for ARIA)
 *
 * @example
 * # Basic Input
 * ```html
 * <m-input label="Email" required>
 *   <input type="email" name="email" placeholder="you@example.com">
 * </m-input>
 * ```
 *
 * @example
 * # With Help Text
 * ```html
 * <m-input label="Password" help="Must be at least 8 characters">
 *   <input type="password" name="password">
 * </m-input>
 * ```
 *
 * @example
 * # With Error
 * ```html
 * <m-input label="Username" error="This username is already taken">
 *   <input type="text" name="username" value="john">
 * </m-input>
 * ```
 *
 * @example
 * # Sizes
 * ```html
 * <m-input label="Small" size="small">
 *   <input type="text" placeholder="Small input">
 * </m-input>
 * <m-input label="Medium (default)" size="medium">
 *   <input type="text" placeholder="Medium input">
 * </m-input>
 * <m-input label="Large" size="large">
 *   <input type="text" placeholder="Large input">
 * </m-input>
 * ```
 *
 * @example
 * # Disabled
 * ```html
 * <m-input label="Disabled Field">
 *   <input type="text" value="Cannot edit" disabled>
 * </m-input>
 * ```
 */
export class MInput extends LitElement {
  static defaultTagName = 'm-input';

  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .m-input {
      display: flex;
      flex-direction: column;
    }

    .m-input__label {
      display: block;
      margin-bottom: var(--m-input-label-margin, 0.5rem);
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-input-label-font-size, 0.875rem);
      font-weight: var(--m-input-label-font-weight, 500);
      color: var(--m-input-label-color, #333);
    }

    .m-input__label--required::after {
      content: ' *';
      color: var(--m-color-error, #dc3545);
    }

    .m-input__wrapper {
      position: relative;
    }

    ::slotted(input) {
      width: 100%;
      padding: var(--m-input-padding, 0.5rem 0.75rem);
      border: 1px solid var(--m-input-border-color, #ccc);
      border-radius: var(--m-input-border-radius, 0.25rem);
      background: var(--m-input-background, white);
      color: var(--m-input-color, inherit);
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-input-font-size, 1rem);
      line-height: 1.5;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      box-sizing: border-box;
    }

    ::slotted(input:focus) {
      outline: none;
      border-color: var(--m-color-primary, #0066cc);
      box-shadow: 0 0 0 3px var(--m-input-focus-shadow, rgba(0, 102, 204, 0.1));
    }

    ::slotted(input:disabled) {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--m-input-background-disabled, #f5f5f5);
    }

    ::slotted(input::placeholder) {
      color: var(--m-input-placeholder-color, #999);
    }

    /* Error state */
    :host([error]) ::slotted(input),
    :host([error]) ::slotted(input:focus) {
      border-color: var(--m-color-error, #dc3545);
    }

    :host([error]) ::slotted(input:focus) {
      box-shadow: 0 0 0 3px var(--m-input-error-shadow, rgba(220, 53, 69, 0.1));
    }

    .m-input__error {
      margin-top: var(--m-input-message-margin, 0.25rem);
      font-size: var(--m-input-message-font-size, 0.875rem);
      color: var(--m-color-error, #dc3545);
    }

    .m-input__help {
      margin-top: var(--m-input-message-margin, 0.25rem);
      font-size: var(--m-input-message-font-size, 0.875rem);
      color: var(--m-input-help-color, #666);
    }

    /* Size variants */
    :host([size="small"]) ::slotted(input) {
      padding: var(--m-input-padding-small, 0.25rem 0.5rem);
      font-size: var(--m-input-font-size-small, 0.875rem);
    }

    :host([size="large"]) ::slotted(input) {
      padding: var(--m-input-padding-large, 0.75rem 1rem);
      font-size: var(--m-input-font-size-large, 1.125rem);
    }

    /* Label slot styling */
    ::slotted([slot="label"]) {
      display: block;
      margin-bottom: var(--m-input-label-margin, 0.5rem);
      font-family: var(--m-font-family, inherit);
      font-size: var(--m-input-label-font-size, 0.875rem);
      font-weight: var(--m-input-label-font-weight, 500);
      color: var(--m-input-label-color, #333);
    }
  `;

  static properties = {
    /**
     * Label text for the input
     * @type {string}
     */
    label: { type: String },
    
    /**
     * Error message to display
     * @type {string}
     */
    error: { type: String, reflect: true },
    
    /**
     * Help text for the input
     * @type {string}
     */
    help: { type: String },
    
    /**
     * Whether the input is required
     * @type {boolean}
     */
    required: { type: Boolean, reflect: true },
    
    /**
     * Size variant of the input
     * @type {string}
     */
    size: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.label = '';
    this.error = '';
    this.help = '';
    this.required = false;
    this.size = 'medium';
  }

  async firstUpdated() {
    await this.updateComplete;
    this._setupErrorHelp();
    this._connectAria();
  }

  async updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('error') || changedProperties.has('help')) {
      await this.updateComplete;
      this._setupErrorHelp();
    }
    if (changedProperties.has('label') || 
        changedProperties.has('error') || 
        changedProperties.has('help')) {
      await this.updateComplete;
      this._connectAria();
    }
  }

  /**
   * Setup error/help elements in light DOM for ARIA accessibility
   * @private
   */
  _setupErrorHelp() {
    const input = this.querySelector('input');
    if (!input) return;

    // Ensure input has ID
    if (!input.id) {
      input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Handle error message
    let errorSlot = this.querySelector('[slot="error"]');
    if (this.error) {
      if (!errorSlot || !errorSlot.hasAttribute('data-auto')) {
        // Remove auto-generated one if exists
        const autoError = this.querySelector('[slot="error"][data-auto]');
        if (autoError) autoError.remove();
        
        // Create new auto-generated error
        errorSlot = document.createElement('div');
        errorSlot.setAttribute('slot', 'error');
        errorSlot.setAttribute('data-auto', '');
        errorSlot.id = `${input.id}-error`;
        this.appendChild(errorSlot);
      }
      errorSlot.textContent = this.error;
      errorSlot.id = `${input.id}-error`;
    } else {
      // Remove auto-generated error
      const autoError = this.querySelector('[slot="error"][data-auto]');
      if (autoError) autoError.remove();
    }

    // Handle help text
    let helpSlot = this.querySelector('[slot="help"]');
    if (this.help && !this.error) {
      if (!helpSlot || !helpSlot.hasAttribute('data-auto')) {
        // Remove auto-generated one if exists
        const autoHelp = this.querySelector('[slot="help"][data-auto]');
        if (autoHelp) autoHelp.remove();
        
        // Create new auto-generated help
        helpSlot = document.createElement('div');
        helpSlot.setAttribute('slot', 'help');
        helpSlot.setAttribute('data-auto', '');
        helpSlot.id = `${input.id}-help`;
        this.appendChild(helpSlot);
      }
      helpSlot.textContent = this.help;
      helpSlot.id = `${input.id}-help`;
    } else {
      // Remove auto-generated help
      const autoHelp = this.querySelector('[slot="help"][data-auto]');
      if (autoHelp) autoHelp.remove();
    }
  }

  /**
   * Connect ARIA attributes to the slotted input
   * Now uses standard aria-describedby since error/help are in light DOM
   * @private
   */
  _connectAria() {
    const input = this.querySelector('input');
    if (!input) return;
    
    // Ensure input has ID for ARIA references
    if (!input.id) {
      input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Only set aria-label if using label property (not slot) and input doesn't have aria-label
    const hasLabelSlot = this.querySelector('[slot="label"]');
    if (this.label && !hasLabelSlot && !input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', this.label);
    }
    
    // Get error/help elements from light DOM (slotted)
    const errorEl = this.querySelector('[slot="error"]');
    const helpEl = this.querySelector('[slot="help"]');
    
    // Ensure error/help elements have IDs (even if user-provided)
    if (errorEl && !errorEl.id) {
      errorEl.id = `${input.id}-error`;
    }
    if (helpEl && !helpEl.id) {
      helpEl.id = `${input.id}-help`;
    }
    
    // Set aria-invalid
    if (errorEl) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
    
    // Build aria-describedby using standard attribute (works in all browsers!)
    const describedBy = [];
    const existingDescribedBy = input.getAttribute('aria-describedby');
    
    // Preserve external references (not our auto-generated ones)
    if (existingDescribedBy) {
      const externalIds = existingDescribedBy.split(' ').filter(id => 
        !id.includes(input.id + '-')
      );
      describedBy.push(...externalIds);
    }
    
    // Add our error/help IDs (in light DOM, so this works!)
    if (errorEl && errorEl.id) {
      describedBy.push(errorEl.id);
    }
    if (helpEl && helpEl.id && !errorEl) {
      describedBy.push(helpEl.id);
    }
    
    if (describedBy.length) {
      input.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      input.removeAttribute('aria-describedby');
    }
  }

  /**
   * Get the input ID (used during render)
   * @private
   */
  _getInputId() {
    const input = this.querySelector('input');
    return input?.id || '';
  }

  render() {
    const hasLabelSlot = !!this.querySelector('[slot="label"]');
    
    return html`
      <div class="m-input">
        ${!hasLabelSlot && this.label ? html`
          <div 
            class="m-input__label ${this.required ? 'm-input__label--required' : ''}" 
            part="label"
          >
            ${this.label}
          </div>
        ` : ''}
        
        <!-- Named slot for custom label -->
        <slot name="label"></slot>
        
        <!-- Default slot for input -->
        <div class="m-input__wrapper" part="wrapper">
          <slot></slot>
        </div>
        
        <!-- Error/help slots (elements created in light DOM for ARIA) -->
        <div class="m-input__messages" part="messages">
          <slot name="error"></slot>
          <slot name="help"></slot>
        </div>
      </div>
    `;
  }
}

/**
 * Register the MInput component
 * @param {string} [tagName='m-input'] - The tag name to register the component as
 * @returns {string} The registered tag name
 */
export function register(tagName = MInput.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MInput);
  }
  return tagName;
}
