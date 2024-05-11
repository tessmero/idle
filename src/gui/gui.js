// base class for top-level gui groups
// e.g. the start menu
class Gui extends CompositeGuiElement {

  constructor() {
    super(global.screenRect);
  }

  getScreenEdgesForContextMenu() {
    const rect = [...global.mainSim.rect];
    const topMargin = 0.1;
    const bottomMargin = 0.1;
    const sideMargin = 0.1;
    rect[1] = rect[1] + topMargin;
    rect[3] = rect[3] - (topMargin + bottomMargin);
    rect[0] = rect[0] + sideMargin;
    rect[2] = rect[2] - 2 * sideMargin;
    return rect;
  }

  // build list of GuiElement instances
  buildElements() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // return Gui instance to draw behind this
  // e.g. draw hud behind upgrade menu
  getBackgroundGui() {
    return null;
  }

  // return true to prevent clearing in draw.js
  // used for some start menu transition animations
  stopCanvasClear() {
    return false;
  }

  // hooks called in game_states.js
  open() {}
  close() {}
}
