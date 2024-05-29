import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { waitForTransactionReceipt } from '@wagmi/core';
import {
  getTokenBalance,
  GetTokenBalanceParams,
  getTokenDecimals,
  GetTokenDecimalsParams,
  getTokenSymbol,
  GetTokenSymbolParams,
  transferToken,
  TransferTokenParams,
} from 'lib/apis/tokens';
import { wagmiConfig } from 'lib/utils/wagmi';

export function useTokenDecimals(params: GetTokenDecimalsParams | null) {
  return useQuery({
    queryKey: ['token-decimals', params],
    queryFn:
      params != null
        ? async () => {
            return await getTokenDecimals(params);
          }
        : skipToken,
    staleTime: Infinity,
  });
}

export function useTokenSymbol(params: GetTokenSymbolParams | null) {
  return useQuery({
    queryKey: ['token-symbol', params],
    queryFn:
      params != null
        ? async () => {
            return await getTokenSymbol(params);
          }
        : skipToken,
    staleTime: Infinity,
  });
}

export type UseTokenBalanceParams = Omit<GetTokenBalanceParams, 'decimals'>;

export function useTokenBalance(params: UseTokenBalanceParams | null) {
  const { data: decimals } = useTokenDecimals(
    params != null ? { chainId: params.chainId, address: params.address } : null,
  );
  const getTokenBalanceParams = params != null && decimals != null ? { ...params, decimals } : null;
  return useQuery({
    queryKey: ['token-balance', getTokenBalanceParams],
    queryFn:
      getTokenBalanceParams != null
        ? async () => {
            return await getTokenBalance(getTokenBalanceParams);
          }
        : skipToken,
  });
}

export function useTransferToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TransferTokenParams) => {
      const hash = await transferToken(params);
      await waitForTransactionReceipt(wagmiConfig, { chainId: params.chainId, hash });
      await queryClient.invalidateQueries({
        queryKey: ['token-balance', { chainId: params.chainId, account: params.account }],
      });
    },
  });
}
