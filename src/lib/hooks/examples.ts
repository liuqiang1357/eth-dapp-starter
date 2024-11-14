import { SkipToken, skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
} from '../apis/examples';
import { wagmiConfig } from '../utils/wagmi';

export function useTokenDecimals(params: GetTokenDecimalsParams | SkipToken) {
  return useQuery({
    queryKey: ['token-decimals', params],
    queryFn:
      params !== skipToken
        ? async () => {
            return await getTokenDecimals(params);
          }
        : skipToken,
    staleTime: Infinity,
  });
}

export function useTokenSymbol(params: GetTokenSymbolParams | SkipToken) {
  return useQuery({
    queryKey: ['token-symbol', params],
    queryFn:
      params !== skipToken
        ? async () => {
            return await getTokenSymbol(params);
          }
        : skipToken,
    staleTime: Infinity,
  });
}

export type UseTokenBalanceParams = Omit<GetTokenBalanceParams, 'decimals'>;

export function useTokenBalance(params: UseTokenBalanceParams | SkipToken) {
  const { data: decimals } = useTokenDecimals(
    params !== skipToken ? { chainId: params.chainId, address: params.address } : skipToken,
  );

  const apiParams = params !== skipToken && decimals != null ? { ...params, decimals } : skipToken;

  return useQuery({
    queryKey: ['token-balance', apiParams],
    queryFn:
      apiParams !== skipToken
        ? async () => {
            return await getTokenBalance(apiParams);
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
      queryClient.invalidateQueries({
        queryKey: ['token-balance', { chainId: params.chainId, account: params.account }],
      });
    },
  });
}
