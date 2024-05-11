
// uset to construct an inverted copy
// of an existing grabber
class InverseGrabber extends Grabber {

  constructor(grabber, f) {
    super(f);

    this.grabberToInverse = grabber;
  }

  contains(...p) {
    return !this.grabberToInverse.contains(...p);
  }
}
