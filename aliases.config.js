const path = require("path");
const fs = require("fs");
const prettier = require("prettier");

const aliases = {
  "@": ".",
  "@src": "src",
  "@router": "src/router",
  "@views": "src/router/views",
  "@layouts": "src/router/layouts",
  "@components": "src/components",
  "@assets": "src/assets",
  "@utils": "src/utils",
  "@state": "src/state",
  "@design": "src/design",
};

module.exports = {
  webpack: {},
};

for (const alias in aliases) {
  const aliasTo = aliases[alias];
  module.exports.webpack[alias] = resolveSrc(aliasTo);
}

function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}
