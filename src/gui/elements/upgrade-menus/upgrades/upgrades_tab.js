/**
 * @file UpgradesTab gui element
 *
 * Contents for the "upgrades" tab in the upgrades menu.
 */
class UpgradesTab extends CompositeGuiElement {
  _titleKey = 'upgrades-tab';
  _layoutData = UPGRADES_TAB_LAYOUT;
  _soundData = UPGRADES_TAB_SOUNDS;
  _layoutActors = {

    // individual rows expanding one by one
    utDrop: {
      lytAnim: UPGRADES_TAB_ANIM,
      speed: 2e-3,
    },
  };

  /**
   * Called in tab_pane_group.js
   */
  tabOpened() {
    const act = this._actors.utDrop;
    act.setState(0);
    act.setTarget(1);
    act.resetGuiActor();
  }

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The parameters.
   */
  constructor(rect, params = {}) {
    super(rect, {
      lytParams: {
        thick: rect[2] < 0.9 ? 1 : 0,
      },
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
    const { thick = 0 } = this.lytParams || {};

    const specs = global.upgradeTracks.state;
    let rowIndex = 0;
    const rowSpan = 1;// useThickLayout ? 2 : 1;
    const upgraders = Object.entries(specs).map(([_key, gutse]) => {
      const rect = rows[rowIndex];
      rowIndex = rowIndex + rowSpan;
      return new StatUpgrader(rect, {
        lytParams: {
          thick,
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
