
/**
 * @file UpgradeTracks object type
 *
 * progression tree and state for purchasable upgrades
 *
 * instance is global.upgradeTracks
 */
class UpgradeTracks {

  /**
   *
   */
  constructor() {
    this.state = {
      'nparticles': {
        label: 'rain amount',
        subject: ' raindrops',
        icon: rainIcon,
        level: 1,
        maxLevel: 6,
        cost: ValueCurve.power(200, 2.5),
        value: ValueCurve.power(100, 2),
      },
      'rain_speed': {
        label: 'rain speed',
        subject: ' m/s rain',
        icon: rainIcon,
        level: 1,
        maxLevel: 3,
        cost: ValueCurve.power(1000, 10),
        value: ValueCurve.linear(10, 10),
        getReadableValue: (v) => v * 3e-5, // (human readable => internal units)
      },
      'catch_radius': {
        label: 'catch radius',
        subject: ' m catch range',
        icon: catchRadiusIcon,
        level: 1,
        maxLevel: 10,
        cost: ValueCurve.power(50, 2),
        value: ValueCurve.linear(1, 1),
        getReadableValue: (v) => v * 2.5e-3, // (human readable => internal units)
      },
    };
  }
}
