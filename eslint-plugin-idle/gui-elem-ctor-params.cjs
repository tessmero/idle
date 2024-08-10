// used in combination with ctor-last-param-default
// to enforce gui element constructors like constructor(rect,params={})
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require constructors to have exactly two parameters with the first not having a default value.',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      'MethodDefinition[kind="constructor"]'(node) {
        const params = node.value.params;
        const numParams = params.length;

        // Check if the number of parameters is exactly 2
        if (numParams !== 2) {
          context.report({
            node,
            message: 'Constructor should have exactly two parameters.',
          });
          return; // Skip further checks if the parameter count is incorrect
        }

        // Check if the first parameter has a default value
        const firstParam = params[0];
        if (firstParam.type === 'AssignmentPattern') {
          context.report({
            node: firstParam,
            message: 'The first parameter of the constructor should not have a default value.',
          });
        }
      }
    };
  },
};