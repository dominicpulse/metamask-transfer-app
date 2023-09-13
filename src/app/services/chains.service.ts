import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChainData } from '../models/chain.model';

@Injectable({
  providedIn: 'root',
})
export class ChainsService {
  constructor(private http: HttpClient) {}

  private chainsUrl = 'https://chainid.network/chains.json';

  fetchChains(): Observable<ChainData[]> {
    return this.http.get<ChainData[]>(this.chainsUrl);
  }
}
