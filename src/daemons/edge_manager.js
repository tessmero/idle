/**
 * @file EdgeManager manages distinct edge shapes
 * that may interact with particles.
 */
function EdgeManager() {
  if (EdgeManager._instance) {
    return EdgeManager._instance;
  }
  if (!(this instanceof EdgeManager)) {
    // eslint-disable-next-line idle/no-new-singleton
    return new EdgeManager();
  }
  EdgeManager._instance = this;

  // start EdgeManager constructor
  this.constructedEdges = new Map();
  this.allowedPrefixes = [
    'mini', // shapes in tutorials with Global.tutorialScaleFactor
  ];

  /**
   * Called in Edge constructor.
   * @param {Edge} edge The new instance to register.
   */
  this.submitNewEdge = function(edge) {
    const key = edge.titleKey;

    // check if key has prefix
    const parts = key.split(' ');
    if (parts.length > 1) {
      const prefix = parts[0];
      if (!this.allowedPrefixes.includes(prefix)) {
        throw new Error(`invalid titleKey '${key}'`);
      }
    }
    if (!key) {
      throw new Error('edge has no titleKey');
    }
    const ce = this.constructedEdges;
    if (ce.has(key)) {
      throw new Error(`edge shape (${key}) constructed multiple times`);
    }
    ce.set(key, edge);
  };

  this.hasEdge = function(titleKey) {
    return this.constructedEdges.has(titleKey);
  };

  this.getEdge = function(titleKey) {
    return this.constructedEdges.get(titleKey);
  };
}
