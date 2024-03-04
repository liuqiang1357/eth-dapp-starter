'use client';

import { ComponentProps, FC } from 'react';
import { tm } from 'lib/utils/tailwind';
import { Connect } from './Connect';

export const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div className={tm('flex h-20 items-center justify-between px-10', className)} {...props}>
      <h2>Eth Dapp Starter</h2>
      <Connect />
    </div>
  );
};
