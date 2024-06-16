/**
 * @file BlankGSM state manager for
 * simple screens with no guis or transitions.
 */
class BlankGSM extends GameStateManager {

  /**
   * override GameStateManager
   * @param {number} state
   * @param {number[]} sr The rectangle to align elements in.
   */
  _buildGuiForState(state, sr) {
    switch (state) {

    case GameStates.boxTransition:
      return new BoxTransitionGui(sr);

    default:
      return null;
    }
  }
}
