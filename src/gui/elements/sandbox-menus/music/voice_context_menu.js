/**
 * @file VoiceContextMenu
 */
class VoiceContextMenu extends ContextMenu {
  _layoutData = VOICE_CONTEXT_MENU_LAYOUT;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   */
  constructor(rect, params = {}) {
    super(rect, params);
  }
}
