import { Chain } from 'wagmi';

export const neroChain: Chain = {
  id: 1689, 
  name: 'NERO Chain',
  network: 'nerochain',
  nativeCurrency: {
    decimals: 18,
    name: 'NERO',
    symbol: 'NERO',
  },
  rpcUrls: {
    public: { http: ['https://rpc.nerochain.io'] },
    default: { http: ['https://rpc.nerochain.io'] },
  },
  blockExplorers: {
    default: { name: 'NEROScan', url: 'https://scan.nerochain.io' },
  },
  contracts: {
    paymaster: {
      address: '0x43E55608892989c43366CCd07753ce49e0c17688', 
    },
    entryPoint: {
      address: '0x70EF9503DB13ea94f001476B6d8491784348F8aF', 
    },
  },
};