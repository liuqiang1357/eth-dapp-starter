'use client';

import { skipToken } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { wethAddresses } from '@/configs/addresses';
import { ChainId } from '@/configs/chains';
import {
  useTokenBalance,
  useTokenDecimals,
  useTokenSymbol,
  useTransferToken,
} from '@/lib/hooks/examples';
import { accountAtom, chainIdAtom } from '@/lib/states/web3';
import { formatNumber } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/shadcn';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';

export const Transfer: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const account = useAtomValue(accountAtom);

  const chainId = useAtomValue(chainIdAtom);

  const [addressChainId, setAddressChainId] = useState<ChainId | null>(null);

  const [address, setAddress] = useState('');

  const changeAddress = (text: string) => {
    setAddressChainId(chainId);
    setAddress(text);
  };

  const { data: balance } = useTokenBalance(
    chainId === addressChainId && account != null && isAddress(address)
      ? { chainId, account, address }
      : skipToken,
  );

  const { data: symbol } = useTokenSymbol(
    chainId === addressChainId && isAddress(address) ? { chainId, address } : skipToken,
  );

  const { data: decimals } = useTokenDecimals(
    chainId === addressChainId && isAddress(address) ? { chainId, address } : skipToken,
  );

  const [to, setTo] = useState('');

  const [amount, setAmount] = useState('');

  const { mutateAsync: transferTokenAsync, isPending: transfering } = useTransferToken();

  const transferToken = async () => {
    if (
      chainId === addressChainId &&
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
    setAddressChainId(chainId);
    setAddress(wethAddresses[chainId] ?? '');
  }, [chainId]);

  return (
    <div
      className={cn('grid w-[40rem] grid-cols-[auto_1fr] items-center gap-4', className)}
      {...props}
    >
      <div>Account:</div>
      <div>{account}</div>

      <div>Token:</div>
      <Input value={address} onChange={event => changeAddress(event.target.value)} />

      <div>Balance:</div>
      <div>
        {formatNumber(balance)} {symbol}
      </div>

      <div>To:</div>
      <Input value={to} onChange={event => setTo(event.target.value)} />

      <div>Amount:</div>
      <Input value={amount} onChange={event => setAmount(event.target.value)} />

      <Button className="col-span-2 place-self-start" loading={transfering} onClick={transferToken}>
        Send
      </Button>
    </div>
  );
};
