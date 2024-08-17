/**
 * @file ctor-params-destructure.cjs
 */

module.exports = {

  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow accessing \'params\' in constructors without using destructuring',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {

      // select references to 'params' in constructors
      'MethodDefinition[kind="constructor"] BlockStatement Identifier[name="params"]'(node) {

        // Check if in 'super' call
        let currentNode = node;
        while (currentNode) {
          if (currentNode.type === 'CallExpression' && currentNode.callee.type === 'Super') {
            return; // Ignore 'params' if it's used in a 'super' call
          }
          currentNode = currentNode.parent;
        }

        // Allow destructuring, e.g., `const { prop } = params;`
        const parent = node.parent;
        if (
          parent.type === 'VariableDeclarator' &&
          parent.init === node &&
          parent.id.type === 'ObjectPattern'
        ) {
          return; // Ignore destructuring assignments
        }

        context.report({
          node,
          message: 'Constructors should only access \'params\' using destructuring.',
        });
      },
    };
  },
};
