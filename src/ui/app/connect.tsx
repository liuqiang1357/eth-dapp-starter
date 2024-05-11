'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { disconnect } from '@wagmi/core';
import Image from 'next/image';
import { ComponentProps, FC } from 'react';
import { formatLongText } from 'lib/utils/formatters';
import { tm } from 'lib/utils/tailwind';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Button } from 'ui/shadcn/button';
import { Disconnect } from 'ui/svgs/disconnect';
import { AccountIcon } from './account-icon';

export const Connect: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, authenticationStatus, openChainModal, openConnectModal }) => {
        return (
          <div className={tm('inline-flex space-x-4', className)} {...props}>
            {(() => {
              const connected =
                account != null &&
                chain != null &&
                (authenticationStatus == null || authenticationStatus === 'authenticated');

              if (!connected) {
                return (
                  <Button variant="outline" onClick={openConnectModal}>
                    Connect wallet
                  </Button>
                );
              }

              if (chain.unsupported === true) {
                return (
                  <Button variant="destructive" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <>
                  {wagmiConfig.chains.length > 1 && (
                    <Button className="flex items-center" onClick={openChainModal}>
                      {chain.hasIcon && (
                        <div
                          className="size-5 rounded-full"
                          style={{ background: chain.iconBackground }}
                        >
                          <Image src={chain.iconUrl ?? ''} width={20} height={20} alt="" />
                        </div>
                      )}
                      <div className="ml-2">{chain.name}</div>
                    </Button>
                  )}

                  <div className="group relative">
                    <Button variant="outline" className="flex items-center group-hover:opacity-0">
                      <AccountIcon address={account.address} size={20} />
                      <div className="ml-2">
                        {formatLongText(account.address, { headLength: 5 })}
                      </div>
                    </Button>
                    <Button
                      variant="destructive"
                      className="absolute inset-0 flex h-auto items-center opacity-0 group-hover:opacity-100"
                      color="red"
                      onClick={() => disconnect(wagmiConfig)}
                    >
                      <Disconnect />
                      <div className="ml-2">Disconnect</div>
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
