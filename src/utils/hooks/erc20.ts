/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import erc20 from 'assets/abis/ERC20.json';
import { ERC20 } from 'assets/abis/types';
import { useGetContract, useWeb3State } from './web3';

export function useGetErc20Contract() {
  const getContract = useGetContract();

  return useCallback(
    async (contractHash: string, readonly?: boolean) => {
      return getContract<ERC20>(contractHash, erc20, readonly);
    },
    [getContract],
  );
}

export function useErc20RawBalance(params: { contractHash: string } | null) {
  const getErc20Contract = useGetErc20Contract();

  const { chainId, account } = useWeb3State();

  return useSWR(
    params && account != null && ['Erc20RawBalance', { ...params, chainId, account }],
    async ([, { contractHash, account }]) => {
      const contract = await getErc20Contract(contractHash);
      const balance = await contract.balanceOf(account);
      return balance.toString();
    },
  );
}

export function useErc20Transfer() {
  const getErc20Contract = useGetErc20Contract();

  return useCallback(
    async (contractHash: string, to: string, rawAmount: string) => {
      const contract = await getErc20Contract(contractHash, false);
      const transaction = await contract.transfer(to, rawAmount);
      await transaction.wait();

      mutate(key => Array.isArray(key) && key[0] === 'Erc20RawBalance');
    },
    [getErc20Contract],
  );
}
