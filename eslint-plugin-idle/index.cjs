const plugin = { 
  rules: { 

    "no-new-singleton": require("./no-new-singleton.cjs"),
    "ctor-last-param-default": require("./ctor-last-param-default.cjs"),
    "ctor-params-destructure": require("./ctor-params-destructure.cjs"),
    "ctor-params-super-args": require("./ctor-params-super-args.cjs"),
    "ctor-param-count": require("./ctor-param-count.cjs"),
    "super-params-spread": require("./super-params-spread.cjs"),
  } 
};
module.exports = plugin;