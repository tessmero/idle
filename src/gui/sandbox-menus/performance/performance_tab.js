class PerformanceTab extends CompositeGuiElement {
  constructor(sr) {
    super(sr);

    const rows = this.buildRows(sr, 10);

    const specs = [
      [() => this.rptSims(), () => this.rptSimsDetails()],

      [
        () => this.rptTotal('grabCheckCount', 'total grab checks in last update'),
        () => [
          'a "grab check" means comparing one',
          'particle with one grabber',
          'this number should be reduced',
          'using a chunk grid system',
        ].join('\n'),
      ],

      [() => this.rptTotal('grabCount', 'total grabs in last update'),
        () => [
          'a "grab" happens when a particle',
          'intersects with a grabber',
          'e.g. raindrop collides with solid',
        ].join('\n'),
      ],

      [() => this.rptTotal('pdrawCount', 'total particles drawn'), null],

    ];

    let i = 0;
    specs.forEach((entry) => {
      const [labelFunc, tooltipFunc] = entry;
      const elem = new StatReadout(
        rows[i], rainIcon, labelFunc)
        .withScale(0.4)
        .withDynamicTooltip(tooltipFunc);
      this.children.push(elem);
      i = i + 1;
    });
  }

  rptTotal(key, label) {

    // Last Update Performance Stats (update.js)
    const simFlags = global.lupStats.activeSims;

    let n = 0;
    for (const [_sim, flags] of simFlags) {
      n = n + flags.get(key);
    }
    return `${n} ${label}`;
  }

  rptSimsDetails() {

    let result = '';

    // Last Update Performance Stats (update.js)
    const simFlags = global.lupStats.activeSims;
    for (const [sim, flags] of simFlags) {
      result = `${result + sim.title }\n${ JSON.stringify(Array.from(flags.entries()))}`;
    }
    return result.replaceAll(']', '\n');
  }

  rptSims() {

    // Last Update Performance Stats (update.js)
    const simFlags = global.lupStats.activeSims;

    const n = simFlags.size;
    return `${n} active simulation${n > 1 ? 's' : ''}`;
  }

  buildRows(rect, n) {
    const sr = rect;
    const m = 0.03;
    const w = sr[2] - 2 * m;
    const h = 0.05;
    const r0 = [sr[0] + m, sr[1] + m * 2, w, h];

    const result = [];
    for (let i = 0; i < n; i++) {
      result.push([...r0]);
      r0[1] = r0[1] + r0[3];
    }
    return result;
  }
}
