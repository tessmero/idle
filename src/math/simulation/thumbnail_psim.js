// extra small particle simulation that appears in the gui
// control points will be removed from bodies
//
// displayed using a GuiScreenPanel instance
class ThumbnailPSim extends ParticleSim {
  constructor() {
    super(1e4, [0, 0, ...global.thumbnailSimDims], 'Extra Small Thumbnail Simulation');

    this.fallSpeed = this.fallSpeed * 0.2;
    this.particleRadius = this.particleRadius * 0.6;

    // adjust procedural group settings
    const rg = this.rainGroup;
    rg.wiggle = rg.wiggle * 0.15;
    rg.n = rg.n * 0.005;

    this.reset();
  }

  reset() {
    super.reset();

    // add stable poi in center
    const p = v(...rectCenter(...this.rect));
    const poi = new CircleBody(this, p, 2e-2);
    this.addBody(poi);
  }
}
