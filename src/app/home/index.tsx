import { Input } from 'antd';
import { FC, useState } from 'react';
import { isAddress } from 'viem';
import { Button } from 'app/_shared/Button';
import { useErc20RawBalance, useErc20Transfer } from 'hooks/erc20';
import { useWeb3State } from 'hooks/web3';
import { Chains } from './Chains';
import { Wallets } from './Wallets';

export const Home: FC = () => {
  const [address, setAddress] = useState('');
  const [to, setTo] = useState('');
  const [rawAmount, setRawAmount] = useState('');

  const { account } = useWeb3State();

  const { data: rawBalance } = useErc20RawBalance(isAddress(address) ? address : null);

  const { mutateAsync: transfer, isLoading: sending } = useErc20Transfer();

  const send = async () => {
    if (isAddress(address) && isAddress(to) && rawAmount !== '') {
      await transfer({ address, to, rawAmount });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-[40px] py-[20px]">
        <h2>Home Page</h2>
        <div className="flex">
          <Wallets />
          <Chains className="ml-[10px]" />
        </div>
      </div>

      <div className="flex w-[600px] flex-col space-y-[20px] px-[40px]">
        <div className="flex items-center">
          <div>Account:</div>
          <div className="ml-[10px]">{account}</div>
        </div>
        <Input
          placeholder="ERC20 contract address"
          value={address}
          onChange={event => setAddress(event.target.value)}
        />
        <div className="flex items-center">
          <div>Raw balance:</div>
          <div className="ml-[10px]">{rawBalance}</div>
        </div>
        <Input placeholder="To" value={to} onChange={event => setTo(event.target.value)} />
        <Input
          placeholder="Raw amount"
          value={rawAmount}
          onChange={event => setRawAmount(event.target.value)}
        />
        <Button className="self-start" type="primary" loading={sending} onClick={send}>
          Send
        </Button>
      </div>
    </div>
  );
};
