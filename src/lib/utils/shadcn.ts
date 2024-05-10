import { ClassValue, clsx } from 'clsx';
import { tm } from './tailwind';

export function cn(...inputs: ClassValue[]) {
  return tm(clsx(inputs));
}
