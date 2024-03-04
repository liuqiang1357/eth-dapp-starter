import { createTheme, DEFAULT_THEME, MantineColorsTuple, mergeMantineTheme } from '@mantine/core';

export const COLORS = {
  ...DEFAULT_THEME.colors,
} as const;

export function colorsTupleToMap(array: MantineColorsTuple): Record<number, string> {
  return array.reduce((map, color, index) => ({ ...map, [index]: color }), {});
}

const themeOverride = createTheme({
  colors: COLORS,
  primaryColor: 'blue',
});

export const mantineTheme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
