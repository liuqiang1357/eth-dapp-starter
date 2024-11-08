'use client';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { disconnect } from '@wagmi/core';
import { useAtomValue } from 'jotai';
import { ComponentProps, FC } from 'react';
import { accountAtom } from 'lib/states/web3';
import { formatLongText } from 'lib/utils/formatters';
import { cn } from 'lib/utils/shadcn';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Button } from 'ui/shadcn/button';
import { AccountIcon } from './account-icon';

export const ConnectWallet: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const account = useAtomValue(accountAtom);

  const { openConnectModal } = useConnectModal();

  return (
    <div className={cn('inline-flex space-x-4', className)} {...props}>
      {account != null ? (
        <div className="group relative">
          <Button variant="outline" className="flex items-center group-hover:opacity-0">
            <AccountIcon address={account} size={20} />
            <div className="ml-2">{formatLongText(account, { headTailLength: 4 })}</div>
          </Button>
          <Button
            variant="destructive"
            className="absolute inset-0 flex h-auto items-center opacity-0 group-hover:opacity-100"
            onClick={() => disconnect(wagmiConfig)}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={openConnectModal}>
          Connect wallet
        </Button>
      )}
    </div>
  );
};
