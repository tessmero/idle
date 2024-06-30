/**
 * @file StoryManager object type.
 *
 * Manages the player progression state.
 *
 * constructed once in setup.js
 * instance is global.storyManager
 */
let _StoryManagerConstructed = false;

/**
 *
 */
class StoryManager {

  #alreadyTriggered = new Set();

  /**
   * called once in setup.js
   */
  constructor() {
    if (_StoryManagerConstructed) {
      throw new Error(`${this.constructor} constructed mutiple times`);
    }
    _StoryManagerConstructed = true;
  }

  /**
   * Called when a hook has been triggered.
   * @param {object} hook The value in story_hooks_data.js
   */
  triggerStoryHook(hook) {
    if (this.#alreadyTriggered.has(hook)) {
      return;
    }
    const sm = global.mainScreen.stateManager;
    sm.setState(GameStates.storyIntervention,
      {
        hook,
        prevState: sm.state,
      }
    );
  }
}
