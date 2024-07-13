/**
 * @file Boolean Debug Variable gui element
 * global variable readout with on/off toggle.
 */
class BooleanDebugVar extends CompositeGuiElement {

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

    const r = this.rect;
    const varname = this.#varname;
    const d = 0.05;
    const r0 = [r[0], r[1], d, d];

    // text label
    const dtl = new DynamicTextLabel(r, () =>
      `          ${varname}`)
      .withDynamicTooltip(() => [
        `${getGlobal(varname) ? 'on' : 'off' } : ${varname} `,
        this.#tooltip,
      ].join('\n'));

    dtl.setScale(0.4);
    dtl.tooltipScale = 0.4;
    dtl.setCenter(false);

    const icon = getGlobal(varname) ? checkedIcon : uncheckedIcon;
    r0[2] = r0[2] + 0.17;
    this.checkbox = new IconButton(r0, icon, () => this.toggle()).withScale(0.5);

    return [
      this.checkbox,
      dtl,
    ];
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
