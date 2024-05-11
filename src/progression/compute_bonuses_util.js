
// called in updateAllBonuses
// compute value and
// apply conversion if applicable (human readable -> internal units)
function _computeBonusVal(e) {
  const readableVal = e.value.f(e.level - 1);
  let realVal = readableVal;
  if (e.getReadableValue) { realVal = e.getReadableValue(readableVal); }
  return [readableVal, realVal];
}

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

// add and multiply together all the bonuses from
//  - passive skills and upgrades that have been purchased
//  - temporary effects ongoing in global.mainSim
//
// finally, apply bonuses by adjusting settings in global.mainSim
function updateAllBonuses() {

  if (global.upgradeTracks) {

    // compute+apply each bonus, and build summary
    const specs = [
      ['nparticles', (val) => {
        global.mainSim.rainGroup.n = val;
      }],

      ['rain_speed', (val) => {
        global.mainSim.fallSpeed = val;
      }],

      ['catch_radius', (val) => {
        global.toolList[0].rad = val;
      }],
    ];
    global.bonusSummary = specs.map((entry) => _updateBonus(...entry));

  }

  if (global.screenRect) { rebuildGuis(); }
}
