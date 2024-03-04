import { Manrope, Roboto_Mono } from 'next/font/google';
import { tm } from './tailwind';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const fontsClassName = tm(manrope.className, manrope.variable, robotoMono.variable);
