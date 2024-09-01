/**
 * @file GuiSoundParser plays some sounds from data/gui-sounds
 * when they are triggered by gui layout animations
 */
class GuiSoundParser {

  /**
   * Find sounds triggered by newly adjusted layout params.
   * @param {object} data The data object in data/gui-sounds
   *                      with trigger conditions like 'expand=1'
   * @param {object} fromPars The old layout parameters.
   * @param {object} toPars The new layout parameters.
   */
  static getTriggeredSounds(data, fromPars, toPars) {
    if (!data) {
      return [];
    }

    const result = [];

    Object.entries(data).forEach(([soundName, trigger]) => {

      // check if sound is triggered by gui using 'from' and 'to' criteria
      if (!trigger.from) {
        return;
      }

      // check if trigger conditions are met
      const fromMatch = GuiSoundParser._isTrue(trigger.from, fromPars);
      if (!fromMatch) {
        return;
      }
      const toMatch = GuiSoundParser._isTrue(trigger.to, toPars);
      if (GuiSoundParser._matchMatch(fromMatch, toMatch)) {

        // sound should be played
        result.push(soundName);
      }
    });

    return result;
  }

  /**
   * Used in triggerSounds().
   * Check if both are true, or both have true at the same index.
   * @param  {boolean|boolean[]} toMatch
   * @param  {boolean|boolean[]} fromMatch
   */
  static _matchMatch(toMatch, fromMatch) {
    if (Array.isArray(toMatch)) {
      for (let i = 0; i < toMatch.length; i++) {
        if (fromMatch[i] && toMatch[i]) {
          return true;
        }
      }
    }
    else if (toMatch && fromMatch) {
      return true;
    }

    return false;
  }

  /**
   * Interpret sound trigger criteria string from data and
   * return true if it matches the given parameter values.
   * @param {string} criteria  The criteria string like 'expand=0'
   * @param {object} params The parameter values to compare with.
   */
  static _isTrue(criteria, params) {

    // split string with operator = or < or >
    const regex = /^(\w+)([=<>])(\d+(\.\d+)?)$/;
    const match = criteria.match(regex);

    if (!match) {
      throw new Error(`Invalid criteria format: "${criteria}"`);
    }

    const [, key, operator, valueString] = match;

    if (!(key in params)) {
      return false;
    }

    const paramValue = params[key];
    const expectedValue = Number(valueString);

    // pick compare function based on operator
    const comparisons = {
      '=': (a) => a === expectedValue,
      '<': (a) => a < expectedValue,
      '>': (a) => a > expectedValue,
    };
    const compare = comparisons[operator];

    if (typeof paramValue === 'number') {

      // param value is single number
      // return true or false
      return compare(paramValue);
    }

    // param value is array of numbers
    // return false or array of booleans
    const result = paramValue.map((v) => compare(v));
    if (!result.some((r) => r)) {
      return false;
    }
    return result;
  }
}
