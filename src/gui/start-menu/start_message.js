// message appears in the middle of the
// (start menu -> playing) transition sequence
class StartMessage extends StartAnimStage {

  constructor() {
    super();

    // rng for dissolving effect
    this.rngSeed = randomSeed();

    // durations of segments
    const sd = [
      500, // 0 black screen
      200, // 1 text fades in
      2000, // 2 text readable
      500, // 3 text fades out
      0, // 4 black screen
    ];

    // compute start time for each segment
    // compute total duration
    let total = 0;
    const sst = [];
    for (let i = 0; i < sd.length; i++) {
      sst[i] = total;
      total = total + sd[i];
    }
    this.segDurations = sd;
    this.segStartTimes = sst;
    this.duration = total;

    this.text = randChoice([
      'you are the raincatcher',
    ]);

    const scale = 0.6;
    this.fontSpec = new DissolvingFontSpec(0, scale, true);

  }

  // override
  draw(g) {

    // black background
    const sr = global.screenRect;
    g.fillStyle = global.colorScheme.fg;
    g.fillRect(...sr);

    // draw text
    const sld = this.pickTextSolidity();
    if (sld > 0) {
      const label = this.text;
      const center = true;
      this.fontSpec.solidity = sld;
      resetRand(this.rngSeed);
      drawText(g, 0.5, 0.5, label, center, this.fontSpec);
    }
  }

  pickTextSolidity() {

    // identify which animation segment we are in
    const t = this.t;
    const sst = this.segStartTimes;
    const sd = this.segDurations;
    const currentSegIndex = -1 + sst.findIndex((st) => st > t);
    const r = (t - sst[currentSegIndex]) / sd[currentSegIndex];

    switch (currentSegIndex) {
    case 1:
      return r; // text appearing

    case 2:
      return 1; // text readable

    case 3:
      return 1 - r; // text disappearing

    default:
      return 0; // black screen
    }
  }
}
