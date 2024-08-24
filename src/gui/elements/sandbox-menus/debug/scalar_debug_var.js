/**
 * @file Scalar Debug Variable gui element
 * a global variable readout with buttons to increase or decrease.
 */
class ScalarDebugVar extends CompositeGuiElement {
  _layoutData = DEBUG_SCALAR_LAYOUT;

  #varname;
  #desc;
  #inc;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {string} params.varname The variable name/path in global.
   * @param {number} params.inc The change increment value.
   * @param {string} params.desc The description.
   */
  constructor(rect, params = {}) {
    super(rect, { ...params,
      tooltipFunc: () => this._sdTooltip(),
      opaque: true,
    });

    const { varname, inc, desc } = params;

    this.#varname = varname;
    this.#inc = inc;
    this.#desc = desc;
  }

  /**
   *
   */
  _fmtVal() {
    return Math.floor(getGlobal(this.#varname) / this.#inc + 0.5).toString();
  }

  /**
   *
   */
  _sdTooltip() {
    return [
      `${this._fmtVal()} : ${this.#varname} `,
      this.#desc,
      'shift-click for 10x',
      'ctrl-click for 100x',
    ].join('\n');
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const varname = this.#varname;
    const inc = this.#inc;
    const layout = this._layout;

    const result = [
      new GuiElement(layout.value, {
        labelFunc: () => this._fmtVal(),
        scale: 0.4,
        textAlign: 'left',
      }),

      new GuiElement(layout.label, {
        labelFunc: () => varname,
        scale: 0.4,
        textAlign: 'left',
      }),

      // buttons
      new Button(layout.buttons[0], {
        titleKey: `${this._titleKey}-dec`,
        icon: decreaseIcon,
        action: () => {
          let m = 1;
          if (global.shiftHeld) { m = 10; }
          if (global.controlHeld) { m = 100; }
          let val = getGlobal(varname);
          val = val - m * inc;
          setGlobal(varname, val);
          const screen = this.screen;
          screen.stateManager.rebuildGuis(screen, false);
        },
      }),
      new Button(layout.buttons[1], {
        titleKey: `${this._titleKey}-inc`,
        icon: increaseIcon,
        action: () => {
          let m = 1;
          if (global.shiftHeld) { m = 10; }
          if (global.controlHeld) { m = 100; }
          let val = getGlobal(varname);
          val = val + m * inc;
          setGlobal(varname, val);
          const screen = this.screen;
          screen.stateManager.rebuildGuis(screen, false);
        },
      }),
    ];

    return result;
  }
}
