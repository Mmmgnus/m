import { register as registerButton } from './button/m-button.js';
import { register as registerButtonLabel } from './button-label/m-button-label.js';
import { register as registerInput } from './input/m-input.js';

// Auto-register all components with default names
registerButton();
registerButtonLabel();
registerInput();

// Export for convenience
export { MButton } from './button/m-button.js';
export { MButtonLabel } from './button-label/m-button-label.js';
export { MInput } from './input/m-input.js';
