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
   * @param {number[]} rect The rectangle enclosing the whole menu.\
   * @param {GameScreen} screen The screen that will contain this menu.
   * @param {object[]} pData The detailed state of the particle in quetion.
   */
  constructor(rect, screen, pData) {
    super(rect);
    this.#sim = screen.sim;
    this.#pData = pData;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const [s0, s1] = this._layout.squares;

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

      new StatReadout(s0, {
        icon,
        labelFunc: () => `\n${flavor}\nparticle\nno. ${i}`,
      }),

      new TextLabel(s1, {
        label: stats,
        scale: statScale,
      }),

      new IconButton(this._layout.closeBtn, {
        icon: xIcon,
        action: () => this.closePiContextMenu(),
        scale: 0.4,
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

    screen.contextMenu = null;
    sim.selectedParticle = null;
    screen.setTool(screen.toolList[0]);
  }
}
