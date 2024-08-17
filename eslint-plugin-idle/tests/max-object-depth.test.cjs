/**
 * @file max-object-depth test
 *
 * Limit the depth of nested object and array expressions
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'max-object-depth',
  require('../rules/max-object-depth.cjs'),

  {
    valid: [
      {
        // flat object
        code: `
          var a = {}
          var b = {param:value}
        `,
        options: [{ maxDepth: 0 }],
      },
      {
        // flat list
        code: `
          var a = []
          var b = [c,d,e,f,g]
        `,
        options: [{ maxDepth: 0 }],
      },
      {
        // nested once
        code: `
          var a = {param:{param:value}}
          var b = [c,d,[e,f,g]]
        `,
        options: [{ maxDepth: 1 }],
      },
      {
        // nested once
        code: `
          var a = {param:[e,f,g]}
          var b = [c,d,{param:value}]
        `,
        options: [{ maxDepth: 1 }],
      },
    ],

    invalid: [
      {
        // nested once
        code: `
          var a = {param:{param:value}}
          var b = [[myElem]]
          var c = [d,e,{param:value}]
          var f = {param0:0, param1:[myElem]}
        `,
        options: [{ maxDepth: 0 }],
        errors: 4,
      },
      {
        // mested twice
        code: `
          var a = {param:{param:{param:value}}}
        `,
        options: [{ maxDepth: 1 }],
        errors: 1,
      },
      {
        code: `
          var a = [myElem,[myElem]]
          var b = [[myElem]]
        `,
        options: [{ maxDepth: 0 }],
        errors: 2,
      },
    ],
  },
);
