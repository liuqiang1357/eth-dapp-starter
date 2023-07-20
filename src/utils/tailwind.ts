import { extendTailwindMerge } from 'tailwind-merge';

export const tw = String.raw;

export const tm = extendTailwindMerge({
  conflictingClassGroups: {
    'arbitrary..text-align': ['text-alignment'],
    'text-alignment': ['arbitrary..text-align'],
  },
});
