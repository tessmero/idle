module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: `Constructor parameters must be passed to super in the same order, 
      except the last super arg may be replaced with an ObjectExpression`,
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    return {
      'MethodDefinition[kind="constructor"]'(node) {

        // skip if any rest element (...) in parameters
        if( node.value.params.some(param => param.type === 'RestElement') ) return

        const constructorParams = node.value.params.map(param => param.left ? param.left.name : param.name );
        const lastIndex = constructorParams.length - 1;
        let superCalled = false;
        let superCallArgs = []; // name strings (or true to indicate object expression)

        node.value.body.body.forEach(bodyNode => {
          if (bodyNode.type === "ExpressionStatement" && bodyNode.expression.type === "CallExpression") {
            const callee = bodyNode.expression.callee;
            if (callee.type === "Super") {
              superCalled = true;
              superCallArgs = bodyNode.expression.arguments.map(arg => arg.name || arg.type==="ObjectExpression");
            }
          }
        });

        if( !superCalled ){ return; }

        if (constructorParams.length !== superCallArgs.length || !constructorParams.every(
            (param, index) => param === superCallArgs[index] || (index===lastIndex && superCallArgs[index])
          )) {
            context.report({
              node,
              message: "Constructor arguments must be passed to super in the same order."
            });
        }
      }
    };
  }
};
