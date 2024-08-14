/**
 * @file valid-var-name.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

// data/eslint.config.data.cjs
const testOptions = {
  description: 'upper snake case like `MY_LAYOUT_OBJECT` or `_HELPER`',
  patterns: [
    '^[A-Z][A-Z0-9_]*$', // UPPER_SNAKE_CASE
    '^_[A-Z][A-Z0-9_]*$', // _UPPER_SNAKE_CASE
  ],
};

ruleTester.run(
  'valid-var-name',
  require('../rules/valid-var-name.cjs'),

  {
    valid: [{
      options: [testOptions],
      code: `
        MY_NAME = {}
      `,
    },
    ],

    invalid: [
      {
        options: [testOptions],
        code: `
          myName = {}
        `,
        errors: 1,
      },
    ],
  },
);
