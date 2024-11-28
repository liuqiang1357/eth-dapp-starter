import BigNumber from 'bignumber.js';
import { format, formatDistanceToNowStrict, toDate } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
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

const groupSize = 3;
const groupSymbols = ['k', 'm', 'b', 't'];

const bigNumberRoundingModes = {
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
    defaultText = '-',
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
    bn = bn.sd(precision, roundingMode != null ? bigNumberRoundingModes[roundingMode] : undefined);
  }
  const roundToDecimals = () => {
    if (decimals != null && !useLimitValue) {
      bn = bn.dp(decimals, roundingMode != null ? bigNumberRoundingModes[roundingMode] : undefined);
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
      for (let i = 0; i < groupSymbols.length; i++) {
        if (bn.gte(10 ** groupSize) || bn.lte(-(10 ** groupSize))) {
          bn = bn.div(10 ** groupSize);
          compactSuffix = groupSymbols[i];
          roundToDecimals();
        }
      }
      let exponent = groupSymbols.length * 3;
      if (bn.gte(10 ** groupSize) || bn.lte(-(10 ** groupSize))) {
        const e = bn.e!;
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
    groupSize,
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
    defaultText = '-',
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

export type FormatTimeOptions = {
  short?: boolean;
  utc?: boolean;
};

export function formatTime(
  value: string | number | null | undefined,
  { short = false, utc = false }: FormatTimeOptions = {},
): string {
  if (value == null) {
    return '-';
  }
  return format(
    utc ? toZonedTime(toDate(value), 'UTC') : toDate(value),
    short
      ? 'yyyy-MM-dd HH:mm:ss'
      : utc
        ? "MMM dd yyyy HH:mm:ss a 'UTC'"
        : "MMM dd yyyy HH:mm:ss a xxx 'UTC'",
  );
}

export type FormatTimeFromNowOptions = {
  useSuffix?: boolean;
};

export function formatTimeFromNow(
  value: string | number | null | undefined,
  { useSuffix = true }: FormatTimeFromNowOptions = {},
): string {
  if (value == null) {
    return '-';
  }
  return formatDistanceToNowStrict(toDate(value), { addSuffix: useSuffix });
}
