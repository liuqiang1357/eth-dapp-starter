import { useSnapshot } from 'valtio';
import { web3State } from 'states/web3';

export function useWeb3State() {
  return useSnapshot(web3State);
}
