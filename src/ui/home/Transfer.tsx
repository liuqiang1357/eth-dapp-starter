'use client';

import { useAtomValue } from 'jotai';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { WETH_ADDRESSES } from 'configs/addresses';
import {
  useTokenBalance,
  useTokenDecimals,
  useTokenSymbol,
  useTransferToken,
} from 'lib/hooks/tokens';
import { accountAtom, chainIdAtom } from 'lib/states/web3';
import { formatAmount } from 'lib/utils/formatters';
import { tm } from 'lib/utils/tailwind';
import { Button } from 'ui/shadcn/button';
import { Input } from 'ui/shadcn/input';

export const Transfer: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const account = useAtomValue(accountAtom);

  const [address, setAddress] = useState('');

  const chainId = useAtomValue(chainIdAtom);

  const { data: balance } = useTokenBalance(
    chainId != null && account != null && isAddress(address) ? { chainId, account, address } : null,
  );

  const { data: symbol } = useTokenSymbol(
    chainId != null && isAddress(address) ? { chainId, address } : null,
  );

  const { data: decimals } = useTokenDecimals(
    chainId != null && isAddress(address) ? { chainId, address } : null,
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
    <div className={tm('container', className)} {...props}>
      <div className="grid w-[40rem] grid-cols-[auto_1fr] items-center gap-4">
        <div>Account:</div>
        <div>{account}</div>

        <div>Token:</div>
        <Input value={address} onChange={event => setAddress(event.target.value)} />

        <div>Balance:</div>
        <div>
          {formatAmount(balance)} {symbol}
        </div>

        <div>To:</div>
        <Input value={to} onChange={event => setTo(event.target.value)} />

        <div>Amount:</div>
        <Input value={amount} onChange={event => setAmount(event.target.value)} />

        <Button className="place-self-start" loading={transfering} onClick={transferToken}>
          Send
        </Button>
      </div>
    </div>
  );
};
