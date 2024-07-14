/**
 * @file Boolean Debug Variable gui element
 * global variable readout with on/off toggle.
 */
class BooleanDebugVar extends CompositeGuiElement {
  _layoutData = DEBUG_BOOL_LAYOUT;
  #varname;
  #tooltip;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} varname The variable name/path in global.
   * @param {string} tooltip The description of the variable.
   */
  constructor(rect, varname, tooltip) {
    super(rect);
    this.#varname = varname;
    this.#tooltip = tooltip;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const varname = this.#varname;
    const layout = this._layout;

    // text label
    const dtl = new DynamicTextLabel(layout.label, () => varname);

    dtl.setScale(0.4);
    dtl.tooltipScale = 0.4;
    dtl.setCenter(false);

    const icon = getGlobal(varname) ? checkedIcon : uncheckedIcon;
    this.checkbox = new IconButton(layout.toggle, icon, () => this.toggle()).withScale(0.5);

    const result = [
      this.checkbox,
      dtl,
    ];

    // give all elements the same tooltip
    for (const e of result) {
      e.withDynamicTooltip(() => [
        `${getGlobal(varname) ? 'on' : 'off' } : ${varname} `,
        this.#tooltip,
      ].join('\n')).withTooltipScale(0.4);
    }

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

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    Button._draw(g, this.rect);
    super.draw(g);
  }
}
