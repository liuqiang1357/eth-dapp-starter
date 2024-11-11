'use client';

import { useModal } from 'connectkit';
import { useAtomValue } from 'jotai';
import { ComponentProps, FC } from 'react';
import { accountAtom } from '@/lib/states/web3';
import { formatLongText } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/shadcn';
import { Button } from '@/ui/shadcn/button';
import { AccountIcon } from './account-icon';

export const ConnectWallet: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const account = useAtomValue(accountAtom);

  const { openProfile } = useModal();

  return (
    <div className={cn('inline-flex space-x-4', className)} {...props}>
      <Button variant="outline" onClick={openProfile}>
        {account != null ? (
          <>
            <AccountIcon address={account} size={20} radius={9999} />
            <div className="ml-2">{formatLongText(account, { headTailLength: 4 })}</div>
          </>
        ) : (
          <>Connect wallet</>
        )}
      </Button>
    </div>
  );
};
