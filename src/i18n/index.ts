import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { merge } from 'lodash-es';
import { initReactI18next } from 'react-i18next';

const resources: Resource = {};
const context = require.context('./locales', true, /^\.\/.*\.json$/);

for (const path of context.keys()) {
  const result = path.match(/^\.\/(?<language>[^/]+)\/(?<namespace>.*?)(\/index)?\.json$/);
  if (result?.groups != null) {
    merge(resources, { [result.groups.language]: { [result.groups.namespace]: context(path) } });
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });
