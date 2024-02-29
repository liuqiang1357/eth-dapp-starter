'use client';

import { ComponentProps, FC } from 'react';
import { tm } from 'lib/utils/tailwind';
import { Chains } from './Chains';
import { Wallets } from './Wallets';

export const Header: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  return (
    <div
      className={tm('flex items-center justify-between px-[40px] py-[20px]', className)}
      {...rest}
    >
      <h2 className="my-0">Eth Dapp Starter</h2>

      <div className="flex">
        <Wallets />
        <Chains className="ml-[10px]" />
      </div>
    </div>
  );
};
