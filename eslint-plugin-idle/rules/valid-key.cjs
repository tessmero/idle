/**
 * @file valid-key.cjs
 *
 * used in data/eslint.config.data.cjs to enforce naming conventions and css keywords
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure keys in object expressions match specific patterns at a certain depths',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            depth: {
              type: 'integer',
              minimum: 0,
            },
            patterns: {
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
              },
            },
            description: {
              type: 'string',
            },
          },
          required: ['depth', 'patterns', 'description'],
          additionalProperties: false,
        },
        minItems: 1,
      },
    ],
    messages: {
      invalidKeyword: 'Invalid key `{{key}}` at depth {{depth}}. Should be {{description}}.',
    },
  },

  create(context) {
    const options = context.options[0] || [];

    function match(key, patterns) {
      return patterns.some((pattern) => new RegExp(pattern).test(key));
    }

    function getDepth(node) {
      let depth = 0;
      let currentNode = node;
      while (currentNode) {
        currentNode = currentNode.parent;
        if (currentNode && currentNode.type === 'ObjectExpression') {
          depth = depth + 1;
        }
      }
      return depth;
    }

    return {
      ObjectExpression(node) {
        const nodeDepth = getDepth(node);
        options.forEach(({ depth, patterns, description }) => {
          if (nodeDepth === depth) {
            node.properties.forEach((property) => {
              if (property.key) {
                const key = property.key.type === 'Literal' ? property.key.value : property.key.name;

                if (!match(key, patterns)) {
                  context.report({
                    node: property,
                    messageId: 'invalidKeyword',
                    data: {
                      key,
                      depth: nodeDepth,
                      description,
                    },
                  });
                }
              }
            });
          }
        });
      },
    };
  },
};
