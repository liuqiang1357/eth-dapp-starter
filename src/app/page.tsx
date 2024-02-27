import { FC } from 'react';
import { Chains } from './chains';
import { Transfer } from './transfer';
import { Wallets } from './wallets';

const Home: FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-[40px] py-[20px]">
        <h2>Home Page</h2>
        <div className="flex">
          <Wallets />
          <Chains className="ml-[10px]" />
        </div>
      </div>

      <Transfer />
    </div>
  );
};

export default Home;
