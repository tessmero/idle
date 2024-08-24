/**
 * @file StatsTab gui element.
 *
 * Contents for the "stats" tab in the upgrade menu.
 */
class StatsTab extends CompositeGuiElement {
  _layoutData = STATS_TAB_LAYOUT;
  _soundData = STATS_TAB_SOUNDS;
  _layoutActors = {

    // individual rows expanding one by one
    stPoke: {
      lytAnim: STATS_TAB_ANIM,
      speed: 2e-3,
    },
  };

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const bsum = global.bonusSummary;
    if (!bsum) { return []; }

    return bsum.map((sumEntry, i) => {
      const rect = this._layout.rows[i];
      return new GuiElement(this._layout.rows[i], {
        icon: sumEntry[0],
        labelFunc: () => sumEntry[1],
        scale: 0.4,
        textAlign: 'left',
        border: new RoundedBorder(rect[3] / 2),
      });
    });
  }

  /**
   * Called in tab_pane_group.js
   */
  tabOpened() {
    const act = this._actors.stPoke;
    act.setState(0);
    act.setTarget(1);
    act.resetGuiActor();
  }
}
