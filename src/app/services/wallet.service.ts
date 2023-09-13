import { Injectable } from '@angular/core';
import { ChainData } from '../models/chain.model';
import { AddEthereumChainObject } from '../models/metamask.model';
import { ToastrService } from 'ngx-toastr';

declare let ethereum: any;

@Injectable({
  providedIn: 'root',
})
export abstract class WalletService {
  abstract connectWallet(): Promise<boolean>;
  abstract getAccounts(): Promise<string[]>;
  abstract sendTransaction(transactionParams: any): Promise<string>;
  abstract switchNetwork(chainId: number): Promise<boolean>;
  abstract addNetwork(chainData: ChainData): Promise<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class MetamaskService extends WalletService {
  constructor(private toastr: ToastrService) {
    super();
  }

  private async handleEthereumRequest<T>(
    method: string,
    params?: any[]
  ): Promise<T> {
    if (typeof ethereum === 'undefined') {
      this.toastr.error('Metamask is not installed or not supported.');
    }

    try {
      return await ethereum.request({ method, params });
    } catch (error: any) {
      this.toastr.error(error.message);
      throw error;
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      await this.handleEthereumRequest('eth_requestAccounts');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAccounts(): Promise<string[]> {
    try {
      return await this.handleEthereumRequest('eth_accounts');
    } catch (error) {
      return [];
    }
  }

  async sendTransaction(transactionParams: any): Promise<string> {
    try {
      return await this.handleEthereumRequest('eth_sendTransaction', [
        transactionParams,
      ]);
    } catch (error) {
      return '';
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      await this.handleEthereumRequest('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` },
      ]);
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        console.log('Unrecognized chain ID. Please add it to your metamask.');
      } else {
        this.toastr.error('Error switching network:', error);
      }
      return false;
    }
  }

  async addNetwork(chainData: ChainData): Promise<boolean> {
    const addEthChainObject: AddEthereumChainObject = {
      chainId: `0x${chainData.chainId.toString(16)}`,
      chainName: chainData.name,
      rpcUrls: chainData.rpc,
      iconUrls: [chainData.icon],
      nativeCurrency: chainData.nativeCurrency,
      blockExplorerUrls: chainData.explorers?.map((explorer) => explorer.url),
    };

    try {
      await this.handleEthereumRequest('wallet_addEthereumChain', [
        addEthChainObject,
      ]);
      return true;
    } catch (error) {
      this.toastr.error('Error adding custom network');
      return false;
    }
  }
}

//Implement Trust wallet methods here
//export class TrustWalletService extends WalletService {}
