/**
 * @file PiContextMenu gui element
 * Context menu for particle inspector in sandbox mode.
 */
class PiContextMenu extends ContextMenu {

  #sim;
  #pData;

  /**
   * A specific particle was selected. Construct a context
   * menu to show its detailed status.
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {object} params The parameters.
   * @param {object} params.sim The simulation that contains the particle.
   * @param {object[]} params.pData The detailed state of the particle.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { sim, pData } = params;

    this.#sim = sim;
    this.#pData = pData;
  }

  /**
   *
   * @param {object} pData
   */
  pcmMatches(pData) {
    return (this.#pData[0] === pData[0]) && // matching subgroup
      (this.#pData[1] === pData[1]); // matching index in subgroup

  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const s0 = layout.squares[0];
    const s1 = layout.squares[1];

    // idenfity particle type
    const [subgroup, i, _x, _y, _dx, _dy, _hit] = this.#pData;
    let flavor; let icon;
    if (!subgroup) {
      icon = proceduralParticleIcon;
      flavor = 'procedural';
    }
    else if (subgroup instanceof PhysicsParticleSubgroup) {
      icon = physicsParticleIcon;
      flavor = 'physics';
    }
    else {
      icon = edgeParticleIcon;
      flavor = 'edge';
    }

    const statScale = 0.4;
    let stats = this.buildStats(flavor);

    stats = stats.map((e) => ((e.length === 1) ? e[0] : this.showCoord(...e)));
    stats = stats.join('\n');

    return [

      new GuiElement(s0, {
        icon,
        labelFunc: () => `\n${flavor}\nparticle\nno. ${i}`,
        scale: statScale,
        textAlign: 'left',
      }),

      new GuiElement(s1, {
        label: stats,
        scale: statScale,
      }),

      new Button(this._layout.closeBtn, {
        icon: xIcon,
        action: () => this.closePiContextMenu(),
        scale: statScale,
        tooltip: 'close',
      }),
    ];
  }

  /**
   *
   * @param {string} flavor 'physics', 'edge', or 'procedural'
   */
  buildStats(flavor) {

    // data passed from grab event
    // in need of cleanup
    const s = this.#sim;
    const [_subgroup, i, x, y, _dx, _dy, _hit] = this.#pData;

    // lookup group needs cleanup
    const grp = ((flavor === 'physics') ? s.physicsGroup : (
      (flavor === 'edge') ? s.edgeGroup : s.rainGroup
    ));

    // group members (not relevent for procedural)
    const nd = grp.ndims;
    const st = grp.state;

    const grabbed = grp.grabbedParticles.has(i);
    const state = grabbed ? 'inactive' : 'active';
    const vscale = 1e3;

    switch (flavor) {
    case 'physics':
      const vx = vscale * st[i * nd + 2];
      const vy = vscale * st[i * nd + 3];
      return [
        [state],
        ['x', x],
        ['y', y],
        ['vx', vx],
        ['vy', vy],
      ];

    case 'edge':
      const d = st[i * nd + 0];
      const v = vscale * st[i * nd + 1];
      return [
        [state],
        ['pos', d],
        ['vel', v],
      ];

    default:
      return [
        [state],
        ['x', x],
        ['y', y],
      ];
    }
  }

  /**
   * Display a short label and floating point value.
   * @param {string} label The short label to display.
   * @param {number} val The float value to display.
   */
  showCoord(label, val) {

    let s = Number(val).toFixed(3);
    const tl = 10 - label.length;
    while (s.length < tl) {
      s = ` ${ s}`;
    }
    return `${label}:${s}`;
  }

  /**
   *
   */
  closePiContextMenu() {
    const screen = this.screen;
    const sim = screen.sim;

    screen.setContextMenu(null);
    sim.selectedParticle = null;
    screen.setTool(screen.toolList[0]);
  }
}
