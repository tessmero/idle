
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using new keyword with singleton classes',
      recommended: true,
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
    ],
  },
  create(context) {
    const restrictedClasses = context.options[0] || [];

    return {
      NewExpression(node) {
        if (node.callee.name && restrictedClasses.includes(node.callee.name)) {
          context.report({
            node,
            message: `'new' is unecessary and misleading because ${node.callee.name} is a singleton.`,
          });
        }
      },
    };
  },
};
