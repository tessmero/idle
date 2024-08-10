
const {RuleTester} = require("eslint");
const ruleTester = new RuleTester();

ruleTester.run(
  "no-new-singleton", 
  require("../no-new-singleton.cjs"),

  //Disallow using "new" keyword with restricted classes
  { 
    valid: [{
      options: [{ restrictedClasses: ['MySingletonClass'] }],
      code: `
        var test = MySingletonClass()
      `,
    }],

    invalid: [{
      options: [{ restrictedClasses: ['MySingletonClass'] }],
      code: `
        var test = new MySingletonClass()
      `,
      errors: 1,
    }],
  }
);