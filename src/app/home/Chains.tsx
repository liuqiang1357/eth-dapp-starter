import { App, Popover } from 'antd';
import { ComponentProps, FC, useEffect } from 'react';
import { Button } from 'app/_shared/Button';
import { useSwitchChain, useWeb3State } from 'hooks/web3';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from 'utils/configs';
import { tm } from 'utils/tailwind';

export const Chains: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const { chainId, walletChainId } = useWeb3State();

  const switchChain = useSwitchChain();

  const { message } = App.useApp();

  useEffect(() => {
    if (chainId !== walletChainId && walletChainId != null) {
      const disposer = message.info(
        <div className="inline-flex">
          <div>The wallet is not connected to {CHAIN_CONFIGS[chainId].name}.</div>
          <Button className="ml-[10px] underline" onClick={() => switchChain(chainId)}>
            Switch to {CHAIN_CONFIGS[chainId].name}
          </Button>
        </div>,
        99999999,
      );
      return disposer;
    }
  }, [chainId, message, switchChain, walletChainId]);

  return (
    <div className={tm('inline-block', className)} {...rest}>
      <Popover
        content={
          <div className="flex min-w-[180px] flex-col space-y-[10px] p-[20px]">
            {SUPPORTED_CHAIN_IDS.map(chainId => (
              <Button
                key={chainId}
                className="justify-start"
                type="default"
                onClick={() => switchChain(chainId)}
              >
                <img className="h-[16px] w-[16px]" src={CHAIN_CONFIGS[chainId].icon} />
                <div className="ml-[10px]">{CHAIN_CONFIGS[chainId].name}</div>
              </Button>
            ))}
          </div>
        }
      >
        <Button type="default">
          <img className="h-[16px] w-[16px]" src={CHAIN_CONFIGS[chainId].icon} />
          <div className="ml-[10px]">{CHAIN_CONFIGS[chainId].name}</div>
        </Button>
      </Popover>
    </div>
  );
};
