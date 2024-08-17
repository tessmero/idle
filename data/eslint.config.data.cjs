/**
 * @file eslint.config.data.cjs
 *
 * Additional restrictions for data files
 */
module.exports = [
  {
    // add rules for all data files
    'files': ['data/**/*.js'],
    'rules': {

      // disallow control structures like 'if'
      'idle/no-control-structure': 'error',

      // disallow 'var', 'let', and 'const'
      'idle/no-var-let-const': 'warn',

      // data object names must be UPPER_SNAKE_CASE, may start with underscore
      'idle/valid-var-name': ['error', {
        description: 'upper snake case like `MY_DATA_OBJECT` or `_HELPER`',
        patterns: [
          '^[A-Z][A-Z0-9_]*$', // UPPER_SNAKE_CASE
          '^_[A-Z][A-Z0-9_]*$', // _UPPER_SNAKE_CASE
        ],
      }],

      // default limit for nesting objects and arrays
      'idle/max-object-depth': ['error', { maxDepth: 2 }],
    },
  },
  {
    // make exception for upgrade tracks
    'files': ['data/upgrade_tracks_data.js'],
    'rules': {
      'idle/no-control-structure': ['error', {

        // allow upgrade tracks to use arrow functions
        // to setup before/after mini screen displays
        allow: ['ArrowFunctionExpression'],
      }],
    },
  },
  {
    // add rules for gui animations
    'files': ['data/gui-anims/**/*.js'],
    'rules': {

      // animations must be flat lists of keyframes
      'idle/max-object-depth': ['error', { maxDepth: 1 }],
    },
  },

  {
    // add rules for gui layouts
    'files': ['data/gui-layouts/**/*.js'],
    'rules': {

      // layouts must be flat lists of rulesets
      'idle/max-object-depth': ['error', { maxDepth: 1 }],

      // restrict keys based on depth in layout objects
      'idle/valid-key': ['error', [
        {
          // ruleset key must be lowerCamelCase, may start with underscore, may end with @something
          depth: 0,
          description: 'lower camel case like `myRectangle` or `_helper`',
          patterns: [
            '^@.+$', // @param by itself indicating extra layer pointing to layout object
            '^[a-z][a-zA-Z0-9]*(@.*)?$', // lowerCamelCase
            '^_[a-z][a-zA-Z0-9]*(@.*)?$', // _lowerCamelCase
          ],
        },
        {
          // rule key must be css layout property, may end with @something
          depth: 1,
          description: 'css layout property like `left`',
          patterns: [
            '^(top|left|bottom|right)(@.*)?$',
            '^(width|height|margin)(@.*)?$',
            '^(max-width|max-height)(@.*)?$',
            '^(parent|repeat)(@.*)?$',
          ],
        },
      ]],

      // disable typical naming convention check
      'camelcase': [0],

      // rule keys should not have quotes
      // unless they are necessary like for 'max-width'
      'quote-props': ['warn', 'as-needed'],
    },
  },
];
