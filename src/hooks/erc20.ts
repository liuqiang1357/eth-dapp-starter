import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { waitForTransaction } from '@wagmi/core';
import invariant from 'tiny-invariant';
import { useSnapshot } from 'valtio';
import {
  getErc20RawBalance,
  GetErc20RawBalanceParams,
  transferErc20,
  TransferErc20Params,
} from 'apis/erc20';
import { web3State } from 'states/web3';

export function useErc20RawBalance(params: Omit<GetErc20RawBalanceParams, 'chainId'> | null) {
  const { chainId } = useSnapshot(web3State);

  return useQuery({
    queryKey: ['Erc20RawBalance', { chainId, ...params }],
    queryFn: async () => {
      invariant(params != null);
      return await getErc20RawBalance({ chainId, ...params });
    },
    enabled: params != null,
  });
}

export function useTransferErc20() {
  const { chainId } = useSnapshot(web3State);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Omit<TransferErc20Params, 'chainId'>) => {
      const hash = await transferErc20({ chainId, ...params });
      await waitForTransaction({ chainId, hash });
      await queryClient.invalidateQueries({
        queryKey: ['Erc20RawBalance', { chainId, account: params.account }],
      });
    },
  });
}
