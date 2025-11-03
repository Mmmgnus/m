import { examplesPlugin } from '@frdh/m-tools/cem-plugins/examples-plugin';

export default {
  litelement: true,
  globs: ['src/**/*.js'],
  outdir: '.',
  exclude: ['src/**/*.test.js', 'src/**/*.spec.js'],
  plugins: [
    examplesPlugin()
  ]
};
