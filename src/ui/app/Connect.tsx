'use client';

import { Button } from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { disconnect } from '@wagmi/core';
import Image from 'next/image';
import { ComponentProps, FC } from 'react';
import { formatLongText } from 'lib/utils/formatters';
import { tm } from 'lib/utils/tailwind';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Disconnect } from 'ui/svgs/Disconnect';
import { AccountIcon } from './AccountIcon';

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
                  <Button color="red" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <>
                  {wagmiConfig.chains.length > 1 && (
                    <Button onClick={openChainModal}>
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
                    <Button className="group-hover:opacity-0" variant="outline">
                      <AccountIcon address={account.address} size={20} />
                      <div className="ml-2">
                        {formatLongText(account.address, { headLength: 5 })}
                      </div>
                    </Button>
                    <Button
                      className="absolute inset-0 h-auto opacity-0 group-hover:opacity-100"
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
