/**
 * @file valid-layout-rect.test.cjs
 * test rules specifically for data/gui-layouts
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'valid-layout-rect',
  require('../rules/valid-layout-rect.cjs'),

  {
    valid: [
      {

        // debug_tab_layout.js
        code: `
          DEBUG_SCALAR_LAYOUT = {
            ...DEBUG_ROW_LAYOUT,

            _btns: {
              width: 0.1,
            },

            buttons: {
              parent: '_btns',
              width: 0.05,
              repeat: 'right',
            },
          }
        `,
      },
    ],
    invalid: [
      {

        // parent not first rule
        // parent not string in quotes
        code: `
          DEBUG_SCALAR_LAYOUT = {
            ...DEBUG_ROW_LAYOUT,

            _btns: {
              width: 0.1,
            },

            buttons: {
              width: 0.05,
              parent: DEBUG_ROW_LAYOUT,
              repeat: 'right',
            },
          }
        `,
        errors: 2,
      },
    ],
  },
);
