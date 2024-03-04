import BigNumber from 'bignumber.js';

export function rawAmountToAmount(rawAmount: bigint, unit: number): string {
  const bn = new BigNumber(rawAmount.toString());
  return bn.dp(0, BigNumber.ROUND_DOWN).shiftedBy(-unit).toFixed();
}

export function amountToRawAmount(amount: string, unit: number): bigint {
  const bn = new BigNumber(amount);
  return BigInt(bn.shiftedBy(unit).dp(0, BigNumber.ROUND_DOWN).toFixed());
}
