module.exports = {
  webpack: {
    configure: config => {
      // Fix import outside src, see https://stackoverflow.com/a/60353355
      const scopePluginIndex = config.plugins.findIndex(plugin => {
        return plugin.constructor && plugin.constructor.name === 'ModuleScopePlugin';
      });
      config.resolve.plugins.splice(scopePluginIndex, 1);

      // Hide source map warnings
      config.ignoreWarnings = [/Failed to parse source map/];

      return config;
    },
  },
};
