import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { waitForTransactionReceipt } from '@wagmi/core';
import invariant from 'tiny-invariant';
import {
  getErc20RawBalance,
  GetErc20RawBalanceParams,
  transferErc20,
  TransferErc20Params,
} from 'lib/apis/erc20';
import { config } from 'lib/utils/web3';

export function useErc20RawBalance(params: GetErc20RawBalanceParams | null) {
  return useQuery({
    queryKey: ['Erc20RawBalance', params],
    queryFn: async () => {
      invariant(params != null);
      return await getErc20RawBalance(params);
    },
    enabled: params != null,
  });
}

export function useTransferErc20() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TransferErc20Params) => {
      const hash = await transferErc20(params);
      await waitForTransactionReceipt(config, { chainId: params.chainId, hash });
      await queryClient.invalidateQueries({
        queryKey: ['Erc20RawBalance', { chainId: params.chainId, account: params.account }],
      });
    },
  });
}
