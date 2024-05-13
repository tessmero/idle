// a global variable readout with on/off toggle
class BooleanDebugVar extends CompositeGuiElement {

  constructor(rect, varname, tooltip) {
    super(rect);
    this.varname = varname;

    const r = this.rect;
    const d = 0.05;
    const r0 = [r[0], r[1], d, d];

    // text label
    const dtl = new DynamicTextLabel(rect, () =>
      `          ${varname}`)
      .withDynamicTooltip(() => [
        `${getGlobal(varname) ? 'on' : 'off' } : ${varname} `,
        tooltip,
      ].join('\n'));

    dtl.scale = 0.4;
    dtl.tooltipScale = 0.4;
    dtl.center = false;
    dtl.fixedRect = true;

    const icon = getGlobal(varname) ? checkedIcon : uncheckedIcon;
    r0[2] = r0[2] + 0.17;
    this.checkbox = new IconButton(r0, icon, () => this.toggle()).withScale(0.5);

    this.children = [
      this.checkbox,
      dtl,
    ];

  }

  // called when clicked
  toggle() {
    const varname = this.varname;
    let val = getGlobal(varname);
    val = !val;
    setGlobal(varname, val);
    this.checkbox.icon = val ? checkedIcon : uncheckedIcon;
    rebuildGuis(); // game_states.js
  }

  draw(g) {
    Button._draw(g, this.rect);
    super.draw(g);
  }
}