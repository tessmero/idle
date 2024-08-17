/**
 * @file ctor-params-jsdoc.cjs
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure destructured properties from `params` are documented in JSDoc comments in constructors',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
    messages: {
      missingJsdoc: 'Destructured property "{{property}}" from `params` is not documented in JSDoc.',
    },
  },
  create(context) {

    function getCtorAncestor(node) {
      let currentNode = node;
      while (currentNode) {
        if (currentNode.type === 'FunctionExpression') {
          return currentNode;
        }
        currentNode = currentNode.parent;
      }
      return null;
    }

    return {

      // Select references to 'params' in constructors
      'MethodDefinition[kind="constructor"] BlockStatement Identifier[name="params"]'(node) {

        // Check if in destructuring assignment
        const parent = node.parent;
        if (
          parent.type === 'VariableDeclarator' &&
          parent.init === node &&
          parent.id.type === 'ObjectPattern'
        ) {

          // get jsdoc comment
          const ctor = getCtorAncestor(node);
          if (!ctor) { return; }
          const jsdocComment = context.getSourceCode().getJSDocComment(ctor);
          if (!jsdocComment) { return; }
          const jsdocText = jsdocComment.value;

          // get list of properties being unpacked
          const destructuredProps = parent.id.properties.map((prop) => prop.key.name);

          // Check if destructured properties are documented in JSDoc
          destructuredProps.forEach((prop) => {
            const jsdocRegex = new RegExp(`@param\\s+\\{.*?\\}\\s+params\\.${prop}`);
            if (!jsdocRegex.test(jsdocText)) {
              context.report({
                node,
                messageId: 'missingJsdoc',
                data: { property: prop },
              });
            }
          });
        }
      },
    };
  },
};
