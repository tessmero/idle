/**
 * @file MuteButton sets global.soundEnabled
 */
class MuteButton extends Button {

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   */
  constructor(rect, params = {}) {
    super(rect, {
      action: () => this._muteClicked(),
      icon: global.soundEnabled ? soundPlayingIcon : soundMutedIcon,
      tooltipFunc: () => (global.soundEnabled ? 'sound is on' : 'sound is off'),
      ...params,
    });
  }

  /**
   *
   */
  _muteClicked() {
    global.soundEnabled = !global.soundEnabled;
    this.icon = global.soundEnabled ? soundPlayingIcon : soundMutedIcon;
  }
}
