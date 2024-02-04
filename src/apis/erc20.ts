import { readContract, writeContract } from '@wagmi/core';
import { Address, Hash } from 'viem';
import erc20 from 'assets/abis/erc20';
import { ChainId } from 'utils/models';
import { config } from 'utils/web3';

export type GetErc20RawBalanceParams = {
  chainId: ChainId;
  account: Address;
  address: Address;
};

export async function getErc20RawBalance(params: GetErc20RawBalanceParams): Promise<string> {
  const balance = await readContract(config, {
    chainId: params.chainId,
    address: params.address,
    abi: erc20,
    functionName: 'balanceOf',
    args: [params.account],
  });
  return balance.toString();
}

export type TransferErc20Params = {
  chainId: ChainId;
  account: Address;
  address: Address;
  to: Address;
  rawAmount: string;
};

export async function transferErc20(params: TransferErc20Params): Promise<Hash> {
  const hash = await writeContract(config, {
    chainId: params.chainId,
    account: params.account,
    address: params.address,
    abi: erc20,
    functionName: 'transfer',
    args: [params.to, BigInt(params.rawAmount)],
  });
  return hash;
}
