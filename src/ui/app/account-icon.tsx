'use client';

import { ComponentProps, FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { cn } from 'lib/utils/shadcn';

type Props = ComponentProps<'div'> & {
  address: string;
  size: number;
};

export const AccountIcon: FC<Props> = ({ className, address, size, ...props }) => {
  return (
    <div className={cn('inline-flex', className)} {...props}>
      <Jazzicon seed={jsNumberForAddress(address)} diameter={size} />
    </div>
  );
};
