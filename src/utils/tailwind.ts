import { DefaultClassGroupIds, extendTailwindMerge } from 'tailwind-merge';

export const tw = String.raw;

export const tm = extendTailwindMerge({
  extend: {
    conflictingClassGroups: {
      ['arbitrary..text-align' as DefaultClassGroupIds]: ['text-alignment'],
      'text-alignment': ['arbitrary..text-align' as DefaultClassGroupIds],
    },
  },
});
