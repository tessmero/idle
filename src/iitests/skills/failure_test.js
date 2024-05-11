class FailureTest extends SkillCardTest {

  constructor() {
    super(new SnowSkill());
  }

  getDuration() {
    return 10000;
  }

  getTitle() {
    return 'Failure';
  }

  getTestAssertions(sim) {

    const result = [
      [1000, '>10 edge particles', () => sim.edgeGroup.countActiveParticles() > 10],
    ];

    const lines = randChoice([
      [
        'try again',
      ],
      [
        'you are not',
        'the raincatcher',
      ],
      [
        'failure is part',
        'of success',
      ],
    ]);

    lines.forEach((l) => {
      const t = result.at(-1)[0] + 1000;
      result.push([t, l, () => false]);
    });

    return result;
  }
}
