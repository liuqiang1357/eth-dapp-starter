import { createTheme } from '@mantine/core';
import { tw } from './tailwind';

export const theme = createTheme({
  activeClassName: tw`transition-all duration-[50ms] active:scale-[0.97]`,
});
