/**
 * @file SKILL_TREE data for skill tree gui in sandbox mode
 */
const SKILL_TREE = {
  basicRain: {
    skill: 'basicRain',
    pos: [0.5, 0.7], // position in gui
    status: 'purchased',
  },

  fastRain: {
    skill: 'fastRain',
    requires: 'basicRain',
    precludes: 'snow',
    pos: [0.3, 0.5],
    status: 'available',
  },

  snow: {
    skill: 'snow',
    requires: 'basicRain',
    precludes: 'fastRain',
    pos: [0.7, 0.5],
    status: 'available',
  },

  fastRain2: {
    skill: 'fastRain2',
    requires: 'fastRain',
    pos: [0.3, 0.3],
    status: 'locked',
  },

  snow2: {
    skill: 'snow2',
    requires: 'snow',
    pos: [0.7, 0.3],
    status: 'locked',
  },
};
