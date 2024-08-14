/**
 * @file valid-var-name.cjs
 * used in data/eslint.config.data.cjs to enforce naming conventions for layout objects.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Restrict variable names to match specified patterns',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          patterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1,
          },
          description: {
            type: 'string',
          },
        },
        required: ['description', 'patterns'],
        additionalProperties: false,
      },
    ],
    messages: {
      invalidVariableName: 'Invalid variable name `{{name}}`. Should be `{{description}}`.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const patterns = options.patterns || [];
    const description = options.description || '';

    function isValidName(name) {
      return patterns.some((pattern) => new RegExp(pattern).test(name));
    }

    return {
      Identifier(node) {
        if (node.parent.type === 'AssignmentExpression') {
          if (!isValidName(node.name)) {
            context.report({
              node,
              messageId: 'invalidVariableName',
              data: {
                name: node.name,
                description,
              },
            });
          }
        }
      },
    };
  },
};
