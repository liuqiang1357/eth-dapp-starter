import { $enum } from 'ts-enum-util';

export enum Target {
  MainNet = 'mainnet',
  TestNet = 'testnet',
}

export const target = $enum(Target).asValueOrDefault(
  process.env.NEXT_PUBLIC_TARGET,
  Target.MainNet,
);
