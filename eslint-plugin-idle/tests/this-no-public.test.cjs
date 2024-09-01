/**
 * @file this-no-public.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'this-no-public',
  require('../rules/this-no-public.cjs'),

  {
    valid: [
      {
        code: `
          class MyClass {
            #myVar
            constructor(){
              this.#myVar
              this._myFunc()
            }
          }
        `,
      },
    ],

    invalid: [
      {
        // accessing non-private variable
        code: `
          class MyClass {
            constructor(){
              this.myVar
            }
          }
        `,
        errors: 1,
      },
      {
        // accessing non-protected method
        code: `
          class MyClass {
            constructor(){
              this.myFunc()
            }
          }
        `,
        errors: 1,
      },
    ],
  },
);
