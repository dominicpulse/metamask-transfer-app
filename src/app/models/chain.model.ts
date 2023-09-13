export interface ChainData {
  name: string;
  chain: string;
  icon: string;
  rpc: string[];
  features?: Feature[];
  faucets: string[];
  nativeCurrency: NativeCurrency;
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44?: number;
  ens?: {
    registry: string;
  };
  explorers: Explorer[];
}

interface Feature {
  name: string;
}

interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

interface Explorer {
  name: string;
  url: string;
  standard?: string;
  icon?: string;
}
