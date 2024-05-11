'use client';

import { ComponentProps, FC } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { cn } from 'lib/utils/shadcn';

type Props = ComponentProps<'div'> & {
  address: string;
  size: number;
};

export const AccountIcon: FC<Props> = ({ className, address, size, ...props }) => {
  return (
    <div className={cn('inline-flex', className)} {...props}>
      <MetaMaskAvatar address={address} size={size} />
    </div>
  );
};
