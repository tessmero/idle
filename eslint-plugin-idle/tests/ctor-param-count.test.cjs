
const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "ctor-param-count", 
  require("../ctor-param-count.cjs"),

  //Require constructors to have exactly {count=1} parameters with the first not having a default value
  { 
    valid: [{

      // default count is 1
      code: `
        class MyClass {
          constructor( r ){}
        }
      `,
    },{
      code: `
        class MyClass {
          constructor( r ){}
        }
      `,
      options: [{ count: 1 }],
    },{
      code: `
        class MyClass {
          constructor( r, p ){}
        }
      `,
      options: [{ count: 2 }],
    },{
      // 2 params and last has default
      code: `
        class MyClass {
          constructor( r, p={} ){}
        }
      `,
      options: [{ count: 2 }],
    }],

    invalid: [{

      // default count is 1
      code: `
        class MyClass {
          constructor( r,p ){}
        }
      `,
      errors:1
    },{
      code: `
        class MyClass {
          constructor( r ){}
        }
      `,
      options: [{ count: 2 }],
      errors: 1,
    },{
      code: `
        class MyClass {
          constructor( ...p ){}
        }
      `,
      options: [{ count: 2 }],
      errors: 1,
    },{

      // first param of two has a default value
      code: `
        class MyClass {
          constructor( r={}, p={} ){}
        }
      `,
      options: [{ count: 2 }],
      errors: 1,
    }],
  }
);