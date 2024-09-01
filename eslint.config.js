/**
 * @file eslint.config.js project-specific code standards
 */
import babelParser from '@babel/eslint-parser';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintPluginIdle from './eslint-plugin-idle/index.cjs';

// master list of files to apply base rules to
const filesToLint = {

  // 'import' allowed
  asModule: [
    'build/**/*.js',
    'eslint.config.js',
    'data/eslint.config.data.cjs',
    'eslint-plugin-idle/**/*.cjs',
  ],

  // no 'import'
  asScript: [
    'src/**/*.js',
    'data/**/*.js',
  ],
};

// additional rules for data folder
import dataConfigs from './data/eslint.config.data.cjs';

// rules from local plugin to apply to all source
const idleSrcConfigs = [
  {
    'files': ['src/**/*.js'],
    'rules': {

      // constructors must document
      // properties unpacked from any variable named 'params'
      'idle/ctor-params-jsdoc': 'warn',
    },
  },
];

// common rules for constructor 'params' object pattern
// to be enforced in different ways for some source folders
const ctorParamsRules = {

  // constructors must have last parameter 'params={}'
  'idle/ctor-last-param-default': 'error',

  // must pass parameters to super
  // but last argument may be ObjectExpression
  'idle/ctor-params-super-args': 'error',

  // ObjectExpression in super must include '...params'
  'idle/super-params-spread': 'error',

  // must use destructuring if they access 'params'
  'idle/ctor-params-destructure': 'error',

  // constructors can only have one param
  // (and only the last param may have a default value)
  'idle/ctor-param-count': ['error', { 'count': 1 }],
};

// additional rules for source/gui folder
const guiConfigs = [
  {
    // restrict gui Border constructors
    'files': ['src/gui/borders/**/*.js'],
    'rules': ctorParamsRules,

  }, {

    'files': ['src/gui/elements/**/*.js'],
    'rules': {

      // restrict gui element constructors
      ...ctorParamsRules,

      // constructors have two parameters, and the first (rectangle) has no default
      'idle/ctor-param-count': ['error', { 'count': 2 }],
    },
  },
];

// static parsers
// more rules to enforce encapsulated parsers
const prsClasses = [
  'SongParser', 'GuiLayoutParser', 'GuiAnimParser', 'GuiSoundParser',
];
const prsSource = ['src/parsers/**/*.js'];
const prsConfigs = [
  {
    'files': ['src/**/*.js'],
    'ignores': prsSource, // all source except parsers
    'rules': {

      // parser class names can only be used
      // to call a lowerCamelCase static functions
      'idle/static-class': ['error', { restrictedClasses: prsClasses }],
    },
  },

  {
    'files': prsSource, // only parsers' source
    'rules': {

      // parsers can only reference private variables when using "this"
      'idle/this-no-public': ['error'],
    },
  },
];

// singleton daemons
// overrides to enforce singleton "implicit constructor" style pattern
const sglClasses = [
  'StoryManager', 'ScreenManager',
  'EdgeManager', 'BorderManager',
  'MusicManager',
];
const sglSource = ['src/daemons/**/*.js'];
const sglConfigs = [
  {
    'rules': {

      // warn against using "new" keyword with singletons
      'idle/no-new-singleton': ['warn', { restrictedClasses: sglClasses }],

      // these PascalCase functions are allowed to called without new
      'new-cap': ['warn', { 'capIsNewExceptions': sglClasses }],
    },
  },

  {
    // singletons can use nonstandard method declaration
    'files': sglSource,
    'rules': { 'func-names': 'off' },
  },
];

// standard style config
// + list of types for jsdoc
// + restrict Float32Array
const baseRules = {
  'jsdoc/no-undefined-types': ['error', {
    'definedTypes': [
      'Vector',
      'GameScreen', 'GameState', 'GameStateManager', 'Macro',
      'Gui', 'GuiElement', 'Icon',
      'ParticleSim', 'Tool', 'Body', 'Edge',
    ],
  }],

  // Recommended
  'jsdoc/check-access': 1,

  // Recommended
  'jsdoc/check-alignment': 1,
  'jsdoc/check-examples': 0,
  'jsdoc/check-indentation': 0,
  'jsdoc/check-line-alignment': 0,

  // Recommended
  'jsdoc/check-param-names': 1,

  // Recommended
  'jsdoc/check-property-names': 1,
  'jsdoc/check-syntax': 0,

  // Recommended
  'jsdoc/check-tag-names': 1,

  // Recommended
  'jsdoc/check-types': 1,

  // Recommended
  'jsdoc/check-values': 1,

  // Recommended
  'jsdoc/empty-tags': 1,

  // Recommended
  'jsdoc/implements-on-classes': 1,
  'jsdoc/informative-docs': 0,
  'jsdoc/match-description': 0,

  // Recommended
  'jsdoc/multiline-blocks': 1,
  'jsdoc/no-bad-blocks': 0,
  'jsdoc/no-blank-block-descriptions': 0,
  'jsdoc/no-defaults': 0,
  'jsdoc/no-missing-syntax': 0,

  // Recommended
  'jsdoc/no-multi-asterisks': 1,
  'jsdoc/no-restricted-syntax': 0,
  'jsdoc/no-types': 0,

  'jsdoc/require-asterisk-prefix': 0,
  'jsdoc/require-description': 0,
  'jsdoc/require-description-complete-sentence': 0,
  'jsdoc/require-example': 0,
  'jsdoc/require-file-overview': 1,
  'jsdoc/require-hyphen-before-param-description': 0,
  'jsdoc/require-jsdoc': ['warn', {
    'require': {
      'FunctionDeclaration': false,
      'MethodDefinition': true,
      'ClassDeclaration': true,
      'ArrowFunctionExpression': false,
      'FunctionExpression': false,
    },
  }],

  // Recommended
  'jsdoc/require-param': 1,

  // 1, // Recommended
  'jsdoc/require-param-description': 0,

  // Recommended
  'jsdoc/require-param-name': 1,

  // Recommended
  'jsdoc/require-param-type': 1,

  // Recommended
  'jsdoc/require-property': 1,

  // 1, // Recommended
  'jsdoc/require-property-description': 0,

  // Recommended
  'jsdoc/require-property-name': 1,

  // Recommended
  'jsdoc/require-property-type': 1,

  // 1, // Recommended
  'jsdoc/require-returns': 0,

  // Recommended
  'jsdoc/require-returns-check': 1,

  // Recommended
  'jsdoc/require-returns-description': 1,

  // Recommended
  'jsdoc/require-returns-type': 1,
  'jsdoc/require-throws': 0,

  // Recommended
  'jsdoc/require-yields': 0,

  // Recommended
  'jsdoc/require-yields-check': 0,
  'jsdoc/sort-tags': 0,

  // Recommended
  'jsdoc/tag-lines': 1,

  // Recommended
  'jsdoc/valid-types': 1,

  /* Possible Errors */
  // disallow or enforce trailing commas (recommended)
  'comma-dangle': [1, 'always-multiline'],

  // disallow assignment in conditional expressions (recommended)
  'no-cond-assign': [1, 'except-parens'],

  // disallow use of console in the node environment (recommended)
  'no-console': 1,

  // disallow use of constant expressions in conditions (recommended)
  'no-constant-condition': 1,

  // disallow control characters in regular expressions (recommended)
  'no-control-regex': 1,

  // disallow use of debugger (recommended)
  'no-debugger': 1,

  // disallow duplicate arguments in functions (recommended)
  'no-dupe-args': 1,

  // disallow duplicate keys when creating object literals (recommended)
  'no-dupe-keys': 1,

  // disallow a duplicate case label. (recommended)
  'no-duplicate-case': 1,

  // disallow the use of empty character classes in regular expressions (recommended)
  'no-empty-character-class': 1,

  // disallow empty statements (recommended)
  'no-empty': 1,

  // disallow assigning to the exception in a catch block (recommended)
  'no-ex-assign': 1,

  // disallow double-negation boolean casts in a boolean context (recommended)
  'no-extra-boolean-cast': 1,

  // disallow unnecessary parentheses
  'no-extra-parens': 0,

  // disallow unnecessary semicolons (recommended) (fixable)
  'no-extra-semi': 1,

  // disallow overwriting functions written as function declarations (recommended)
  'no-func-assign': 1,

  // disallow function or variable declarations in nested blocks (recommended)
  'no-inner-declarations': [1, 'functions'],

  // disallow invalid regular expression strings in the RegExp constructor (recommended)
  'no-invalid-regexp': 1,

  // disallow irregular whitespace outside of strings and comments (recommended)
  'no-irregular-whitespace': 1,

  // disallow negation of the left operand of an in expression (recommended)
  'no-negated-in-lhs': 1,

  // disallow the use of object properties of the global object (Math and JSON) as functions (recommended)
  'no-obj-calls': 1,

  // disallow multiple spaces in a regular expression literal (recommended)
  'no-regex-spaces': 1,

  // disallow sparse arrays (recommended)
  'no-sparse-arrays': 1,

  // Avoid code that looks like two expressions but is actually one
  'no-unexpected-multiline': 1,

  // disallow unreachable statements after a return, throw, continue, or break statement (recommended)
  'no-unreachable': 1,

  // disallow comparisons with the value NaN (recommended)
  'use-isnan': 1,

  // "valid-jsdoc": 1, //Ensure JSDoc comments are valid
  // Ensure that the results of typeof are compared against a valid string (recommended)
  'valid-typeof': 1,

  /* Best Practices */
  'max-lines-per-function': ['warn', 100],

  // Enforces getter/setter pairs in objects
  'accessor-pairs': 0,

  // treat var statements as if they were block scoped
  'block-scoped-var': 1,

  // specify the maximum cyclomatic complexity allowed in a program
  'complexity': 0,

  // require return statements to either always or never specify values
  'consistent-return': 1,

  // specify curly brace conventions for all control statements
  'curly': [1, 'all'],

  // require default case in switch statements
  'default-case': 1,

  // enforces consistent newlines before or after dots
  'dot-location': [1, 'property'],

  // encourages use of dot notation whenever possible
  'dot-notation': [1, { 'allowKeywords': true, 'allowPattern': '' }],

  // require the use of === and !== (fixable)
  'eqeqeq': 1,

  // make sure for-in loops have an if statement
  'guard-for-in': 0,

  // disallow the use of alert, confirm, and prompt
  'no-alert': 1,

  // disallow use of arguments.caller or arguments.callee
  'no-caller': 1,

  // disallow lexical declarations in case clauses
  'no-case-declarations': 0,

  // disallow division operators explicitly at beginning of regular expression
  'no-div-regex': 1,

  // disallow else after a return in an if
  'no-else-return': 1,

  // disallow use of labels for anything other than loops and switches
  'no-labels': 1,

  // disallow use of empty destructuring patterns
  'no-empty-pattern': 1,

  // disallow comparisons to null without a type-checking operator
  'no-eq-null': 1,

  // disallow use of eval()
  'no-eval': 1,

  // disallow adding to native types
  'no-extend-native': 1,

  // disallow unnecessary function binding
  'no-extra-bind': 1,

  // disallow fallthrough of case statements (recommended)
  'no-fallthrough': 1,

  // disallow the use of leading or trailing decimal points in numeric literals
  'no-floating-decimal': 1,

  // disallow the type conversions with shorter notations
  'no-implicit-coercion': 1,

  // disallow use of eval()-like methods
  'no-implied-eval': 1,

  // disallow this keywords outside of classes or class-like objects
  'no-invalid-this': 0,

  // disallow usage of __iterator__ property
  'no-iterator': 1,

  // 'no-labels': 1, // disallow use of labeled statements
  // disallow unnecessary nested blocks
  'no-lone-blocks': 1,

  // disallow creation of functions within loops
  'no-loop-func': 1,

  // 'no-magic-numbers': [1, { 'ignore': [-1, 0, 1] }], // disallow the use of magic numbers
  // disallow use of multiple spaces (fixable)
  'no-multi-spaces': 1,

  // disallow use of multiline strings
  'no-multi-str': 1,

  // disallow reassignments of native objects
  'no-native-reassign': 1,

  // disallow use of new operator for Function object
  'no-new-func': 1,

  // disallows creating new instances of String,Number, and Boolean
  'no-new-wrappers': 1,

  // disallow use of the new operator when not part of an assignment or comparison
  'no-new': 1,

  // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
  'no-octal-escape': 1,

  // disallow use of octal literals (recommended)
  'no-octal': 1,

  // disallow reassignment of function parameters
  'no-param-reassign': [1, { 'props': false }],

  // disallow use of process.env
  'no-process-env': 0,

  // disallow usage of __proto__ property
  'no-proto': 1,

  // disallow declaring the same variable more than once (recommended)
  'no-redeclare': 1,

  // disallow use of assignment in return statement
  'no-return-assign': 1,

  // disallow use of javascript: urls.
  'no-script-url': 1,

  // disallow comparisons where both sides are exactly the same
  'no-self-compare': 1,

  // disallow use of the comma operator
  'no-sequences': 1,

  // restrict what can be thrown as an exception
  'no-throw-literal': 1,

  // disallow usage of expressions in statement position
  'no-unused-expressions': [1, { allowShortCircuit: true, allowTernary: true }],

  // disallow unnecessary .call() and .apply()
  'no-useless-call': 1,

  // disallow unnecessary concatenation of literals or template literals
  'no-useless-concat': 1,

  // disallow use of the void operator
  'no-void': 0,

  // disallow usage of configurable warning terms in comments e.g. TODO or FIXME
  'no-warning-comments': [1, { 'terms': ['todo', 'fixme'], 'location': 'start' }],

  // disallow use of the with statement
  'no-with': 1,

  // require use of the second argument for parseInt()
  'radix': 0,

  // require declaration of all vars at the top of their containing scope
  'vars-on-top': 1,

  // require immediate function invocation to be wrapped in parentheses
  'wrap-iife': [1, 'inside'],

  // require or disallow Yoda conditions
  'yoda': [1, 'never'],

  /* Strict Mode */
  // controls location of Use Strict Directives
  'strict': [1, 'never'],

  /* Variables */
  // enforce or disallow variable initializations at definition
  'init-declarations': 0,

  // disallow the catch clause parameter name being the same as a variable in the outer scope
  'no-catch-shadow': 1,

  // disallow deletion of variables (recommended)
  'no-delete-var': 1,

  // disallow labels that share a name with a variable
  'no-label-var': 1,

  // disallow shadowing of names such as arguments
  'no-shadow-restricted-names': 1,

  // disallow declaration of variables already declared in the outer scope
  'no-shadow': 1,

  // disallow use of undefined when initializing variables
  'no-undef-init': 1,

  // disallow use of undeclared variables unless mentioned in a /*global */ block (recommended)
  'no-undef': 0,

  // disallow use of undefined variable
  'no-undefined': 1,
  'no-unused-vars': ['warn',
    {
      'vars': 'local',
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'caughtErrorsIgnorePattern': '^_',
    },

    // disallow declaration of variables that are not used in the code (recommended)
  ],

  // disallow use of variables before they are defined
  'no-use-before-define': 1,

  /* Node.js */
  // enforce return after a callback
  'callback-return': 1,

  // enforce require() on top-level module scope
  'global-require': 1,

  // enforce error handling in callbacks
  'handle-callback-err': 1,

  // disallow mixing regular variable and require declarations
  'no-mixed-requires': 1,

  // disallow use of new operator with the require function
  'no-new-require': 1,

  // disallow string concatenation with __dirname and __filename
  'no-path-concat': 1,

  // disallow process.exit()
  'no-process-exit': 1,

  // restrict usage of specified node modules
  'no-restricted-modules': [1, ''],

  // disallow use of synchronous methods
  'no-sync': 1,

  /* Stylistic Issues */
  // enforce spacing inside array brackets (fixable)
  'array-bracket-spacing': [1, 'never'],

  // disallow or enforce spaces inside of single line blocks (fixable)
  'block-spacing': [1, 'always'],

  // enforce one true brace style
  'brace-style': [1, 'stroustrup', { 'allowSingleLine': true }],

  // require camel case names
  'camelcase': [1, { 'properties': 'always' }],

  // enforce spacing before and after comma
  'comma-spacing': [1, { 'before': false, 'after': true }],

  // enforce one true comma style
  'comma-style': [1, 'last'],

  // require or disallow padding inside computed properties (fixable)
  'computed-property-spacing': 0,

  // enforce consistent naming when capturing the current execution context
  'consistent-this': 0,

  // enforce newline at the end of file, with no multiple empty lines (fixable)
  'eol-last': 1,

  // require function expressions to have a name
  'func-names': 1,

  // enforce use of function declarations or expressions
  'func-style': 0,

  // this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
  'id-length': 0,

  // require identifiers to match the provided regular expression
  'id-match': [0, '^[a-z]+([A-Z][a-z]*)*$', { 'properties': true }],

  // specify tab or space width for your code (fixable)
  'indent': [1, 2],

  // specify whether double or single quotes should be used in JSX attributes
  'jsx-quotes': [1, 'prefer-single'],

  // enforce spacing between keys and values in object literal properties
  'key-spacing': [1, { 'beforeColon': false, 'afterColon': true }],

  // disallow mixed 'LF' and 'CRLF' as linebreaks
  'linebreak-style': 0,

  // enforce empty lines around comments
  'lines-around-comment': [1, {
    'beforeLineComment': true,
    'allowBlockStart': true,
    'allowObjectStart': true,
    'allowArrayStart': true,
  }],

  // specify the maximum depth callbacks can be nested
  'max-nested-callbacks': [0, 3],

  // require a capital letter for constructors
  'new-cap': 1,

  // disallow the omission of parentheses when invoking a constructor with no arguments
  'new-parens': 1,

  // require or disallow an empty newline after variable declarations
  'newline-after-var': 0,

  // disallow use of the Array constructor
  'no-array-constructor': 1,

  // disallow use of the continue statement
  'no-continue': 1,

  // disallow comments inline after code
  'no-inline-comments': 0,

  // disallow if as the only statement in an else block
  'no-lonely-if': 1,

  // disallow mixed spaces and tabs for indentation (recommended)
  'no-mixed-spaces-and-tabs': 1,

  // disallow multiple empty lines
  'no-multiple-empty-lines': [1, { 'max': 1 }],

  // disallow negated conditions
  'no-negated-condition': 1,

  // disallow nested ternary expressions
  'no-nested-ternary': 0,

  // disallow the use of the Object constructor
  'no-new-object': 1,
  'no-restricted-syntax': [1,
    'BreakStatement',
    'ContinueStatement',
    'DoWhileStatement',
    'DebuggerStatement',
    'LabeledStatement',

    // 'WhileStatement',
    'WithStatement',
    'ExportAllDeclaration',
    'ExportSpecifier',
    'ImportNamespaceSpecifier',

    /* no Float32Array construction */
    {
      'message': 'Float32Array construction is not allowed.',
      'selector': 'NewExpression[callee.name=\'Float32Array\']',
    },

    // disallow use of certain syntax in code
  ],

  // disallow space between function identifier and application (fixable)
  'no-spaced-func': 1,

  // disallow the use of ternary operators
  'no-ternary': 0,

  // disallow trailing whitespace at the end of lines (fixable)
  'no-trailing-spaces': 1,

  // disallow dangling underscores in identifiers
  'no-underscore-dangle': 0,

  // disallow the use of ternary operators when a simpler alternative exists
  'no-unneeded-ternary': 1,

  // require or disallow padding inside curly braces (fixable)
  'object-curly-spacing': [1, 'always'],

  // require or disallow one variable declaration per function
  'one-var': [1, 'never'],

  // require assignment operator shorthand where possible or prohibit it entirely
  'operator-assignment': [1, 'never'],

  // enforce operators to be placed before or after line breaks
  'operator-linebreak': [1, 'after'],

  // enforce padding within blocks
  'padded-blocks': [0, 'never'],

  // require quotes around object literal property names
  'quote-props': [0, 'as-needed'],

  // specify whether backticks, double or single quotes should be used (fixable)
  'quotes': [1, 'single'],

  // Require JSDoc comment
  'require-jsdoc': 0,

  // enforce spacing before and after semicolons
  'semi-spacing': [1, { 'before': false, 'after': true }],

  // require or disallow use of semicolons instead of ASI (fixable)
  'semi': [1, 'always'],

  // sort variables within the same declaration block
  'sort-vars': 0,

  // require a space after certain keywords (fixable)
  'space-after-keywords': 0,

  // require or disallow a space before blocks (fixable)
  'space-before-blocks': [1, 'always'],

  // require or disallow a space before function opening parenthesis (fixable)
  'space-before-function-paren': [1, 'never'],

  // require a space before certain keywords (fixable)
  'space-before-keywords': [0, 'never'],

  // require or disallow spaces inside parentheses
  'space-in-parens': [1, 'never'],

  // require spaces around operators (fixable)
  'space-infix-ops': 1,

  // require a space after return, throw, and case (fixable)
  'keyword-spacing': 1,

  // require or disallow spaces before/after unary operators (fixable)
  'space-unary-ops': 0,

  // require or disallow a space immediately following the // or /* in a comment
  'spaced-comment': [1, 'always'],

  // require regex literals to be wrapped in parentheses
  'wrap-regex': 1,

  /* ECMAScript 6 */
  // require braces in arrow function body
  'arrow-body-style': [1, 'as-needed'],

  // require parens in arrow function arguments
  'arrow-parens': [1, 'always'],

  // require space before/after arrow function's arrow (fixable)
  'arrow-spacing': [1, { 'before': true, 'after': true }],

  // verify calls of super() in constructors
  'constructor-super': 1,

  // disallow arrow functions where a condition is expected
  'no-confusing-arrow': 1,

  // 'no-constant-condition': 1, // disallow arrow functions where a condition is expected
  // enforce spacing around the * in generator functions (fixable)
  'generator-star-spacing': [1, 'after'],

  // disallow modifying variables of class declarations
  'no-class-assign': 1,

  // disallow modifying variables that are declared using const
  'no-const-assign': 1,

  // disallow duplicate name in class members
  'no-dupe-class-members': 1,

  // disallow use of this/super before calling super() in constructors.
  'no-this-before-super': 1,

  // require let or const instead of var
  'no-var': 1,

  // (see Babel section) require method and property shorthand syntax for object literals
  'object-shorthand': 1,

  // suggest using arrow functions as callbacks
  'prefer-arrow-callback': 1,

  // suggest using const declaration for variables that are never modified after declared
  'prefer-const': 1,

  // suggest using Reflect methods where applicable
  'prefer-reflect': 1,

  // suggest using the spread operator instead of .apply().
  'prefer-spread': 1,

  // suggest using template literals instead of strings concatenation
  'prefer-template': 1,

  // disallow generator functions that do not have yield
  'require-yield': 0,

  /* Legacy */
  // specify the maximum depth that blocks can be nested
  'max-depth': [0, 3],

  // specify the maximum length of a line in your program
  'max-len': [1, 110, 2],

  // limits the number of parameters that can be used in the function declaration.
  'max-params': 0,

  // specify the maximum number of statement allowed in a function
  'max-statements': 0,

  // disallow use of bitwise operators
  'no-bitwise': 1,

  // disallow use of unary operators, ++ and --
  // 'no-plusplus': 1,
};

export default [
  {

    'plugins': {
      jsdoc,
      'idle': eslintPluginIdle,
    },
  },
  {
    files: filesToLint.asModule,
    languageOptions: {
      sourceType: 'module',
    },
    'rules': baseRules,
  },
  {
    files: filesToLint.asScript,
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'script',
      parser: babelParser,
      parserOptions: {
        'requireConfigFile': false,
      },
    },
    'rules': baseRules,
  },

  ...idleSrcConfigs, // common rules from local plugin
  ...sglConfigs, // singletons
  ...prsConfigs, // parsers
  ...guiConfigs, // src/gui
  ...dataConfigs, // data folder
];
