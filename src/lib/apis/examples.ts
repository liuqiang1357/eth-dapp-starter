import { readContract, writeContract } from '@wagmi/core';
import { Address, Hash } from 'viem';
import { ChainId } from '@/configs/chains';
import { ierc20Abi } from '../abis/ierc20';
import { amountToRawAmount, rawAmountToAmount } from '../utils/misc';
import { wagmiConfig } from '../utils/wagmi';

export type GetTokenDecimalsParams = {
  chainId: ChainId;
  address: Address;
};

export async function getTokenDecimals(params: GetTokenDecimalsParams): Promise<number> {
  const decimals = await readContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    abi: ierc20Abi,
    functionName: 'decimals',
  });
  return decimals;
}

export type GetTokenSymbolParams = {
  chainId: ChainId;
  address: Address;
};

export async function getTokenSymbol(params: GetTokenDecimalsParams): Promise<string> {
  const symbol = await readContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    abi: ierc20Abi,
    functionName: 'symbol',
  });
  return symbol;
}

export type GetTokenBalanceParams = {
  chainId: ChainId;
  address: Address;
  account: Address;
  decimals: number;
};

export async function getTokenBalance(params: GetTokenBalanceParams): Promise<string> {
  const balance = await readContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    abi: ierc20Abi,
    functionName: 'balanceOf',
    args: [params.account],
  });
  return rawAmountToAmount(balance, params.decimals);
}

export type TransferTokenParams = {
  chainId: ChainId;
  address: Address;
  account: Address;
  decimals: number;
  to: Address;
  amount: string;
};

export async function transferToken(params: TransferTokenParams): Promise<Hash> {
  const hash = await writeContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    account: params.account,
    abi: ierc20Abi,
    functionName: 'transfer',
    args: [params.to, amountToRawAmount(params.amount, params.decimals)],
  });
  return hash;
}
