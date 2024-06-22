/**
 * @file Utlities to aggregate and enact various in-game bonus effects.
 */

/**
 * called in updateAllBonuses
 * compute value and
 * apply conversion if applicable (human readable -> internal units)
 * @param {object} e The bonus state entry in upgrade_tracks.js
 */
function _computeBonusVal(e) {
  const readableVal = e.value.f(e.level - 1);
  let realVal = readableVal;
  if (e.getReadableValue) { realVal = e.getReadableValue(readableVal); }
  return [readableVal, realVal];
}

// helper to apply bonus to all relevant screens
function _enactBonus(f, screen, value) {

  // enact bonus on given screen
  f(screen, value);

  // enact bonus on descendant black boxes
  screen.sim.bodies.filter((b) => b instanceof BoxBuddy)
    .forEach((box) =>
      _enactBonus(f, box.innerScreen, value));
}

/**
 * Compute the total bonus value, build explaination text,
 * and enact the bonus effect in-game.
 * @param {string} key The key in upgrade_tracks.js
 * @param {Function} f The function to apply the bonus effect.
 */
function _updateBonus(key, f) {

  // compute bonus
  const upgrades = global.upgradeTracks.state;
  const e = upgrades[key];
  const [readableVal, realVal] = _computeBonusVal(e);

  // explain in words
  const summary = `base ${readableVal}${e.subject}\n  (upgrade level ${e.level})`;

  // enact bonux effect
  _enactBonus(f, global.rootScreen, realVal);

  return [e.icon, summary];
}

/**
 * add and multiply together all the bonuses from
 *  - passive skills and upgrades that have been purchased
 *  - temporary effects ongoing in global.rootScreen.sim
 *
 * finally, apply bonuses by adjusting settings in global.rootScreen.sim
 */
function updateAllBonuses() {

  if (global.upgradeTracks) {

    // compute+apply each bonus, and build summary
    const specs = [
      ['nparticles', (screen, val) => {
        screen.sim.rainGroup.n = val;
      }],

      ['rain_speed', (screen, val) => {
        screen.sim.fallSpeed = val;
      }],

      ['catch_radius', (screen, val) => {
        screen.toolList[0].rad = val;
      }],
    ];
    global.bonusSummary = specs.map((entry) => _updateBonus(...entry));

  }
}
