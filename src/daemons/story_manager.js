/**
 * @file StoryManager keeps track of player progression state.
 *
 * References STORY_HOOKS data object (data/story_hooks_data.js)
 */
function StoryManager() {
  if (StoryManager._instance) {
    return StoryManager._instance;
  }
  if (!(this instanceof StoryManager)) {
    // eslint-disable-next-line idle/no-new-singleton
    return new StoryManager();
  }
  StoryManager._instance = this;

  this._hooks = STORY_HOOKS;
  this._alreadyTriggered = new Set();

  /**
   * Called when a hook has been triggered.
   * @param {string} key The key in data/story_hooks_data.js
   * @returns {boolean} True to attempt to block/consume the triggering user action
   */
  this.triggerStoryHook = function(key) {
    const hook = STORY_HOOKS[key];
    const done = this._alreadyTriggered;

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
  };
}
