import { filterDeep } from 'deepdash-es/standalone';

export function omitUndefined<T>(data: T): T {
  return filterDeep(data, value => (value === undefined ? false : true), {
    leavesOnly: true,
  });
}
