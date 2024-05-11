class StarEdge extends RadspecEdge {

  constructor(n, minRad, maxRad) {
    super();
    this.n = n;
    this.minRad = minRad;
    this.maxRad = maxRad;
  }

  computeRadius(angle) {
    const mi = this.minRad;
    const ma = this.maxRad;
    const n = this.n;

    return mi + (ma - mi) * (1 + 0.5 * Math.sin(angle * n));
  }

}
