class CircleEdge extends RadspecEdge {

  constructor(rad) {
    super();
    this.rad = rad;
  }

  getCircumference() {
    return twopi * this.rad;
  }

  computeRadius(_a) {
    return this.rad;
  }

}
