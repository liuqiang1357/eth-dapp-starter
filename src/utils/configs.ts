import arbitrum from 'assets/images/chains/arbitrum.svg';
import polygon from 'assets/images/chains/polygon.svg';
import metaMask from 'assets/images/wallets/metaMask.png';
import walletConnnect from 'assets/images/wallets/walletConnect.svg';
import { ChainId, WalletId } from './enums';
import { ChainConfig, WalletConfig } from './models';

// Chain configs
export const CHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  [ChainId.PolygonMumbai]: {
    name: 'Polygon Mumbai',
    icon: polygon,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://endpoints.omniatech.io/v1/matic/mumbai/public',
    explorerUrl: 'https://mumbai.polygonscan.com',
  },
  [ChainId.ArbitrumOne]: {
    name: 'Arbitrum',
    icon: arbitrum,
    nativeCurrency: { name: 'Polygon Mumbai Matic', symbol: 'mMATIC', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
  },
};

// Supported chains
export const SUPPORTED_CHAIN_IDS = [ChainId.PolygonMumbai, ChainId.ArbitrumOne];

// Wallet configs
export const WALLET_CONFIGS: Record<WalletId, WalletConfig> = {
  [WalletId.MetaMask]: {
    name: 'MetaMask',
    icon: metaMask,
  },
  [WalletId.WalletConnect]: {
    name: 'WalletConnect',
    icon: walletConnnect,
  },
};

// Supported wallets
export const SUPPORTED_WALLET_IDS = [WalletId.MetaMask, WalletId.WalletConnect];
