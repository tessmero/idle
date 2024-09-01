/**
 * @file this-no-public.cjs
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce accessing only private variables using `this`.',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // no options
    messages: {
      privateVarOnly: 'Only private variables (starting with `#`) can be accessed with `this`.',
      privateMethodOnly: 'Only `_lowerCamelCase` protected methods can be called with `this`.',
    },
  },
  create(context) {
    return {
      // Selects MemberExpression where the object is 'this'
      'MemberExpression[object.type="ThisExpression"]'(node) {

        // Check if the property name is prepended with '#'
        if (node.property.type !== 'PrivateIdentifier') {

          // check if calling a method
          if (node.parent.type === 'CallExpression') {

            // only allow private helper functions with underscore
            const regex = /^_[a-z][a-zA-Z0-9]*$/; // _lowerCamelCase
            if (!regex.test(node.property.name)) {
              context.report({
                node,
                messageId: 'privateMethodOnly',
              });
            }

          }
          else {

            // not calling a method and no '#' prepended
            context.report({
              node,
              messageId: 'privateVarOnly',
            });
          }
        }
      },
    };
  },
};
