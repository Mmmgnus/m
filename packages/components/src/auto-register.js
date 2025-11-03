import { register as registerButton } from './button/m-button.js';
import { register as registerButtonLabel } from './button-label/m-button-label.js';
import { register as registerCheckbox } from './checkbox/m-checkbox.js';
import { register as registerInput } from './input/m-input.js';
import { register as registerRadio } from './radio/m-radio.js';
import { register as registerRadioGroup } from './radio/m-radio-group.js';

// Auto-register all components with default names
registerButton();
registerButtonLabel();
registerCheckbox();
registerInput();
registerRadio();
registerRadioGroup();

// Export for convenience
export { MButton } from './button/m-button.js';
export { MButtonLabel } from './button-label/m-button-label.js';
export { MCheckbox } from './checkbox/m-checkbox.js';
export { MInput } from './input/m-input.js';
export { MRadio } from './radio/m-radio.js';
export { MRadioGroup } from './radio/m-radio-group.js';
