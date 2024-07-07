import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
    singleQuote: true,
    indent: 2,
  },
  // 'no-console': ['error', { allow: ['warn', 'error'] }],
  // 'unused-imports/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

  vue: true,
  // TODO: This doesn't seem to work, but don't want to keep looking into
  // linting for now.
  // typescript: {
  //   tsconfigPath: 'tsconfig.json',
  // },
  typescript: true,

},
// TODO: We can probably try using 'stroustrup' for a while.
// {
//   // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
//   files: ['**/*.vue'],
//   rules: {
//     'vue/brace-style': ['error', '1tbs'],
//   },
// }
);
