module.exports = { extends: ["@commitlint/config-conventional"] };

// commitlint.config.cjs (versão com repo/workflow permitidos)
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'core','auth','tenant','billing','notifications','audit','files',
      'analytics','admin','web','api','infra','docs',
      // extras liberados:
      'repo','workflow'
    ]],
  },
};
