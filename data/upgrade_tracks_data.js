/**
 * @file UPGRADE_TRACKS data for purchasable global upgrades.
 */
const UPGRADE_TRACKS = () => ({
  'nparticles': {
    triggers: ['attemptedFirstRiu', 'purchasedFirstRiu'], // story hooks to be triggered
    label: 'rain amount',
    subject: ' raindrops',
    icon: rainIcon,
    level: 1,
    maxLevel: 6,
    cost: ValueCurve.power(200, 2.5),
    value: ValueCurve.power(100, 2),
  },
  'rain_speed': {
    triggers: ['attemptedFirstRiu', 'purchasedFirstRiu'],
    label: 'rain speed',
    subject: ' m/s rain',
    icon: rainIcon,
    level: 1,
    maxLevel: 3,
    cost: ValueCurve.power(1000, 10),
    value: ValueCurve.linear(10, 10),
    getRealVal: (v) => v * 3e-5, // (human readable => internal units)
  },
  'catch_radius': {
    isRiu: false,
    label: 'catch radius',
    subject: ' m catch range',
    icon: catchRadiusIcon,
    level: 1,
    maxLevel: 10,
    cost: ValueCurve.power(50, 2),
    value: ValueCurve.linear(1, 1),
    getRealVal: (v) => v * 2.5e-3, // (human readable => internal units)
  },
});
