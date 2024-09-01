/**
 * @file static-class.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

const options = [{ restrictedClasses: ['MyClass'] }];

ruleTester.run(
  'static-class',
  require('../rules/static-class.cjs'),

  {
    valid: [
      {
        options,
        code: `
          MyClass.myFunc()
        `,
      },
    ],

    invalid: [
      {
        // calling private static helper
        options,
        code: `
          MyClass._myFunc()
        `,
        errors: 1,
      },
      {
        // instantiating static class
        options,
        code: `
          new MyClass()
        `,
        errors: 1,
      },
      {
        // instantiating static class
        options,
        code: `
          new MyClass()._myFunc()
        `,
        errors: 1,
      },
      {
        // used like singleton implicit constructor
        options,
        code: `
          MyClass()._myFunc()
        `,
        errors: 1,
      },
    ],
  },
);
