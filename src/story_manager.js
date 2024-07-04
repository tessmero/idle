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

  #hooks = STORY_HOOKS;
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
   * @param {string} key The key in data/story_hooks_data.js
   * @returns {boolean} True to attempt to block/consume the triggering user action
   */
  triggerStoryHook(key) {
    const hook = this.#hooks[key];
    const done = this.#alreadyTriggered;

    if (done.has(key)) {
      return false; // checkpoint already completed
    }

    if (hook.after && (!done.has(hook.after))) {
      return false; // required checkpoint not completed
    }

    const sm = global.mainScreen.stateManager;
    if (sm.state === GameStates.storyIntervention) {
      return false; // already in special story state
    }

    // enter new story state
    sm.setState(GameStates.storyIntervention,
      {
        hook,
        prevState: sm.state,
      }
    );
    done.add(key);
    return hook.blocksTriggerAction;
  }
}
