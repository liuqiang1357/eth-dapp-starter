import { extendTailwindMerge } from 'tailwind-merge';

export function tw(strings: TemplateStringsArray, ...keys: any[]): string {
  return keys.reduce((acc, key, i) => acc + strings[i] + key, '') + strings[keys.length];
}

export const tm = extendTailwindMerge({
  conflictingClassGroups: {
    'arbitrary..text-align': ['text-alignment'],
    'text-alignment': ['arbitrary..text-align'],
  },
});
