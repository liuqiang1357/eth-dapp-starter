import { UtfString } from 'utfstring';

export interface FormatLongTextOptions {
  headTailLength?: number;
  headLength?: number;
  tailLength?: number;
}

export function formatLongText(
  value: string | null | undefined,
  { headTailLength = 8, headLength, tailLength }: FormatLongTextOptions = {},
): string {
  if (value == null) {
    return '-';
  }
  const string = new UtfString(value);
  const finalHeadLength = headLength ?? headTailLength;
  const finalTailLength = tailLength ?? headTailLength;

  if (string.length <= finalHeadLength + finalTailLength + 3) {
    return string.toString();
  }
  return `${string.slice(0, finalHeadLength)}...${string.slice(string.length - finalTailLength)}`;
}
