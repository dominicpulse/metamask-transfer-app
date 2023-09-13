import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChainData } from 'src/app/models/chain.model';
import { MetamaskService } from 'src/app/services/wallet.service';
import { isAddress } from 'web3-validator';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(
    private metamaskService: MetamaskService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  connected: boolean = false;
  accounts: string[] = [];

  selectedEvmChain: ChainData | null = null;

  transactionHash: string = '';
  etherscanUrl: string = '';

  formGroup: FormGroup = new FormGroup({});

  isButtonDisabled: boolean = true;

  ngOnInit() {
    if (!this.connected) {
      this.connectWallet();
    }

    this.formGroup = this.fb.group({
      recipientAddress: ['', [Validators.required, this.addressValidator()]],
      amountToSend: [0, [Validators.required]],
    });
  }

  private addressValidator() {
    return (control: FormControl) => {
      const isValid = isAddress(control.value);
      return isValid ? null : { invalidAddress: true };
    };
  }

  get recipientAddress(): string {
    return this.formGroup.get('recipientAddress')?.value;
  }

  get amountToSend(): number {
    return this.formGroup.get('amountToSend')?.value;
  }

  async connectWallet(): Promise<void> {
    this.connected = await this.metamaskService.connectWallet();
    if (this.connected) {
      this.accounts = await this.metamaskService.getAccounts();
    }
  }

  onSelectedChainChange(chain: ChainData) {
    this.selectedEvmChain = chain;
  }

  async onSubmit() {
    if (!this.formGroup.valid || !this.selectedEvmChain || !this.connected) {
      return;
    }

    const fromAccount = this.accounts[0];
    const transactionParams = {
      from: fromAccount,
      to: this.recipientAddress,
      value: (this.amountToSend * 1e18).toString(), // Convert to wei
    };

    this.transactionHash = await this.metamaskService.sendTransaction(
      transactionParams
    );

    if (this.transactionHash) {
      this.etherscanUrl = `https://${this.selectedEvmChain?.name}.etherscan.io/tx/${this.transactionHash}`;
      this.toastr.success('Transaction sent successfully!', 'Success');
    } else {
      this.toastr.error('Error sending transaction', 'Error');
    }
  }
}
