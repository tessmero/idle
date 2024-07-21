
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `shouldn't use "new" keyword with singleton classes`,
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          restrictedClasses: {
            type: 'array',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const restrictedClasses = options.restrictedClasses || [];

    return {
      NewExpression(node) {
        if (node.callee.name && restrictedClasses.includes(node.callee.name)) {
          context.report({
            node,
            message: `should omit "new" because ${node.callee.name} is a singleton.`,
          });
        }
      },
    };
  },
};
