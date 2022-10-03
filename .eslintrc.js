module.exports = {
  root: true,
  dev: {
    useEslint: false,
  },
  env: {
    node: true,
  },
  parserOptions: {
    sourceType: "babel-eslint",
  },
  rules: {},
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
};
