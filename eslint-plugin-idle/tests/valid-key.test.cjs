/**
 * @file valid-key.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

// like data/eslint.config.data.cjs
const testOptions = [
  {
    // ruleset key must be lowerCamelCase, may start with underscore
    depth: 0,
    description: 'lower camel case like `myRectangle` or `_helper`',
    patterns: [
      '^[a-z][a-zA-Z0-9]*(@.*)?$', // lowerCamelCase
      '^_[a-z][a-zA-Z0-9]*(@.*)?$', // _lowerCamelCase
    ],
  },
  {
    // rule key must be css layout property
    depth: 1,
    description: 'css layout property like `left`',
    patterns: [
      '^(top|left|bottom|right)(@.*)?$',
      '^(width|height|margin)(@.*)?$',
      '^(max-width|max-height)(@.*)?$',
      '^(parent|repeat)(@.*)?$',
    ],
  },
];

ruleTester.run(
  'valid-key',
  require('../rules/valid-key.cjs'),

  {
    valid: [{
      options: [testOptions],
      code: `
        HUD_GUI_LAYOUT = {

          // helper referenced as parent below
          _sr: {
            margin: 0.02,
          },

          // button for upgrade menu
          topLeftBtn: {
            parent: '_sr',
            width: 0.1,
            height: 0.1,
          },
        }
      `,
    },
    ],

    invalid: [
      {
        options: [testOptions],
        code: `
          HUD_GUI_LAYOUT = {

            // helper referenced as parent below
            _INCORRECT: {
              margin: 0.02,
            },

            // button for upgrade menu
            topLeftBtn: {
              incorrect: '_sr',
              width: 0.1,
              height: 0.1,
            },
          }
        `,
        errors: 2,
      },
    ],
  },
);
