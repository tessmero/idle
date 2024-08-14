/**
 * @file no-var-let-const.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'no-var-let-const',
  require('../rules/no-var-let-const.cjs'),

  {
    valid: [
      {
        code: `
          MY_LAYOUT_OBJ = {};
        `,
      },
    ],

    invalid: [
      {
        code: `
          const MY_A = {};
          var MY_B = {};
          let MY_C = {};
        `,
        errors: 3,
      },
    ],
  },
);
