
const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "ctor-params-destructure", 
  require("../ctor-params-destructure.cjs"),

  // constructors must use destructuring if they access params
  { 
    valid: [{

      // private variable assignment pattern
      code: `
        class MyClass extends SuperClass{
          #prop
          constructor(rect, params = {}) {
            super(rect, params);
            const {prop} = params;
            this.#prop = prop;
          }
        }`,
    },{
      code: `
        class MyClass {
          constructor( params={} ){}
        }
      `,
    },{
      code: `
        class MyClass {
          constructor( params={} ){
            const {prop} = params
          }
        }
      `,
    },{
      code: `
        class MyClass extends SuperClass{
          constructor( params={} ){
            super(params)
          }
        }
      `,
    },{
      code: `
        class MyClass extends SuperClass{
          constructor( params={} ){
            super(params)
            const {prop} = params
          }
        }
      `,
    }],


    invalid: [

    {

      // incorrect private variable pattern
      code:`
        class MyClass extends SuperClass{
          #prop
          constructor(rect, params = {}) {
            super(rect, params);
            this.#prop = params.prop;
          }
        }`,
      errors: 1,
    },
    {

      // destructured, but then accessed incorrectly
      code:`
        class MyClass extends SuperClass{
          #prop
          constructor(rect, params = {}) {
            super(rect, params);
            const {prop} = params;
            this.#prop = params.prop;
          }
        }`,
      errors: 1,
    },
    {
      code: `
        class MyClass {
          constructor( params={} ){
            if( params.prop || (true && params.prop) ){}
          }
        }
      `,
      errors: 2,
    },
    {
      code: `
        class MyClass {
          constructor( params={} ){
            const prop = params.prop
          }
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass {
          constructor( params={} ){
            const myParams = params;
          }
        }
      `,
      errors: 1,
    },{
      code: `
        class MyClass extends SuperClass{
          constructor( params={} ){
            super(params)
            const prop = params.prop
          }
        }
      `,
      errors: 1,
    }],
  }
);