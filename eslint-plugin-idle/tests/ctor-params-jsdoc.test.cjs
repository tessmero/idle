/**
 * @file ctor-params-jsdoc.test.cjs
 */

const { RuleTester } = require('eslint');
const ruleTester = new RuleTester();

ruleTester.run(
  'ctor-params-jsdoc',
  require('../rules/ctor-params-jsdoc.cjs'),

  // constructors must document destructured properties from `params`
  {
    valid: [
      {
        // three destructured params all have @param tags
        code: `
class GuiScreenPanel extends GuiElement {

  /**
   * @param {number[]} rect The rectangle for this gui element.
   * @param {object} params The parameters.
   * @param {GameScreen} params.innerScreen The inner screen to display.
   * @param {boolean} params.allowScaling False by default, so assume screen
   *                                      and rect have matching dims.
   * @param {boolean} params.hideInnerGui False by default, set to true to
   *                                      skip drawing inner screen's gui
   */
  constructor(rect, params = {}) {
    super(rect, { border: new RoundedBorder(), ...params });

    const {
      allowScaling = false,
      hideInnerGui = false,
      innerScreen,
    } = params;
  }
}
        `,
      },
      {
        // three destructured params all have @param tags
        code: `
class MyClass{

  /**
   * @param {object} params
   * @param {GameScreen} params.innerScreen
   * @param {boolean} params.allowScaling
   * @param {boolean} params.hideInnerGui
   */
  constructor(params) {
    const {
      allowScaling = false,
      hideInnerGui = false,
      innerScreen,
    } = params;
  }
}
        `,
      },
    ],

    invalid: [

      {
        // two of three param comments missing
        code: `
class GuiScreenPanel {

  /**
   * @param {object} params The parameters.
   * @param {GameScreen} params.innerScreen The inner screen to display.
   */
  constructor(params = {}) {
    const {
      allowScaling = false,
      hideInnerGui = false,
      innerScreen,
    } = params;
  }
}
        `,
        errors: 2,
      },

      {
        // two of three param comments missing
        code: `
class GuiScreenPanel {

  /**
   * @param {object} params The parameters.
   * @param {GameScreen} params.innerScreen The inner screen to display.
   */
  constructor(params = {}) {
    const test = [{'test':() => {
      const {
        allowScaling = false,
        hideInnerGui = false,
        innerScreen,
      } = params;
    }}]
  }
}
        `,
        errors: 2,
      },

      {
        // param not documented
        // but docs have another param starting with same name
        code: `
class GuiElement {

  /**
   *
   * @param {string} params.textAlign 'center' or 'left'
   */
  constructor(params = {}) {

    const {
      text,
    } = params;
  }
}
        `,
        errors: 1,
      },
    ],
  },
);
