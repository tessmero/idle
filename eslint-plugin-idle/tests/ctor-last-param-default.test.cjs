
const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "ctor-last-param-default", 
  require("../ctor-last-param-default.cjs"),

  //constructors must have last param 'params={}'
  { 
    valid: [{
      code: `
        class MyClass {
          constructor( params={} ){}
        }
      `,
    },{
      code: `
        class MyClass {
          constructor( a,b,c, params={} ){}
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
          constructor( params ){}
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass {
          constructor( param={} ){}
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