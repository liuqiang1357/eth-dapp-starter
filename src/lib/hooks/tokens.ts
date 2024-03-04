import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { waitForTransactionReceipt } from '@wagmi/core';
import invariant from 'tiny-invariant';
import {
  getTokenBalance,
  GetTokenBalanceParams,
  getTokenDecimals,
  GetTokenDecimalsParams,
  transferToken,
  TransferTokenParams,
} from 'lib/apis/tokens';
import { wagmiConfig } from 'lib/utils/wagmi';

export function useTokenDecimals(params: GetTokenDecimalsParams | null) {
  return useQuery({
    queryKey: ['TokenDecimals', params],
    queryFn: async () => {
      invariant(params != null);
      return await getTokenDecimals(params);
    },
    staleTime: Infinity,
    enabled: params != null,
  });
}

export type UseTokenBalanceParams = Omit<GetTokenBalanceParams, 'decimals'>;

export function useTokenBalance(params: UseTokenBalanceParams | null) {
  const { data: decimals } = useTokenDecimals(
    params != null ? { chainId: params.chainId, address: params.address } : null,
  );
  const getTokenBalanceParams = params != null && decimals != null ? { ...params, decimals } : null;
  return useQuery({
    queryKey: ['TokenBalance', getTokenBalanceParams],
    queryFn: async () => {
      invariant(getTokenBalanceParams != null);
      return await getTokenBalance(getTokenBalanceParams);
    },
    enabled: getTokenBalanceParams != null,
  });
}

export function useTransferToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TransferTokenParams) => {
      const hash = await transferToken(params);
      await waitForTransactionReceipt(wagmiConfig, { chainId: params.chainId, hash });
      await queryClient.invalidateQueries({
        queryKey: ['TokenBalance', { chainId: params.chainId, account: params.account }],
      });
    },
  });
}
