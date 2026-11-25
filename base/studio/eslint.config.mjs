import studio from '@sanity/eslint-config-studio'

export default [
  // Dossiers générés : build du studio, runtime temporaire de la CLI.
  {ignores: ['dist/', '.sanity/', 'node_modules/']},
  ...studio,
  // Scripts exécutés avec Node (ex. `npm run fonts:sync`), pas dans le navigateur.
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
]
