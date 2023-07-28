import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Address, readContract, waitForTransaction, writeContract } from '@wagmi/core';
import invariant from 'tiny-invariant';
import { useSnapshot } from 'valtio';
import erc20 from 'assets/abis/erc20';
import { web3State } from 'states/web3';

interface UseErc20RawBalanceParams {
  address: Address;
}

export function useErc20RawBalance(params: UseErc20RawBalanceParams | null) {
  const { chainId, account } = useSnapshot(web3State);

  return useQuery({
    queryKey: ['Erc20RawBalance', { chainId, account, ...params }],
    queryFn: async () => {
      invariant(account != null && params != null);

      const balance = await readContract({
        chainId,
        address: params.address,
        abi: erc20,
        functionName: 'balanceOf',
        args: [account],
      });
      return balance.toString();
    },
    enabled: account != null && params != null,
  });
}

interface Erc20TransferParams {
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
