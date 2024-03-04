import BigNumber from 'bignumber.js';
import invariant from 'tiny-invariant';
import UString from 'uni-string';

export type FormatNumberOptions = {
  type?: 'standard' | 'compact' | 'percent';
  forceSign?: boolean;
  forceApproxSymbol?: boolean;
  symbol?: string | [string, string];
  lowerLimit?: number | string | null;
  upperLimit?: number | string | null;
  precision?: number | null;
  decimals?: number | null;
  roundingMode?: 'up' | 'down' | 'half-up';
  useGroupSeparator?: boolean;
  trimTrailingZero?: boolean;
  defaultText?: string;
};

const GROUP_SIZE = 3;
const GROUP_SYMBOLS = ['k', 'm', 'b', 't'];

const BIG_NUMBER_ROUNDING_MODES = {
  up: BigNumber.ROUND_UP,
  down: BigNumber.ROUND_DOWN,
  'half-up': BigNumber.ROUND_HALF_UP,
};

export function formatNumber(
  number: number | string | null | undefined,
  {
    type = 'standard',
    forceSign = false,
    forceApproxSymbol = false,
    symbol = '',
    lowerLimit = null,
    upperLimit = null,
    precision = null,
    decimals = null,
    roundingMode = 'half-up',
    useGroupSeparator = true,
    trimTrailingZero = true,
    defaultText = '--',
  }: FormatNumberOptions = {},
): string {
  if (number == null) {
    return defaultText;
  }
  let bn = new BigNumber(number);
  if (bn.isNaN()) {
    return defaultText;
  }

  let useLimitValue = false;
  let compareSymbol = '';
  if (lowerLimit != null && !bn.isZero() && bn.abs().lt(lowerLimit)) {
    bn = bn.isPositive() ? new BigNumber(lowerLimit) : new BigNumber(lowerLimit).negated();
    compareSymbol = bn.isPositive() ? '<' : '>';
    useLimitValue = true;
  }
  if (upperLimit != null && bn.isFinite() && bn.abs().gt(upperLimit)) {
    bn = bn.isPositive() ? new BigNumber(upperLimit) : new BigNumber(upperLimit).negated();
    compareSymbol = bn.isPositive() ? '>' : '<';
    useLimitValue = true;
  }

  if (precision != null && !useLimitValue) {
    bn = bn.sd(
      precision,
      roundingMode != null ? BIG_NUMBER_ROUNDING_MODES[roundingMode] : undefined,
    );
  }
  const roundToDecimals = () => {
    if (decimals != null && !useLimitValue) {
      bn = bn.dp(
        decimals,
        roundingMode != null ? BIG_NUMBER_ROUNDING_MODES[roundingMode] : undefined,
      );
    }
  };

  if (type === 'standard') {
    if (bn.isFinite()) {
      roundToDecimals();
    }
  }

  let compactSuffix = '';
  if (type === 'compact') {
    if (bn.isFinite()) {
      roundToDecimals();
      for (let i = 0; i < GROUP_SYMBOLS.length; i++) {
        if (bn.gte(10 ** GROUP_SIZE) || bn.lte(-(10 ** GROUP_SIZE))) {
          bn = bn.div(10 ** GROUP_SIZE);
          compactSuffix = GROUP_SYMBOLS[i];
          roundToDecimals();
        }
      }
      let exponent = GROUP_SYMBOLS.length * 3;
      if (bn.gte(10 ** GROUP_SIZE) || bn.lte(-(10 ** GROUP_SIZE))) {
        const e = bn.e;
        invariant(e != null, 'E');
        bn = bn.shiftedBy(-e);
        exponent += e;
        roundToDecimals();

        if (bn.gte(10) || bn.lte(-10)) {
          bn = bn.shiftedBy(-1);
          exponent += 1;
          roundToDecimals();
        }
        compactSuffix = `e${exponent}`;
      }
    }
  }

  let percent = '';
  if (type === 'percent') {
    if (!bn.isNaN()) {
      bn = bn.times(100);
      roundToDecimals();
      percent = '%';
    }
  }

  const approx = useLimitValue ? compareSymbol : forceApproxSymbol ? '~' : '';

  const negative = bn.isNegative();
  bn = bn.abs();
  const sign = negative ? '-' : forceSign ? '+' : '';

  const symbols = Array.isArray(symbol) ? symbol : [symbol, ''];

  const actualDecimals = bn.dp();
  const actualPrecision = bn.sd(true);

  const precisionNeedingDecimals =
    actualDecimals != null && actualPrecision != null && precision != null
      ? Math.max(actualDecimals + precision - actualPrecision, 0)
      : null;

  const formatDecimals =
    decimals == null
      ? precisionNeedingDecimals
      : precisionNeedingDecimals == null
        ? decimals
        : Math.min(decimals, precisionNeedingDecimals);

  const formatOptions = {
    decimalSeparator: '.',
    groupSeparator: useGroupSeparator ? ',' : '',
    groupSize: GROUP_SIZE,
  };

  const digits =
    !trimTrailingZero && formatDecimals != null
      ? bn.toFormat(formatDecimals, formatOptions)
      : bn.toFormat(formatOptions);

  return `${approx}${sign}${symbols[0]}${digits}${compactSuffix}${percent}${symbols[1]}`;
}

export type FormatLongTextOptions = {
  headTailLength?: number;
  headLength?: number;
  tailLength?: number;
  defaultText?: string;
};

export function formatLongText(
  text: string | null | undefined,
  {
    headTailLength = 8,
    headLength = headTailLength,
    tailLength = headTailLength,
    defaultText = '--',
  }: FormatLongTextOptions = {},
): string {
  if (text == null) {
    return defaultText;
  }
  const ustring = new UString(text);

  if (ustring.length <= headLength + tailLength + 3) {
    return ustring.toString();
  }
  return `${ustring.slice(0, headLength).toString()}...${ustring.slice(ustring.charLength - tailLength).toString()}`;
}
