import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Address, readContract, waitForTransaction, writeContract } from '@wagmi/core';
import erc20 from 'assets/abis/erc20';
import { useWeb3State } from './web3';

export function useErc20RawBalance(address: Address | null) {
  const { chainId, account } = useWeb3State();

  return useQuery(
    address != null && account != null
      ? {
          queryKey: ['Erc20RawBalance', { chainId, address, account }] as const,
          queryFn: async ({ queryKey: [, { address, account }] }) => {
            const balance = await readContract({
              chainId,
              address,
              abi: erc20,
              functionName: 'balanceOf',
              args: [account],
            });
            return balance.toString();
          },
        }
      : { enabled: false },
  );
}

export function useErc20Transfer() {
  const { chainId } = useWeb3State();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      address,
      to,
      rawAmount,
    }: {
      address: Address;
      to: Address;
      rawAmount: string;
    }) => {
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
