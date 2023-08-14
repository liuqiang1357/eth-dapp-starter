import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { merge } from 'lodash-es';
import { initReactI18next } from 'react-i18next';

const resources: Resource = {};
const locales = import.meta.glob('./locales/**/*.json', { eager: true });

for (const path of Object.keys(locales)) {
  const result = path.match(/^\.\/locales\/(?<language>[^/]+)\/(?<namespace>.*?)(\/index)?\.json$/);
  if (result?.groups) {
    merge(resources, {
      [result.groups.language]: { [result.groups.namespace]: (locales[path] as any).default },
    });
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
