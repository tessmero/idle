
/**
 * @file UpgradeTracks object type
 *
 * progression tree and state for purchasable upgrades
 *
 * instance is global.upgradeTracks
 */
class UpgradeTracks {

  #vcKeys = ['cost', 'value'];

  /**
   *
   */
  constructor() {

    this.state = UPGRADE_TRACKS;

    // make sure data is parsed
    for (const [_key, entry] of Object.entries(this.state)) {
      if (!(entry.icon instanceof Icon)) {
        entry.icon = window[`${entry.icon}Icon`];
      }
      this.#vcKeys.forEach((vc) => {
        if (!(entry[vc] instanceof ValueCurve)) {
          entry[vc] = ValueCurve.fromParams(...entry[vc]);
        }
      });
    }
  }
}
