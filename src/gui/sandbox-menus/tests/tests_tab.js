/**
 *
 */
class TestsTab extends CompositeGuiElement {
  /**
   *
   * @param sr
   */
  constructor(sr) {
    super(sr);

    const scale = 0.4;

    // sr = padRect(...sr, -.02 )
    // let rows = divideRows(...sr,6)

    const list = iitestList;
    const rows = this.buildRows(sr, list.length + 1);

    // run all button
    const rab = new Button(rows[0],
      () => this.playAllClicked())
      .withScale(scale);
    this.rab = rab;

    // build ui rows, leaveing first slot free
    const tlrs = [];
    for (let i = 0; i < list.length; i++) {
      tlrs.push(new TestListRow(rows[i + 1], list[i], i));
    }
    this.tlrs = tlrs;

    this.children = [

      // play all button in first slot
      rab,

      new StatReadout(rab.rect, nextIcon,
        () => 'run all tests')
        .withScale(scale),

      // ui rows
      ...tlrs,
    ];
  }

  /**
   *
   * @param g
   */
  draw(g) {
    super.draw(g);

    // highlight "run all tests" button if active (this.rab)
    const c = this.screen.contextMenu;
    if ((_testLoopSetting === 'all') && (c instanceof TestContextMenu)) {
      ProgressIndicator._draw(g, this.rab.rect, 1.0);
    }
  }

  /**
   *
   */
  playAllClicked() {
    _testLoopSetting = 'all';
    this.tlrs[0].clicked();
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
