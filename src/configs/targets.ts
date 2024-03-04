import { $enum } from 'ts-enum-util';

export enum Target {
  MainNet = 'mainnet',
  TestNet = 'testnet',
}

export const TARGET = $enum(Target).asValueOrDefault(
  process.env.NEXT_PUBLIC_TARGET,
  Target.MainNet,
);

export const TARGET_MAINNET = TARGET === Target.MainNet;
