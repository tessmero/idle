// sandbox mode
// particle inspector context menu
class PiContextMenu extends ContextMenu {
  constructor(rect, s0, s1, pData) {
    super(rect, s0, s1);
    this.pData = pData;

    // idenfity particle type
    const [subgroup, _i, _x, _y, _dx, _dy, _hit] = pData;
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

    const w = 0.05;
    const topRight = [rect[0] + rect[2] - w, rect[1], w, w];

    const statScale = 0.4;
    let stats = this.buildStats(flavor);

    stats = stats.map((e) => ((e.length === 1) ? e[0] : this.showCoord(...e)));
    stats = stats.join('\n');

    this.children = [

      new StatReadout(s0, icon, () => `\n${flavor}\nparticle\nno. ${i}`, () => 0.5),
      new TextLabel(s1, stats).withScale(statScale),

      new IconButton(topRight, xIcon, () => this.closePiContextMenu())
        .withScale(0.5)
        .withTooltip('close'),
    ];
  }

  buildStats(flavor) {

    // data passed from grab event
    // in need of cleanup
    const [_subgroup, _i, x, y, _dx, _dy, _hit] = this.pData;

    // lookup group needs cleanup
    const s = global.mainSim;
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

  showCoord(label, val) {

    let s = Number(val).toFixed(3);
    const tl = 10 - label.length;
    while (s.length < tl) {
      s = ` ${ s}`;
    }
    return `${label}:${s}`;
  }

  deleteBody() {
    let b = this.body;
    while (b.parent) { b = b.parent; }// got top parent
    global.mainSim.removeBody(b);
    this.closeBodyContextMenu();
  }

  closePiContextMenu() {
    global.contextMenu = null;
    global.mainSim.selectedParticle = null;

    global.mainSim.setTool(global.toolList[0]);
  }
}
