import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'dev-dist/**/*', 'android/**/*', 'node_modules/**/*', 'coverage/**/*'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
