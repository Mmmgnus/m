import { register as registerButton } from './button/m-button.js';
import { register as registerInput } from './input/m-input.js';

// Auto-register all components with default names
registerButton();
registerInput();

// Export for convenience
export { MButton } from './button/m-button.js';
export { MInput } from './input/m-input.js';
