// static flat surface body
class CompassBody extends Body {
  constructor(sim, pos) {
    super(sim, pos);

    //
    this.title = 'compass';
    this.icon = increaseIcon;
  }

  update(dt, ...p) {
    this.spin(-1e-6 * dt);
    return super.update(dt, ...p);
  }

  buildEdge() {

    const a = 1;
    const b = 5;
    const scale = 3e-2;

    let verts = [
      [0, b], [a, a],
      [b, 0], [a, -a],
      [0, -b], [-a, -a],
      [-b, 0], [-a, a],
    ];

    verts = verts.map((xy) => v(...xy).mul(scale));

    return new PolygonEdge(verts.reverse());
  }

  buildGrabber() {
    return new EdgeGrabber(
      this.pos, this.angle, this.edge,
      (...p) => this.grabbed(...p), 0);
  }

}
