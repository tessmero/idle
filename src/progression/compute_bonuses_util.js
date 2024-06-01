
/**
 * called in updateAllBonuses
 * compute value and
 * apply conversion if applicable (human readable -> internal units)
 * @param e
 */
function _computeBonusVal(e) {
  const readableVal = e.value.f(e.level - 1);
  let realVal = readableVal;
  if (e.getReadableValue) { realVal = e.getReadableValue(readableVal); }
  return [readableVal, realVal];
}

/**
 *
 * @param key
 * @param f
 */
function _updateBonus(key, f) {

  // compute bonus
  const upgrades = global.upgradeTracks.state;
  const e = upgrades[key];
  const [readableVal, realVal] = _computeBonusVal(e);

  // explain in words
  const summary = `base ${readableVal}${e.subject}\n  (upgrade level ${e.level})`;

  // enact bonus
  f(realVal);

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
      ['nparticles', (val) => {
        global.rootScreen.sim.rainGroup.n = val;
      }],

      ['rain_speed', (val) => {
        global.rootScreen.sim.fallSpeed = val;
      }],

      ['catch_radius', (val) => {
        global.rootScreen.sim.toolList[0].rad = val;
      }],
    ];
    global.bonusSummary = specs.map((entry) => _updateBonus(...entry));

  }
}
