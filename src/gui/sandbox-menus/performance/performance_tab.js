/**
 *
 */
class PerformanceTab extends CompositeGuiElement {

  /**
   *
   * @param {number[]} rect
   */
  constructor(rect) {
    super(rect);

    const rows = this.buildRows(rect, 10);

    const specs = [
      [screenIcon, () => this.rptMemoryScreens(), () => this.rptMemoryScreensDetails()],
      [screenIcon, () => this.rptActiveScreens(), () => this.rptActiveScreensDetails()],

      [
        catchIcon, () => this.rptTotal('sim grabCheckCount', 'total grab checks in last update'),
        () => [
          'a "grab check" means comparing one',
          'particle with one grabber',
          'this number should be reduced',
          'using a chunk grid system',
        ].join('\n'),
      ],

      [catchIcon, () => this.rptTotal('sim grabCount', 'total grabs in last update'),
        () => [
          'a "grab" happens when a particle',
          'intersects with a grabber',
          'e.g. raindrop collides with solid',
        ].join('\n'),
      ],

      [rainIcon, () => this.rptTotal('sim pdrawCount', 'total particles drawn'), null],

    ];

    let i = 0;
    specs.forEach((entry) => {
      const [icon, labelFunc, tooltipFunc] = entry;
      const elem = new StatReadout(
        rows[i], icon, labelFunc)
        .withScale(0.4)
        .withDynamicTooltip(tooltipFunc);
      this.children.push(elem);
      i = i + 1;
    });
  }

  /**
   * Report total value from live performance stats
   * @param {string} key may have been submitted to global.lupStats.
   * @param {string} label
   */
  rptTotal(key, label) {

    // Last Update Performance Stats (update.js)
    const screenFlags = global.lupStats.activeScreens;

    let n = 0;
    for (const [_sim, flags] of screenFlags) {
      n = n + flags.get(key);
    }
    return `${n} ${label}`;
  }

  /**
   * @returns {string} A one-line summary of all screens
   *                   that have been constructed.
   */
  rptMemoryScreens() {

    // log_performance_stats.js
    const lps = global.logPerformanceStats;

    // report counts
    const screens = lps.constructedScreens.size;
    return `${screens} total screens`;
  }

  /**
   * @returns {string} A breakdown of which types of
   *                   screens have been constructed.
   */
  rptMemoryScreensDetails() {

    // setup.js
    // log_performance_stats.js
    const allScreens = global.logPerformanceStats.constructedScreens;

    const result = JSON.stringify(Array.from(allScreens.keys()))
      .replaceAll(',', '\n')
      .replaceAll('[', '');

    return result;
  }

  /**
   * @returns {string} JSON dump of last update's performance stats.
   */
  rptActiveScreensDetails() {

    // Last Update Performance Stats (update.js)
    // live_performance_stats.js
    const screenFlags = global.lupStats.activeScreens;

    const result = Array.from(screenFlags,
      ([screen, flags]) => `${screen.title}\n${JSON.stringify(Array.from(flags.entries()))}`
    ).join('\n').replaceAll(']', '\n');

    return result;
  }

  /**
   * @returns {string} A one-line summary of screens involved in last update.
   */
  rptActiveScreens() {

    // Last Update Performance Stats (update.js)
    const screenFlags = global.lupStats.activeScreens;

    const n = screenFlags.size;
    return `${n} active screen${n > 1 ? 's' : ''}`;
  }

  /**
   *
   * @param rect
   * @param n
   */
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
