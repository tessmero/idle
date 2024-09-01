/**
 * @file GfxButton sets global.gfxEnabled
 */
class GfxButton extends Button {

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   */
  constructor(rect, params = {}) {
    super(rect, {
      action: () => this._muteClicked(),
      icon: global.gfxEnabled ? gfxIcon : noGfxIcon,
      tooltipFunc: () => (global.gfxEnabled ? 'Visual effects are enabled' : 'Visual effects are disabled'),
      ...params,
    });
  }

  /**
   *
   */
  _muteClicked() {
    global.gfxEnabled = !global.gfxEnabled;
    this.icon = global.gfxEnabled ? gfxIcon : noGfxIcon;
  }
}
