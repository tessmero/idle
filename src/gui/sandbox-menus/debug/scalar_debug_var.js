/**
 * @file Scalar Debug Variable gui element
 * a global variable readout with buttons to increase or decrease.
 */
class ScalarDebugVar extends CompositeGuiElement {

  /**
   *
   * @param rect
   * @param varname
   * @param inc
   * @param tooltip
   */
  constructor(rect, varname, inc, tooltip) {
    super(rect);
    const r = this.rect;
    const d = 0.05;
    const p = (r[3] - d) / 2;
    const r0 = [r[0] + p, r[1] + p, d, d];
    const r1 = [r0[0] + d + p, r[1] + p, d, d];

    // text label
    const dtl = new DynamicTextLabel(rect, () =>
      `     ${ Math.floor(getGlobal(varname) / inc + 0.5).toString().padEnd(5, ' ') }${varname}`)
      .withDynamicTooltip(() => [
        `${Math.floor(getGlobal(varname) / inc + 0.5).toString() } : ${varname} `,
        tooltip,
        'shift-click for 10x',
        'ctrl-click for 100x',
      ].join('\n')); // tooltip
    dtl.setScale(0.4);
    dtl.tooltipScale = 0.4;
    dtl.setCenter(false);

    this.setChildren([
      dtl,

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
    ]);

  }

  /**
   *
   * @param g
   */
  draw(g) {
    Button._draw(g, this.rect);
    super.draw(g);
  }
}
