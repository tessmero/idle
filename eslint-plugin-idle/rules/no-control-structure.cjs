/**
 * @file no-control-structs.cjs
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow control structures',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // no options
    messages: {
      avoidControlStructures: 'Control structures are not allowed.',
    },
  },
  create(context) {

    // Helper function to report nodes
    function report(node) {
      context.report({
        node,
        messageId: 'avoidControlStructures',
      });
    }

    // Define visitors for control structures, inline if-statements, and function definitions
    return {
      IfStatement: report,
      ForStatement: report,
      WhileStatement: report,
      DoWhileStatement: report,
      ForInStatement: report,
      ForOfStatement: report,
      SwitchStatement: report,
      TryStatement: report,
      WithStatement: report,
      ConditionalExpression: report, // ternary operators (inline if)
      FunctionExpression: report, // function expressions
      ArrowFunctionExpression: report, // arrow functions
    };
  },
};
