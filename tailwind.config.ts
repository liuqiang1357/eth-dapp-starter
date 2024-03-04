import { Config } from 'tailwindcss';
import { COLORS, colorsTupleToMap } from './src/lib/utils/mantine';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      gray: colorsTupleToMap(COLORS.gray),
      green: colorsTupleToMap(COLORS.green),
      red: colorsTupleToMap(COLORS.red),
      yellow: colorsTupleToMap(COLORS.yellow),
    },
  },
  corePlugins: {
    preflight: false,
  },
};

export default config;
