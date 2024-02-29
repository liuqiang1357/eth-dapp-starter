'use client';

import { Button, Popover } from '@mantine/core';
import { connect, disconnect } from '@wagmi/core';
import Image from 'next/image';
import { ComponentProps, FC } from 'react';
import { useSnapshot } from 'valtio';
import { uiState } from 'lib/states/ui';
import { web3State } from 'lib/states/web3';
import { SUPPORTED_WALLET_IDS, WALLET_CONFIGS } from 'lib/utils/configs';
import { formatLongText } from 'lib/utils/formatters';
import { WalletId } from 'lib/utils/models';
import { tm } from 'lib/utils/tailwind';
import { config, CONNECTORS } from 'lib/utils/web3';
import { Disconnect } from './_images/disconnect';

export const Wallets: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const { walletId, account } = useSnapshot(web3State);

  const { walletsPopoverOpen } = useSnapshot(uiState);

  const handleConnectClick = async (walletId: WalletId) => {
    await connect(config, { connector: CONNECTORS[walletId] });
    uiState.walletsPopoverOpen = false;
  };

  return (
    <div className={tm('inline-block', className)} {...rest}>
      {walletId != null ? (
        <div className="group relative">
          <Button className="group-hover:opacity-0" variant="light">
            <Image className="h-[16px] w-[16px]" src={WALLET_CONFIGS[walletId].icon} alt="" />
            <div className="ml-[10px]">{formatLongText(account, { headLength: 5 })}</div>
          </Button>
          <Button
            className="absolute inset-0 h-auto opacity-0 group-hover:opacity-100"
            variant="light"
            color="red"
            onClick={() => disconnect(config)}
          >
            <Disconnect />
            <div className="ml-[10px]">Disconnect</div>
          </Button>
        </div>
      ) : (
        <Popover opened={walletsPopoverOpen} onChange={open => (uiState.walletsPopoverOpen = open)}>
          <Popover.Target>
            <Button variant="light" onClick={() => (uiState.walletsPopoverOpen = true)}>
              Connect Wallet
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex min-w-[180px] flex-col space-y-[10px] p-[10px]">
              {SUPPORTED_WALLET_IDS.map(walletId => (
                <Button
                  key={walletId}
                  className="inline-flex justify-start"
                  variant="outline"
                  onClick={() => handleConnectClick(walletId)}
                >
                  <Image className="h-[16px] w-[16px]" src={WALLET_CONFIGS[walletId].icon} alt="" />
                  <div className="ml-[10px]">{WALLET_CONFIGS[walletId].name}</div>
                </Button>
              ))}
            </div>
          </Popover.Dropdown>
        </Popover>
      )}
    </div>
  );
};
