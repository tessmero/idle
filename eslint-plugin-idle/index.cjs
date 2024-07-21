const rule = require("./no-new-singleton.cjs");
const plugin = { rules: { "no-new-singleton": rule } };
module.exports = plugin;