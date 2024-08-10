

const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "ctor-params-super-args", 
  require("../ctor-params-super-args.cjs"),

//Constructor parameters must be passed to super in the same order, 
//except the last super arg may be replaced with ObjectExpression in curly brackets`,
//
  { 
    valid: [{
      code: `
        class MyClass {
          constructor( r, p ){}
        }
      `,
    },{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super( r, p )
          }
        }
      `,
    },{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super( r, {} )
          }
        }
      `,
    },
    ],

    invalid: [{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super()
          }
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super(r,q)
          }
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super( r )
          }
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass extends SuperClass {
          constructor( r, p ){
            super( p, r )
          }
        }
      `,
      errors: 1,
    },
    ],
  }
);