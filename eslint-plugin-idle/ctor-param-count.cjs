module.exports = {
  meta: {
    type: "problem", // This can be "problem", "suggestion", or "layout"
    docs: {
      description:
        "Enforce that constructors have a specific number of parameters and only the last parameter can have a default value",
      category: "Best Practices",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          count: {
            type: "integer",
            minimum: 0,
            default: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      incorrectParameterCount:
        "Constructor should have exactly {{ count }} parameter(s).",
      defaultValueNotLast:
        "Only the last parameter in the constructor can have a default value.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const expectedParamCount = options.count !== undefined ? options.count : 1;

    return {
      'MethodDefinition[kind="constructor"]'(node) {
        const params = node.value.params;

        // Check the parameter count
        if (params.length !== expectedParamCount) {
          context.report({
            node,
            messageId: "incorrectParameterCount",
            data: {
              count: expectedParamCount,
            },
          });
        }

        // Check if only the last parameter has a default value
        params.forEach((param, index) => {
          if (
            param.type === "AssignmentPattern" &&
            index !== params.length - 1
          ) {
            context.report({
              node: param,
              messageId: "defaultValueNotLast",
            });
          }
        });
      },
    };
  },
};
