export interface AddEthereumChainObject {
  chainId: string;
  chainName?: string;
  rpcUrls?: string[];
  iconUrls?: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}
