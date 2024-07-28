/**
 * @file Scalar Debug Variable gui element
 * a global variable readout with buttons to increase or decrease.
 */
class ScalarDebugVar extends CompositeGuiElement {
  _layoutData = DEBUG_SCALAR_LAYOUT;

  #varname;
  #inc;
  #tooltip;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} varname The variable name/path in global.
   * @param {number} inc The change increment value.
   * @param {string} tooltip The description of the variable.
   */
  constructor(rect, varname, inc, tooltip) {
    super(rect);
    this.#varname = varname;
    this.#inc = inc;
    this.#tooltip = tooltip;
    this.setBorder(Border.default);
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const varname = this.#varname;
    const inc = this.#inc;
    const tooltip = this.#tooltip;
    const layout = this._layout;
    const [r0, r1] = layout.buttons;

    const fmtVal = () => Math.floor(getGlobal(varname) / inc + 0.5).toString();

    // text labels
    const labels = [
      new DynamicTextLabel(layout.value, () => fmtVal()),
      new DynamicTextLabel(layout.label, () => varname),
    ];
    for (const lbl of labels) {
      lbl.setScale(0.4);
      lbl.setCenter(false);
    }

    const result = [
      ...labels,

      // buttons
      new IconButton(r0, decreaseIcon, () => {
        let m = 1;
        if (global.shiftHeld) { m = 10; }
        if (global.controlHeld) { m = 100; }
        let val = getGlobal(varname);
        val = val - m * inc;
        setGlobal(varname, val);
        const screen = this.screen;
        screen.stateManager.rebuildGuis(screen, false);
      }),
      new IconButton(r1, increaseIcon, () => {
        let m = 1;
        if (global.shiftHeld) { m = 10; }
        if (global.controlHeld) { m = 100; }
        let val = getGlobal(varname);
        val = val + m * inc;
        setGlobal(varname, val);
        const screen = this.screen;
        screen.stateManager.rebuildGuis(screen, false);
      }),
    ];

    // give all elements the same tooltip
    for (const e of result) {
      e.withDynamicTooltip(() => [
        `${fmtVal()} : ${varname} `,
        tooltip,
        'shift-click for 10x',
        'ctrl-click for 100x',
      ].join('\n'))
        .withTooltipScale(0.4);
    }

    return result;
  }
}
