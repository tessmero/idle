/**
 * @file STORY_HOOKS List of player progression checkpoints and resulting interventions.
 */
const STORY_HOOKS = {

  /**
   * The player clicked the 'Start' button and the animated transition has completed.
   */
  startSequenceFinished: {
    message: [
      'Congratulations! You are the raincatcher.',
      'Your job is to catch 100% of the rain.',
    ],
    extra: [
      'IMPORTANT: your title "raincatcher" is all one word,',
      'not to be confused with the "rain catcher" of legend.',
    ],
  },

  /**
   * Attempted First Rain Increasing Upgrade
   * For the first time, the player clicked a relevant upgrade button and can afford it,
   * but they are blocked once by this message.
   */
  attemptedFirstRiu: {
    message: [
      'You must not purchase this upgrade.',
      'It will increase the rain permanently.',
    ],
    extra: [
      'The rain will never stop falling.',
      'You\'re job is to catch it.',
    ],
  },

  /**
   * Purchased First Rain Increasing Upgrade
   * For the first time, the player successfully purchased a relevant upgrade.
   */
  purchasedFirstRiu: {
    message: [
      'You have shirked your duties and intentionally increased the rain.',
    ],
    extra: [
      'No. Bad.',
    ],
  },
};
