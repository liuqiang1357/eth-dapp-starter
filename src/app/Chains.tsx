'use client';

import { Button, Popover } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { switchChain } from '@wagmi/core';
import Image from 'next/image';
import { ComponentProps, FC, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { web3State } from 'lib/states/web3';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from 'lib/utils/configs';
import { tm } from 'lib/utils/tailwind';
import { config } from 'lib/utils/web3';

export const Chains: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const { chainId, walletChainId } = useSnapshot(web3State);

  useEffect(() => {
    if (chainId !== walletChainId && chainId != null && walletChainId != null) {
      notifications.show({
        id: 'switch-chain',
        message: (
          <div className="flex">
            <div>The wallet is not connected to {CHAIN_CONFIGS[chainId].name}.</div>
            <Button
              className="ml-[10px] shrink-0 underline"
              onClick={() => switchChain(config, { chainId })}
            >
              Switch Network
            </Button>
          </div>
        ),
        autoClose: false,
      });
      return () => {
        notifications.hide('switch-chain');
      };
    }
  }, [chainId, walletChainId]);

  return (
    chainId != null && (
      <div className={tm('inline-block', className)} {...rest}>
        <Popover>
          <Popover.Target>
            <Button>
              <Image className="h-[16px] w-[16px]" src={CHAIN_CONFIGS[chainId].icon} alt="" />
              <div className="ml-[10px]">{CHAIN_CONFIGS[chainId].name}</div>
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex min-w-[180px] flex-col space-y-[10px] p-[10px]">
              {SUPPORTED_CHAIN_IDS.map(chainId => (
                <Button
                  key={chainId}
                  variant="outline"
                  justify="start"
                  onClick={() => switchChain(config, { chainId })}
                >
                  <Image className="h-[16px] w-[16px]" src={CHAIN_CONFIGS[chainId].icon} alt="" />
                  <div className="ml-[10px]">{CHAIN_CONFIGS[chainId].name}</div>
                </Button>
              ))}
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
    )
  );
};
