
/**
 * @file StartMessage stage in the middle of (start menu -> playing) transition
 *
 * during this stage a message is visible in the middle of the screen.
 */
class StartMessage extends StartAnimStage {

  /**
   *
   */
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

  }

  /**
   *
   * @param g
   * @param rect
   */
  draw(g, rect) {

    // black background
    const sr = rect;
    g.fillStyle = global.colorScheme.fg;
    g.fillRect(...sr);

    // draw text
    const sld = this.pickTextSolidity();
    if (sld > 0) {
      const label = this.text;
      const center = true;
      resetRand(this.rngSeed);
      const scale = 0.3 * rect[2];
      const fontSpec = new DissolvingFontSpec(0, scale, true);
      fontSpec.solidity = sld;
      drawText(g, ...rectCenter(...rect), label, center, fontSpec);
    }
  }

  /**
   *
   */
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
