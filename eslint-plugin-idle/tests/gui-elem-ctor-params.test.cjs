
const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "gui-elem-ctor-params", 
  require("../gui-elem-ctor-params.cjs"),

  //Require constructors to have exactly two parameters with the first not having a default value
  { 
    valid: [{
      code: `
        class MyClass {
          constructor( r, p ){}
        }
      `,
    },{
      code: `
        class MyClass {
          constructor( r, p={} ){}
        }
      `,
    }],

    invalid: [{
      code: `
        class MyClass {
          constructor( r ){}
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass {
          constructor( ...p ){}
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass {
          constructor( r={}, p={} ){}
        }
      `,
      errors: 1,
    }],
  }
);