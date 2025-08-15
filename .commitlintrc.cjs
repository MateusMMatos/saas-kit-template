module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'core','auth','tenant','billing','notifications','audit','files','analytics','admin','web','api','infra','docs'
    ]]
  }
};
