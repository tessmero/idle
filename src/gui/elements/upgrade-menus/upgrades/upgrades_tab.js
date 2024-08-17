/**
 * @file UpgradesTab gui element
 *
 * Contents for the "upgrades" tab in the upgrades menu.
 */
class UpgradesTab extends CompositeGuiElement {
  _layoutData = UPGRADES_TAB_LAYOUT;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The parameters.
   */
  constructor(rect, params = {}) {
    super(rect, {
      ...params,
    });
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    if (!global.upgradeTracks) { return []; }

    const rows = this._layout.rows;
    const useThickLayout = rows[0][2] < 0.9;

    const specs = global.upgradeTracks.state;
    let rowIndex = 0;
    const rowSpan = useThickLayout ? 2 : 1;
    const upgraders = Object.entries(specs).map(([_key, gutse]) => {
      let rect = rows[rowIndex];
      rowIndex = rowIndex + rowSpan;
      if (useThickLayout) {
        rect = [rect[0], rect[1], rect[2], 2 * rect[3]];
      }
      return new StatUpgrader(rect, {
        layoutAnimState: {
          thick: useThickLayout ? 1 : 0,
        },
        gutse,
        tooltipFunc: () => {
          const ttpr = UpgradeTooltip.pickRect(this.screen);
          return new UpgradeTooltip(ttpr, { gutse });
        },
      });
    });

    /*
    // fill remaining rows with art elem
    const size = 0.4;
    const [x, y, w, _h] = rows[rowIndex];
    const lastRow = rows.at(-1);
    const y1 = lastRow[1] + lastRow[3];
    const c = v(x + w / 2, avg(y, y1));
    const maxy = this.rect[1] + this.rect[3] - size - 0.01;
    const rect = [c.x - size / 2, Math.min(c.y - size / 2, maxy), size, size];
    const hole = new HoleElement(rect, {
      border: new StarBorder(rect),
    });
    */

    return [

      // hole,

      ...upgraders,
    ];
  }

}
