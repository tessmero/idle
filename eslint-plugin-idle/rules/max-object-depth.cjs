/**
 * @file max-object-depth.cjs
 *
 * used in data/eslint.config.data.cjs to restrict layout css objects
 *
 * different from eslint max-depth rule, which only considers control structures and not object expressions
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Limit the depth of nested object expressions',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxDepth: {
            type: 'integer',
            minimum: 1,
          },
        },
        required: ['maxDepth'],
        additionalProperties: false,
      },
    ],
    messages: {
      excessiveDepth: 'Object expression exceeds maximum allowed depth of {{maxDepth}}.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxDepth } = options;

    return {
      ObjectExpression(node) {
        let depth = 0;
        let currentNode = node;
        while (currentNode) {
          currentNode = currentNode.parent;
          if (currentNode && currentNode.type === 'ObjectExpression') {
            depth = depth + 1;
          }
          if (depth > maxDepth) {
            context.report({
              node,
              messageId: 'excessiveDepth',
              data: { maxDepth },
            });
            return;
          }
        }
      },
    };
  },
};
