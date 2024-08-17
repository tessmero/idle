/**
 * @file UPGRADE_TRACKS data for purchasable global upgrades.
 */
UPGRADE_TRACKS = {
  'nparticles': {
    beforeCard: ((screen) => {
      screen.sim.rainGroup.n = 10;
    }),
    afterCard: ((screen) => {
      screen.sim.rainGroup.n = 100;
    }),
    rootScreenOnly: true, // prevent adding procedural particles to black boxes
    triggers: ['attemptedRainIncrease', 'purchasedRainIncrease'], // story hooks to be triggered
    label: 'Rain Amount',
    subject: ' raindrops',
    icon: 'rain',
    level: 1,
    maxLevel: 6,
    cost: ['power', 200, 2.5],
    value: ['power', 100, 2],
  },
  'rain_speed': {
    beforeCard: ((_screen) => {
    }),
    afterCard: ((screen) => {
      screen.sim.fallSpeed = 3e-4;
    }),
    triggers: ['attemptedRainIncrease', 'purchasedRainIncrease'],
    label: 'Fall Speed',
    subject: ' m/s rain',
    icon: 'rain',
    level: 1,
    maxLevel: 3,
    cost: ['power', 1000, 10],
    value: ['linear', 10, 10], // readable "meters"
    internalValueMultiplier: 3e-5, // readable "meters" -> distance units
  },
  'catch_radius': {
    beforeCard: ((screen) => {
      screen.macro = screen._defaultTut; // set in upgrade_tooltip.js
      screen.setTool(screen.toolList[0]);
      screen.toolList[0].rad = 0.01;
    }),
    afterCard: ((screen) => {
      screen.macro = screen._defaultTut;
      screen.toolList[0].rad = 0.02;
      screen.setTool(screen.toolList[0]);
    }),
    label: 'Catch Range',
    subject: ' m catch range',
    icon: 'catchRadius',
    level: 1,
    maxLevel: 10,
    cost: ['power', 50, 2],
    value: ['power', 10, 1.1],
    internalValueMultiplier: 5e-3,
  },
};
