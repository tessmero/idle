/**
 * @file Boolean Debug Variable gui element
 * global variable readout with on/off toggle.
 */
class BooleanDebugVar extends CompositeGuiElement {
  _layoutData = DEBUG_BOOL_LAYOUT;

  #varname;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {string} params.varname The variable name/path in global.
   */
  constructor(rect, params = {}) {
    super(rect, { ...params,
      opaque: true,
    });

    const { varname } = params;
    this.#varname = varname;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const varname = this.#varname;
    const layout = this._layout;

    // text label
    const dtl = new DynamicTextLabel(layout.label, {
      labelFunc: () => varname,
      scale: 0.4,
      center: false,
    });

    const icon = getGlobal(varname) ? checkedIcon : uncheckedIcon;
    this.checkbox = new IconButton(layout.toggle, {
      icon,
      action: () => this.toggle(),
      scale: 0.5,
    });

    const result = [
      this.checkbox,
      dtl,
    ];

    return result;
  }

  /**
   * called when clicked
   */
  toggle() {
    const varname = this.#varname;
    let val = getGlobal(varname);
    val = !val;
    setGlobal(varname, val);
    this.checkbox.icon = val ? checkedIcon : uncheckedIcon;
    const screen = this.screen;
    screen.stateManager.rebuildGuis(screen, false);
  }
}
