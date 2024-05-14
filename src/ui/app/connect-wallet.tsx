'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { disconnect } from '@wagmi/core';
import { ComponentProps, FC } from 'react';
import { formatLongText } from 'lib/utils/formatters';
import { cn } from 'lib/utils/shadcn';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Button } from 'ui/shadcn/button';
import { AccountIcon } from './account-icon';

export const ConnectWallet: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <ConnectButton.Custom>
      {({ account, authenticationStatus, openConnectModal }) => {
        const connected =
          account != null &&
          (authenticationStatus == null || authenticationStatus === 'authenticated');

        return (
          <div className={cn('inline-flex space-x-4', className)} {...props}>
            {connected ? (
              <div className="group relative">
                <Button variant="outline" className="flex items-center group-hover:opacity-0">
                  <AccountIcon address={account.address} size={20} />
                  <div className="ml-2">{formatLongText(account.address, { headLength: 5 })}</div>
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
      }}
    </ConnectButton.Custom>
  );
};
