import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Address, readContract, waitForTransaction, writeContract } from '@wagmi/core';
import { useSnapshot } from 'valtio';
import erc20 from 'assets/abis/erc20';
import { web3State } from 'states/web3';
import { skipQuery } from 'utils/queryClient';

export interface UseErc20RawBalanceParams {
  address: Address;
}

export function useErc20RawBalance(params: UseErc20RawBalanceParams | null) {
  const { chainId, account } = useSnapshot(web3State);

  return useQuery(
    account != null && params
      ? {
          queryKey: ['Erc20RawBalance', { chainId, account, ...params }],
          queryFn: async () => {
            const balance = await readContract({
              chainId,
              address: params.address,
              abi: erc20,
              functionName: 'balanceOf',
              args: [account],
            });
            return balance.toString();
          },
        }
      : skipQuery,
  );
}

export interface Erc20TransferParams {
  address: Address;
  to: Address;
  rawAmount: string;
}

export function useErc20Transfer() {
  const { chainId } = useSnapshot(web3State);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, to, rawAmount }: Erc20TransferParams) => {
      const { hash } = await writeContract({
        chainId,
        address,
        abi: erc20,
        functionName: 'transfer',
        args: [to, BigInt(rawAmount)],
      });
      await waitForTransaction({ chainId, hash });
      await queryClient.invalidateQueries({ queryKey: ['Erc20RawBalance'] });
    },
  });
}
