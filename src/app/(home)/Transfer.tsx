'use client';

import { Button, Input } from '@mantine/core';
import { ComponentProps, FC, useState } from 'react';
import { useSnapshot } from 'valtio';
import { isAddress } from 'viem';
import { useErc20RawBalance, useTransferErc20 } from 'lib/hooks/erc20';
import { web3State } from 'lib/states/web3';
import { tm } from 'lib/utils/tailwind';

export const Transfer: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const [address, setAddress] = useState('0x63B7b6272C2D6571C577c97902cA584dA96c64f1');
  const [to, setTo] = useState('');
  const [rawAmount, setRawAmount] = useState('');

  const { chainId, account } = useSnapshot(web3State);

  const { data: rawBalance } = useErc20RawBalance(
    chainId != null && account != null && isAddress(address) ? { chainId, account, address } : null,
  );

  const { mutateAsync: transfer, isPending: sending } = useTransferErc20();

  const send = async () => {
    if (
      chainId != null &&
      account != null &&
      isAddress(address) &&
      isAddress(to) &&
      rawAmount !== ''
    ) {
      await transfer({ chainId, account, address, to, rawAmount });
    }
  };

  return (
    <div className={tm('flex w-[600px] flex-col space-y-[20px] px-[40px]', className)} {...rest}>
      <div className="flex items-center">
        <div>Account:</div>
        <div className="ml-[10px]">{account}</div>
      </div>
      <Input
        placeholder="ERC20 contract address"
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <div className="flex items-center">
        <div>Raw balance:</div>
        <div className="ml-[10px]">{rawBalance}</div>
      </div>
      <Input placeholder="To" value={to} onChange={event => setTo(event.target.value)} />
      <Input
        placeholder="Raw amount"
        value={rawAmount}
        onChange={event => setRawAmount(event.target.value)}
      />
      <Button className="self-start" loading={sending} onClick={send}>
        Send
      </Button>
    </div>
  );
};
