/**
 * @file BorderManager manages some special borders for gui elements.
 * Used to cache detailed border shapes for fixed size rectangles.
 */
function BorderManager() {
  if (BorderManager._instance) {
    return BorderManager._instance;
  }
  if (!(this instanceof BorderManager)) {
    // eslint-disable-next-line idle/no-new-singleton
    return new BorderManager();
  }
  BorderManager._instance = this;

  // start BorderManager constructor
  this.cachedVerts = new Map();

  /**
   * Cache a border shape intended for rectangles with fixed width/height.
   * Called in verts() method for special border instances.
   * @param {string} titleKey The readable unique key for the shape.
   * @param {number[]} rect The rectangle verts were aligned in, to check width/height
   * @param {Vector[]} verts The vertices tracing the shape.
   */
  this.submitNewBorder = function(titleKey, rect, verts) {
    const cv = this.cachedVerts;
    if (cv.has(titleKey)) {
      throw new Error(`border shape (${titleKey}) cached multiple times`);
    }
    cv.set(titleKey, { rect, verts });
  };

  /**
   * Check if border shape has already been computed.
   * Called in verts() method for special border instances.
   * @param {string} titleKey The readable unique key for the shape.
   */
  this.hasBorder = function(titleKey) {
    return this.cachedVerts.has(titleKey);
  };

  /**
   * Called in verts() method for special border instances.
   * @param {string} titleKey The readable unique key for the shape.
   * @returns {object} The rect,verts that were previously submitted
   */
  this.getBorder = function(titleKey) {
    return this.cachedVerts.get(titleKey);
  };
}
