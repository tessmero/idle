/**
 * @file no-control-structs.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'no-control-structure',
  require('../rules/no-control-structure.cjs'),

  // disallow keywords like 'if'
  // disallow ternary operator (inline if)
  // disallow function expressions
  {
    valid: [
      {

        // layout data
        code: `
          MY_LAYOUT = {
            r0: {
              margin: 0.1,
              'max-width': 1.2,
              left: 'auto',
            },

            ..._COMMON,
          };
        `,
      },
      {
        // upgrade tracks with allowed arrow func
        code: `
          UPGRADE_TRACKS = {
            'nparticles': {
              beforeCard: ((screen) => {
                screen.sim.rainGroup.n = 10;
              }),
            }
          }
        `,
        options: [{ allow: ['ArrowFunctionExpression'] }],
      },
    ],

    invalid: [
      {
        code: `
          if( true ){}
        `,
        errors: 1,
      },
      {

        // layout with inline if-statement
        code: `
          MY_LAYOUT = {
            r0: {
              margin: 0.1,
              'max-width': true ? 1.2 : 1.0,
              left: 'auto',
            },

            ..._COMMON,
          };
        `,
        errors: 1,
      },

      {
        // upgrade tracks with inline if
        code: `
          UPGRADE_TRACKS = {
            'nparticles': {
              beforeCard: ((screen) => {
                screen.sim.rainGroup.n = true ? 20 : 10;
              }),
            }
          }
        `,
        options: [{ allow: ['ArrowFunctionExpression'] }],
        errors: 1,
      },
    ],
  },
);
