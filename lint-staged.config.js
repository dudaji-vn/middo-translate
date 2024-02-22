module.exports = {
  '**/*.ts?(x)': () => 'npm run type:check',
  '*.{json,yaml}': ['prettier --write'],
};
