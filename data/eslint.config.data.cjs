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
    // make exception for UPGRADE_TRACKS data object
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
    // add rules for ICON_LAYOUTS data object
    'files': ['data/icon_layouts_data.js'],
    'rules': {

      // must be flat list of icons, each is a list of anim frames
      'idle/max-object-depth': ['error', { maxDepth: 2 }],

      // restrict ICON_LAYOUTS data object keys based on depth
      'idle/valid-key': ['error', [
        {
          // icon name must be lowerCamelCase
          depth: 0,
          description: 'lower camel case like `myIcon`',
          patterns: [
            '^[a-z][a-zA-Z0-9]*$', // lowerCamelCase
          ],
        },
        {
          // must not have named keys in pixel data
          depth: 1,
          description: 'arrays of pixel layout data',
          patterns: [], // no acceptable patterns
        },
      ]],
    },
  },

  {
    // add rules for sound effects
    'files': [
      'data/sound_effects_data.js',
      'data/gui-sounds/**/*.js',
    ],
    'rules': {

      // data objects must be flat lists of sound effects
      'idle/max-object-depth': ['error', {
        maxDepth: 2, // "scale" can use depth 2 for array of freqs
      }],

      // restrict data object keys based on depth
      'idle/valid-key': ['error', [
        {
          // sound effect name
          depth: 0,
          description: 'lower camel case like `mySound` or `_autoSound`',
          patterns: [
            '^[a-z][a-zA-Z0-9]*$', // lowerCamelCase
            '^_[a-z][a-zA-Z0-9]*$', // _lowerCamelCase
          ],
        },
        {
          // sound property (or trigger condition for some gui sounds)
          depth: 1,
          description: 'sound property like `volume`',
          patterns: [
            '^(from|to)$', // for some gui-sounds triggered by layout parameters
            '^(minDelay)$', // used to ignore rapid play() calls
            '^(volume|duration|env)$', // volume over duration shape
            '^(wave)$', // tone type "sh","sine","square","sawtooth","triangle",
            '^(freq|startFreq|endFreq|scale)$', // single pitch or bend or sequence
          ],
        },
      ]],
    },
  },

  {
    // add rules for SOUND_ENVELOPES data object
    'files': ['data/sound_env_data.js'],
    'rules': {

      // SOUND_ENVELOPES must be flat lists of sound effects
      'idle/max-object-depth': ['error', { maxDepth: 2 }],

      // restrict SOUND_ENVELOPES keys based on depth
      'idle/valid-key': ['error', [
        {
          // sound envelope name
          depth: 0,
          description: 'lower camel case like `myEnvelope`',
          patterns: [
            '^[a-z][a-zA-Z0-9]*$', // lowerCamelCase
          ],
        },
        {
          // array of rulesets must not have named keys
          depth: 1,
          description: 'array of sound env css rulesets',
          patterns: [], // no acceptable patterns
        },
        {
          // css rule name
          depth: 2,
          description: 'sound env rule like `volume`',
          patterns: [
            '^(volume|start|end)$', // css relative to base volume/duration rectangle
            '^(repeat)$', // loop back to first ruleset
          ],
        },
      ]],
    },
  },

  {
    // add rules for gui layouts
    'files': ['data/gui-layouts/**/*.js'],
    'rules': {

      // enforce rule specific to gui-layouts
      'idle/valid-layout-rect': ['error'],

      // layouts must be flat lists of rulesets
      'idle/max-object-depth': ['error', { maxDepth: 1 }],

      // restrict keys based on depth in layout objects
      'idle/valid-key': ['error', [
        {
          // ruleset key must be lowerCamelCase, may start with underscore, may end with @anything
          depth: 0,
          description: 'lower camel case like `myRectangle` or `_helper`',
          patterns: [
            '^@.+$', // @anything by itself indicating extra layer pointing to layout object
            '^[a-z][a-zA-Z0-9]*(@.*)?$', // lowerCamelCase (+ optional @anything)
            '^_[a-z][a-zA-Z0-9]*(@.*)?$', // _lowerCamelCase (+ optional @anything)
          ],
        },
        {
          // rule key must be css layout property, may end with @anything
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

  {
    // add rules for gui animations
    'files': ['data/gui-anims/**/*.js'],
    'rules': {

      // data objects must be flat lists of keyframes
      'idle/max-object-depth': ['error', { maxDepth: 2 }],

      // restrict keys based on depth in data objects
      'idle/valid-key': ['error', [
        {
          // gui-anims data objects must be arrays of keyframes
          depth: 0,
          description: 'array of gui-anim keyframes',
          patterns: [], // no acceptable patterns
        },
        {
          // key in keyframe must be 't' or param defined with '@' in layout data
          depth: 1,
          description: 'keyframe property like `t` or `myLayoutParam`',
          patterns: [
            '^[a-z][a-zA-Z0-9]*$', // lowerCamelCase
          ],
        },
      ]],
    },
  },
];
