'use client';

import { Types } from 'connectkit';
import { ComponentProps, FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { cn } from '@/lib/utils/shadcn';

type Props = ComponentProps<'div'> & Types.CustomAvatarProps;

export const AccountIcon: FC<Props> = ({
  className,
  address,
  size,
  ensImage: _ensImage,
  ensName: _ensName,
  ...props
}) => {
  return address != null ? (
    <div className={cn('inline-flex', className)} {...props}>
      <Jazzicon seed={jsNumberForAddress(address)} diameter={size} />
    </div>
  ) : null;
};
