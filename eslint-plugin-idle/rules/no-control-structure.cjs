/**
 * @file no-control-structure.cjs
 */
const relevantTypes = [
  'IfStatement',
  'ForStatement',
  'WhileStatement',
  'DoWhileStatement',
  'ForInStatement',
  'ForOfStatement',
  'SwitchStatement',
  'TryStatement',
  'WithStatement',
  'ConditionalExpression', // ternary operators (inline if)
  'FunctionExpression', // function expressions
  'ArrowFunctionExpression', // arrow functions
];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow control structures, with optional exceptions',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {

          // optional subset of types to 'allow'
          allow: {
            type: 'array',
            items: {
              type: 'string',
              enum: relevantTypes,
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidControlStructures: 'Control structures are not allowed.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowList = new Set(options.allow || []);

    // Helper function to report nodes
    function report(node) {
      context.report({
        node,
        messageId: 'avoidControlStructures',
      });
    }

    // Create the visitor object, skipping types that are in the allow list
    return Object.fromEntries(
      relevantTypes
        .filter((type) => !allowList.has(type))
        .map((type) => [type, report]),
    );
  },
};
