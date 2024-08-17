/**
 * @file STORY_HOOKS List of player progression checkpoints and resulting interventions.
 *
 * Top-level keys may be referenced explicitly in other data structures or in source code.
 * Top-level keys are ultimately passed as an argument to StoryManager().triggerStoryHook(key)
 */
STORY_HOOKS = {

  /**
   * The player clicked the 'Start' button and the animated transition has completed.
   */
  startSequenceFinished: {
    message: [
      'Congratulations!', 'You are the rain catcher.',
    ],
    extra: [
      'you must catch 100% of the rain.',
    ],
  },

  /**
   * Attempted First Rain Increasing Upgrade
   * For the first time, the player clicked a relevant upgrade button and can afford it,
   * but they are blocked once by this message.
   */
  attemptedRainIncrease: {
    blocksTriggerAction: true,
    message: [
      'You must not purchase this upgrade.',
      'It will increase the rain permanently.',
    ],
    extra: [
      'The rain will never stop falling.',
      'Your job is to catch it.',
    ],
  },

  /**
   * Purchased First Rain Increasing Upgrade
   * For the first time, the player successfully purchased a relevant upgrade.
   */
  purchasedRainIncrease: {
    after: 'attemptedRainIncrease',
    message: [
      'You have shirked your duties and',
      'intentionally increased the rain.',
    ],
    extra: [
      'No. Bad.',
    ],
  },
};
