/**
 * @file super-params-spread.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'super-params-spread',
  require('../rules/super-params-spread.cjs'),

  // ObjectExpressions in super arguments must include '...params'
  {
    valid: [{
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( params )
          }
        }
      `,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {...params} )
          }
        }
      `,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {prop:null, ...params} )
          }
        }
      `,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {...params, prop:null} )
          }
        }
      `,
    },
    ],

    invalid: [{
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {} )
          }
        }
      `,
      errors: 1,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {prop:null,params})
          }
        }
      `,
      errors: 1,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {params})
          }
        }
      `,
      errors: 1,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {prop:null} )
          }
        }
      `,
      errors: 1,
    }, {
      code: `
        class MyClass extends SuperClass {
          constructor( params ){
            super( {prop:{...params}} )
          }
        }
      `,
      errors: 1,
    },
    ],
  },
);
