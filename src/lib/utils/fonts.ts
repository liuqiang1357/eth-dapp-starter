import { Roboto_Mono as FontMono, Manrope as FontSans } from 'next/font/google';
import { cn } from './shadcn';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = FontMono({ subsets: ['latin'], variable: '--font-mono' });

export const fontsClassName = cn(fontSans.variable, fontMono.variable);
