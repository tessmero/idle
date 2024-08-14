/**
 * @file ctor-last-param-default.cjs
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require constructors to define their last parameter as `params = {}`.',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      'MethodDefinition[kind="constructor"] > FunctionExpression'(node) {
        const lastParam = node.params[node.params.length - 1];

        if (
          !lastParam ||
          lastParam.type !== 'AssignmentPattern' ||
          lastParam.left.name !== 'params' ||
          lastParam.right.type !== 'ObjectExpression'
        ) {
          context.report({
            node,
            message: 'The last parameter of the constructor should be `params = {}`.',
          });
        }
      },
    };
  },
};
