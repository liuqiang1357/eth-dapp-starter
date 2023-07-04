import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import erc20 from 'assets/abis/ERC20.json';
import { ERC20 } from 'assets/abis/types';
import { useContract, useWeb3State } from './web3';

export function useErc20Contract(contractHash: string | null, readonly = false) {
  return useContract<ERC20>(contractHash, erc20, readonly);
}

export function useErc20RawBalance(contractHash: string | null) {
  const contract = useErc20Contract(contractHash, true);
  const { account } = useWeb3State();

  return useSWR(
    contract && account != null && ['Erc20RawBalance', { contract, account }],
    async ([, { contract, account }]) => {
      const balance = await contract.balanceOf(account);
      return balance.toString();
    },
  );
}

export function useErc20Transfer(contractHash: string | null) {
  const contract = useErc20Contract(contractHash);

  return useCallback(
    async (to: string, rawAmount: string) => {
      if (!contract) {
        throw new Error('Contract is null');
      }
      const transaction = await contract.transfer(to, rawAmount);
      await transaction.wait();

      mutate(key => Array.isArray(key) && key[0] === 'Erc20RawBalance');
    },
    [contract],
  );
}
