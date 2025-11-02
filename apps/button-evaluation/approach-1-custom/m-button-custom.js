import { LitElement, html, css } from 'lit';
import { nothing } from 'lit';

/**
 * A custom button component built entirely from scratch.
 * 
 * This implementation does not use a native button element and manually implements
 * all button behaviors including keyboard handling, focus management, ARIA attributes,
 * and form integration.
 * 
 * **Known Limitations:**
 * - Shadow DOM creates accessibility barriers:
 *   - Screen readers announce host as "Group" before reaching the button
 *   - aria-describedby and aria-labelledby don't work across shadow boundary
 * - These are fundamental limitations of shadow DOM for form elements
 * 
 * @element m-button-custom
 * @fires click - Fires when the button is activated via click, Space, or Enter
 * @slot - Button content (text, icons, etc.)
 * 
 * @example
 * <m-button-custom type="submit">Submit Form</m-button-custom>
 * 
 * @example
 * <m-button-custom type="button" disabled>Disabled Button</m-button-custom>
 */
export class MButtonCustom extends LitElement {
  static defaultTagName = 'm-button-custom';
  static formAssociated = true;

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
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    /* Focus indicator on host when inner button has focus */
    :host(:focus-within) {
      outline: 2px solid var(--m-color-primary, #0066cc);
      outline-offset: 2px;
      border-radius: var(--m-border-radius, 0.25rem);
    }

    :host {
      /* Design tokens */
      --button-bg: var(--m-color-primary, #0066cc);
      --button-bg-hover: var(--m-color-primary-hover, #0052a3);
      --button-text: var(--m-color-text, white);
      --button-font-family: var(--m-font-family, system-ui, -apple-system, sans-serif);
      --button-font-size: var(--m-font-size-base, 1rem);
      --button-padding-block: var(--m-spacing-sm, 0.5rem);
      --button-padding-inline: var(--m-spacing-md, 1rem);
      --button-border-radius: var(--m-border-radius, 0.25rem);
      --button-transition: var(--m-transition-duration, 0.2s);
    }

    .button {
      /* Layout */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      
      /* Sizing */
      padding-block: var(--button-padding-block);
      padding-inline: var(--button-padding-inline);
      min-width: 4rem;
      
      /* Typography */
      font-family: var(--button-font-family);
      font-size: var(--button-font-size);
      font-weight: 500;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      
      /* Appearance */
      background: var(--button-bg);
      color: var(--button-text);
      border: none;
      border-radius: var(--button-border-radius);
      cursor: pointer;
      user-select: none;
      
      /* Transition */
      transition: background-color var(--button-transition) ease-in-out,
                  transform var(--button-transition) ease-in-out,
                  box-shadow var(--button-transition) ease-in-out;
    }

    .button:hover:not(.disabled) {
      background: var(--button-bg-hover);
    }

    .button:active:not(.disabled) {
      transform: translateY(1px);
    }

    .button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `;

  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.type = 'submit';
    this.disabled = false;
    this.ariaLabel = '';
    this.ariaLabelledby = '';
    this.ariaDescribedby = '';
  }

  /**
   * Lifecycle: Component connected to DOM
   * Apply Spectrum's technique: set role and tabindex on HOST element
   * PLUS: Set all ARIA attributes on HOST to prevent "Group" announcement
   */
  connectedCallback() {
    super.connectedCallback();
    
    // Spectrum technique: Make HOST the focusable button element
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    
    // Set tabindex on host (will be updated if disabled changes)
    this._updateHostTabindex();
    
    // Initial ARIA attributes on host
    this._updateHostAria();
  }

  /**
   * Updates tabindex on host based on disabled state
   * @private
   */
  _updateHostTabindex() {
    this.setAttribute('tabindex', this.disabled ? '-1' : '0');
  }

  /**
   * Updates ARIA attributes on HOST element
   * This prevents the "Group" → "Button" double announcement
   * @private
   */
  _updateHostAria() {
    // aria-label
    if (this.ariaLabel) {
      this.setAttribute('aria-label', this.ariaLabel);
    } else {
      this.removeAttribute('aria-label');
    }
    
    // aria-labelledby (Note: may not work across shadow boundary)
    if (this.ariaLabelledby) {
      this.setAttribute('aria-labelledby', this.ariaLabelledby);
    } else {
      this.removeAttribute('aria-labelledby');
    }
    
    // aria-describedby (Note: may not work across shadow boundary)
    if (this.ariaDescribedby) {
      this.setAttribute('aria-describedby', this.ariaDescribedby);
    } else {
      this.removeAttribute('aria-describedby');
    }
    
    // aria-disabled (use instead of disabled attribute on custom elements)
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }

  /**
   * Lifecycle: Properties updated
   * Update HOST attributes when properties change
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Update tabindex when disabled changes
    if (changedProperties.has('disabled')) {
      this._updateHostTabindex();
    }
    
    // Update ARIA attributes when any ARIA property changes
    if (changedProperties.has('disabled') ||
        changedProperties.has('ariaLabel') ||
        changedProperties.has('ariaLabelledby') ||
        changedProperties.has('ariaDescribedby')) {
      this._updateHostAria();
    }
  }

  /**
   * Gets the form this button is associated with
   * @returns {HTMLFormElement|null}
   */
  get form() {
    return this.#internals.form;
  }

  /**
   * Handles keyboard events for button activation
   * Spectrum technique: Handle keyboard on HOST element
   * @param {KeyboardEvent} e - The keyboard event
   * @private
   */
  _handleKeyDown(e) {
    if (this.disabled) {
      return;
    }

    // Handle Space key - activate and prevent page scroll
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault(); // Prevent page scroll
      this._activate(e);
      return;
    }

    // Handle Enter key - activate
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      this._activate(e);
      return;
    }
  }

  /**
   * Handles click events
   * @param {MouseEvent} e - The click event
   * @private
   */
  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this._activate(e);
  }

  /**
   * Activates the button - handles form submission/reset based on type
   * @param {Event} originalEvent - The original event that triggered activation
   * @private
   */
  _activate(originalEvent) {
    if (this.disabled) {
      return;
    }

    // Dispatch a synthetic click event that bubbles and is composed
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: originalEvent.detail || 1,
      view: window,
    });

    const dispatched = this.dispatchEvent(clickEvent);
    
    // If event was prevented, don't continue with form actions
    if (!dispatched) {
      return;
    }

    // Handle form interactions based on type
    this._handleFormInteraction();
  }

  /**
   * Handles form submission/reset based on button type
   * Combines ElementInternals with Spectrum's createElement trick for better compatibility
   * @private
   */
  _handleFormInteraction() {
    // Use ElementInternals form property for proper association
    const form = this.#internals.form || this.closest('form');
    
    if (!form || this.type === 'button') {
      return; // No form action for type="button"
    }

    // Spectrum technique: Use temporary native button for reliable form submission
    // This ensures form validation, implicit submission, and FormData work correctly
    const tempButton = document.createElement('button');
    tempButton.type = this.type;
    tempButton.style.display = 'none'; // Hide it visually
    
    // Insert after this element
    this.insertAdjacentElement('afterend', tempButton);
    
    // Click the temporary button to trigger native form behavior
    tempButton.click();
    
    // Clean up immediately
    tempButton.remove();
  }

  /**
   * Renders the button
   * Note: Keyboard handlers are on HOST element (via connectedCallback), not on internal div
   * @returns {import('lit').TemplateResult}
   */
  render() {
    const classes = ['button'];
    if (this.disabled) {
      classes.push('disabled');
    }

    // Spectrum technique: Simplified internal structure since HOST handles interaction
    return html`
      <div
        class="${classes.join(' ')}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </div>
    `;
  }

  /**
   * First render complete - set up host-level event handlers
   * Spectrum technique: Handle events on HOST, not internal elements
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    
    // Add keyboard handlers to HOST element
    this.addEventListener('keydown', this._handleKeyDown.bind(this));
    this.addEventListener('click', this._handleClick.bind(this));
  }
}

/**
 * Register the component with the custom elements registry
 * @param {string} [tagName='m-button-custom'] - The tag name to register
 * @returns {string} The registered tag name
 */
export function register(tagName = MButtonCustom.defaultTagName) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, MButtonCustom);
  }
  return tagName;
}
