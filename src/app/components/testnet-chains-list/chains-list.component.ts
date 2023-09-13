import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChainData } from 'src/app/models/chain.model';
import { ChainsService } from 'src/app/services/chains.service';
import { MetamaskService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-chains-list',
  templateUrl: './chains-list.component.html',
  styleUrls: ['./chains-list.component.css'],
})
export class ChainsListComponent {
  chains: ChainData[] = [];
  filteredChains: ChainData[] = [];
  searchQuery: string = '';
  displayTestnetChains: boolean = false;
  selectedChain: ChainData | null = null;
  clickedChain: ChainData | null = null;
  isUnrecognizedChain: boolean = false;
  private testnetNetworks: string[] = ['Sepolia', 'Goerli', 'Linea Testnet'];

  @Output() selectedChainChange = new EventEmitter<ChainData>();

  constructor(
    private chainsService: ChainsService,
    private metamaskService: MetamaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchChains();
  }

  fetchChains(): void {
    this.chainsService
      .fetchChains()
      .pipe(
        map((response: ChainData[]) => {
          this.chains = response;
          this.filterChains();
        }),
        catchError((error) => {
          this.toastr.error(error);
          return of([]);
        })
      )
      .subscribe();
  }

  onChainClicked(chain: ChainData): void {
    this.clickedChain = chain;
    if (chain !== this.selectedChain) {
      this.metamaskService.switchNetwork(chain.chainId).then((result) => {
        if (!result) {
          this.isUnrecognizedChain = true;
        } else {
          this.isUnrecognizedChain = false;
          this.selectedChain = chain;
          this.selectedChainChange.emit(this.selectedChain);
        }
      });
    }
  }

  onSearchInputChange(): void {
    if (this.searchQuery?.trim().length >= 0) {
      this.filterChains();
    } else {
      this.filteredChains = [];
    }
  }

  filterChains(): void {
    this.filteredChains = this.chains
      .filter((chain) => {
        const isTestnet = this.testnetNetworks.includes(chain.name);
        const matchesSearch = chain.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        return this.displayTestnetChains
          ? isTestnet && matchesSearch
          : matchesSearch;
      })
      .slice(0, 10);
  }

  getSelectedChainStyle(chain: ChainData): { [key: string]: any } {
    const isSelected = this.selectedChain === chain;
    const isClicked = this.clickedChain === chain;
    return {
      'border-width.px': isSelected || isClicked ? 2 : 1,
      'border-color': isSelected ? 'green' : 'black',
    };
  }

  addNetworkToMetamask(chain: ChainData): void {
    this.metamaskService.addNetwork(chain).then((result) => {
      if (result) {
        this.toastr.success('Network successfully added');
      } else {
        this.toastr.error('Error adding network.');
      }
      this.isUnrecognizedChain = false;
    });
  }
}
