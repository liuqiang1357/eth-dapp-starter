import { App, Popover } from 'antd';
import { ComponentProps, FC, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { Button } from 'app/_shared/Button';
import { switchChain, web3State } from 'states/web3';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from 'utils/configs';
import { tm } from 'utils/tailwind';

export const Chains: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const { chainId, walletChainId } = useSnapshot(web3State);

  const { message } = App.useApp();

  useEffect(() => {
    if (chainId !== walletChainId && chainId != null && walletChainId != null) {
      return message.info(
        <div className="inline-flex">
          <div>The wallet is not connected to {CHAIN_CONFIGS[chainId].name}.</div>
          <Button className="ml-[10px] underline" onClick={() => switchChain(chainId)}>
            Switch to {CHAIN_CONFIGS[chainId].name}
          </Button>
        </div>,
        100_000_000,
      );
    }
  }, [chainId, message, walletChainId]);

  return (
    chainId != null && (
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
    )
  );
};
