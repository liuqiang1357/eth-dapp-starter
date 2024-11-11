'use client';

import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils/shadcn';
import { ConnectWallet } from './connect-wallet';
import { SwitchTheme } from './switch-theme';

export const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div className={cn('container flex h-20 items-center justify-between', className)} {...props}>
      <div className="text-2xl">Eth Dapp Starter</div>

      <div className="flex space-x-4">
        <ConnectWallet />
        <SwitchTheme />
      </div>
    </div>
  );
};
