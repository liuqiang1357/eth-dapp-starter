import { connect, disconnect } from '@wagmi/core';
import { Popover } from 'antd';
import { ComponentProps, FC } from 'react';
import { Button } from 'app/_shared/Button';
import { useSelector, useStore } from 'hooks/redux';
import { useWeb3State } from 'hooks/web3';
import { selectWalletsPopoverOpen, setWalletsPopoverOpen } from 'store/slices/ui';
import { SUPPORTED_WALLET_IDS, WALLET_CONFIGS } from 'utils/configs';
import { WalletId } from 'utils/enums';
import { formatLongText } from 'utils/formatters';
import { tm } from 'utils/tailwind';
import { CONNECTORS } from 'utils/web3';
import disconnectImage from './_images/disconnect.svg';

export const Wallets: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const walletsPopoverOpen = useSelector(selectWalletsPopoverOpen);

  const { walletId, account } = useWeb3State();

  const { dispatch } = useStore();

  const connectWallet = async (walletId: WalletId) => {
    await connect({ connector: CONNECTORS[walletId] });
    dispatch(setWalletsPopoverOpen(false));
  };

  return (
    <div className={tm('inline-block', className)} {...rest}>
      {walletId != null ? (
        <div className="group relative">
          <Button className="group-hover:opacity-0" type="primary">
            <img className="h-[16px] w-[16px]" src={WALLET_CONFIGS[walletId].icon} />
            <div className="ml-[10px]">{formatLongText(account, { headTailLength: 5 })}</div>
          </Button>
          <Button
            className="absolute inset-0 h-auto opacity-0 group-hover:opacity-100"
            type="primary"
            danger
            onClick={disconnect}
          >
            <img src={disconnectImage} />
            <div className="ml-[10px]">Disconnect</div>
          </Button>
        </div>
      ) : (
        <Popover
          open={walletsPopoverOpen}
          onOpenChange={open => dispatch(setWalletsPopoverOpen(open))}
          trigger="click"
          content={
            <div className="flex min-w-[180px] flex-col space-y-[10px] p-[20px]">
              {SUPPORTED_WALLET_IDS.map(walletId => (
                <Button
                  key={walletId}
                  className="justify-start"
                  type="default"
                  onClick={() => connectWallet(walletId)}
                >
                  <img className="h-[16px] w-[16px]" src={WALLET_CONFIGS[walletId].icon} />
                  <div className="ml-[10px]">{WALLET_CONFIGS[walletId].name}</div>
                </Button>
              ))}
            </div>
          }
        >
          <Button type="default">Connect Wallet</Button>
        </Popover>
      )}
    </div>
  );
};
