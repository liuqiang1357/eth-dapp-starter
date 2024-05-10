import { Roboto_Mono as FontMono, Manrope as FontSans } from 'next/font/google';
import { tm } from './tailwind';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = FontMono({ subsets: ['latin'], variable: '--font-mono' });

export const fontsClassName = tm(fontSans.className, fontSans.variable, fontMono.variable);
