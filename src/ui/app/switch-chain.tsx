'use client';

import { switchChain } from '@wagmi/core';
import { useAtomValue } from 'jotai';
import { ComponentProps, FC } from 'react';
import { chainNames, supportedChainIds } from 'configs/chains';
import { chainIdAtom, walletChainIdAtom } from 'lib/states/web3';
import { cn } from 'lib/utils/shadcn';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Button } from 'ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/shadcn/dropdown-menu';

export const SwitchChain: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const chainId = useAtomValue(chainIdAtom);

  const walletChainId = useAtomValue(walletChainIdAtom);

  return (
    <div className={cn('inline-block', className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {walletChainId != null && walletChainId !== chainId ? (
            <Button variant="destructive">Wrong network</Button>
          ) : (
            <Button variant="outline">{chainNames[chainId]}</Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {supportedChainIds.map(chainId => (
            <DropdownMenuItem key={chainId} onClick={() => switchChain(wagmiConfig, { chainId })}>
              {chainNames[chainId]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
