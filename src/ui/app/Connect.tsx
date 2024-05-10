'use client';

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
                return <button onClick={openConnectModal}>Connect wallet</button>;
              }

              if (chain.unsupported === true) {
                return <button onClick={openChainModal}>Wrong network</button>;
              }

              return (
                <>
                  {wagmiConfig.chains.length > 1 && (
                    <button className="flex items-center" onClick={openChainModal}>
                      {chain.hasIcon && (
                        <div
                          className="size-5 rounded-full"
                          style={{ background: chain.iconBackground }}
                        >
                          <Image src={chain.iconUrl ?? ''} width={20} height={20} alt="" />
                        </div>
                      )}
                      <div className="ml-2">{chain.name}</div>
                    </button>
                  )}

                  <div className="group relative">
                    <button className="flex items-center group-hover:opacity-0">
                      <AccountIcon address={account.address} size={20} />
                      <div className="ml-2">
                        {formatLongText(account.address, { headLength: 5 })}
                      </div>
                    </button>
                    <button
                      className="absolute inset-0 flex h-auto items-center opacity-0 group-hover:opacity-100"
                      color="red"
                      onClick={() => disconnect(wagmiConfig)}
                    >
                      <Disconnect />
                      <div className="ml-2">Disconnect</div>
                    </button>
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
