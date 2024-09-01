/**
 * @file no-var-keywords.cjs
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow the use of any variable declaration keywords in the data folder',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // no options
    messages: {
      noVariableKeywords: 'should omit `{{kind}}`.',
    },
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        // Report any instance of a variable declaration, regardless of the keyword used
        // (var, let, const)
        context.report({
          node,
          messageId: 'noVariableKeywords',
          data: { kind: node.kind },
        });
      },
    };
  },
};
