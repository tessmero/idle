/**
 * @file super-params-spread.cjs
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ObjectExpressions in super arguments must include \'...params\'',
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    return {
      'CallExpression[callee.type="Super"]'(node) {

        node.arguments.forEach((arg) => {
          if (arg.type === 'ObjectExpression') {
            const hasSpreadParams = arg.properties.some((property) =>
              property.type === 'SpreadElement' &&
              property.argument.type === 'Identifier' &&
              property.argument.name === 'params',
            );

            if (!hasSpreadParams) {
              context.report({
                node: arg,
                message: 'ObjectExpressions in super calls must include \'...params\'.',
              });
            }
          }
        });
      },
    };
  },
};
