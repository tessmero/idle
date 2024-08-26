/**
 * @file valid-layout-rect.cjs
 *
 * used to validate css rulesets in data/gui-layouts
 * used in combination with max-object-depth and valid-key
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure css rulesets represent valid layout rectangles',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {

    // helper to count array/object depth following idle convention
    const relevantTypes = new Set(['ObjectExpression', 'ArrayExpression']);
    function getDepth(node) {
      let depth = 0;
      let currentNode = node;
      while (currentNode) {
        currentNode = currentNode.parent;
        if (currentNode && relevantTypes.has(currentNode.type)) {
          depth = depth + 1;
        }
      }
      return depth;
    }

    return {
      ObjectExpression(node) {
        if (getDepth(node) === 1) {
          node.properties.forEach((property, i) => {
            if (property.key) {
              const key = property.key.type === 'Literal' ? property.key.value : property.key.name;

              if (key === 'parent') {

                // if parent is given it must be the first rule
                if (i !== 0) {
                  context.report({
                    node: property,
                    message: 'if parent is used it must be first rule',
                  });
                }

                // parent must be a string in quotes
                if (property.value.type !== 'Literal') {
                  context.report({
                    node: property.value,
                    message: 'parent must be a ruleset name in quotes',
                  });
                }
              }
            }
          });
        }
      },
    };
  },
};
