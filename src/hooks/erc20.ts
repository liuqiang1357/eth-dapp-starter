import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import erc20 from 'assets/abis/ERC20.json';
import { ERC20 } from 'assets/abis/types';
import { useContract, useWeb3State } from './web3';

export function useErc20Contract(address: string | null, readonly = false) {
  return useContract<ERC20>(address, erc20, readonly);
}

export function useErc20RawBalance(address: string | null) {
  const contract = useErc20Contract(address, true);
  const { account } = useWeb3State();

  return useQuery(
    contract && account != null
      ? {
          queryKey: ['Erc20RawBalance', { contract, account }] as const,
          queryFn: async ({ queryKey: [, { contract, account }] }) => {
            const balance = await contract.balanceOf(account);
            return balance.toString();
          },
        }
      : { enabled: false },
  );
}

export function useErc20Transfer(address: string | null) {
  const contract = useErc20Contract(address);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, rawAmount }: { to: string; rawAmount: string }) => {
      if (!contract) {
        throw new Error('Contract is null');
      }
      const transaction = await contract.transfer(to, rawAmount);
      await transaction.wait();

      queryClient.invalidateQueries(['Erc20RawBalance']);
    },
  });
}
