/**
 * @file static-class.cjs
 * Used to restict access to parser classes
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Restricts class usage to calling lowerCamelCase static functions.',
      category: 'Best Practices',
      recommended: false,
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
    const restrictedClasses = new Set(context.options[0]?.restrictedClasses || []);
    const lowerCamelRegex = /^[a-z][a-zA-Z0-9]*$/;

    return {

      // find all usages of restricted class names
      Identifier(node) {
        if (restrictedClasses.has(node.name)) {

          // allow 'class' declaration
          if (node.parent.type === 'ClassDeclaration') { return; }

          // allow calling lowerCamelCase static function
          if (node.parent.type === 'MemberExpression' &&
            node.parent.parent.type === 'CallExpression' &&
            lowerCamelRegex.test(node.parent.property.name)) {

            return;
          }

          // all other usages are invalid
          context.report({
            node,
            message: `Class "${node.name}" can only be used to call a static function.`,
          });
        }

      },
    };
  },
};
