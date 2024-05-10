'use client';

import { useAtomValue } from 'jotai';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { WETH_ADDRESSES } from 'configs/addresses';
import { useTokenBalance, useTokenDecimals, useTransferToken } from 'lib/hooks/tokens';
import { accountAtom, chainIdAtom } from 'lib/states/web3';
import { tm } from 'lib/utils/tailwind';

export const Transfer: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const account = useAtomValue(accountAtom);

  const [address, setAddress] = useState('');

  const chainId = useAtomValue(chainIdAtom);

  const { data: balance } = useTokenBalance(
    chainId != null && account != null && isAddress(address) ? { chainId, account, address } : null,
  );

  const { data: decimals } = useTokenDecimals(
    chainId != null && account != null && isAddress(address) ? { chainId, address } : null,
  );

  const [to, setTo] = useState('');

  const [amount, setAmount] = useState('');

  const { mutateAsync: transferTokenAsync, isPending: transfering } = useTransferToken();

  const transferToken = async () => {
    if (
      chainId != null &&
      account != null &&
      isAddress(address) &&
      decimals != null &&
      isAddress(to) &&
      amount !== ''
    ) {
      await transferTokenAsync({ chainId, account, address, decimals, to, amount });
    }
  };

  useEffect(() => {
    setAddress(WETH_ADDRESSES[chainId] ?? '');
  }, [chainId]);

  return (
    <div className={tm('flex w-[40rem] flex-col space-y-5 px-10', className)} {...props}>
      <div className="flex items-center">
        <div>Account:</div>
        <div className="ml-2">{account}</div>
      </div>
      <input
        placeholder="Token address"
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <div className="flex items-center">
        <div>Balance:</div>
        <div className="ml-2">{balance}</div>
      </div>
      <input placeholder="To" value={to} onChange={event => setTo(event.target.value)} />
      <input
        placeholder="Amount"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      <button className="self-start" disabled={transfering} onClick={transferToken}>
        Send
      </button>
    </div>
  );
};
