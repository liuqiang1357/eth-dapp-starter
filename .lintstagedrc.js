const { ESLint } = require('eslint');

const eslint = new ESLint();

async function removeIgnoredFiles(files) {
  const ignoreds = await Promise.all(
    files.map(file => {
      return eslint.isPathIgnored(file);
    }),
  );
  const filteredFiles = files.filter((_, i) => !ignoreds[i]);
  return filteredFiles.join(' ');
}

module.exports = {
  '*.{js,jsx,ts,tsx}': async files => {
    const filesToLint = await removeIgnoredFiles(files);
    return [`eslint --max-warnings 0 ${filesToLint}`];
  },
};
