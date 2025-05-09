"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useUserOp } from "@nerochain/userop-react";
import Main from "@/components/Tabs/Main";
import Lock from "@/components/Tabs/Lock";
import Swap from "@/components/Tabs/Swap";
import MultiSend from "@/components/Tabs/MultiSend";
import Settings from "@/components/Tabs/Settings";
import Transfer from "@/components/Tabs/Transfer";
import { neroChain } from "@/lib/nerochain";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendUserOp } = useUserOp();
  const [selectedPage, setSelectedPage] = useState(2);
  const [isNeroChain, setIsNeroChain] = useState(false);

  // Check if connected to NERO Chain
  useEffect(() => {
    setIsMounted(true);
    setIsNeroChain(chainId === neroChain.id);
  }, [chainId]);

  if (!isMounted) {
    return null;
  }

  const selectPage = (e: number) => {
    setSelectedPage(e);
  };

  // NERO-specific UI enhancements
  const renderNeroBadge = () => (
    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
      NERO Chain
    </div>
  );

  const renderChainWarning = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p>For full LegacyVault features, please switch to NERO Chain</p>
      <button 
        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm"
        onClick={() => window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${neroChain.id.toString(16)}` }],
        })}
      >
        Switch to NERO
      </button>
    </div>
  );

  return (
    <div className="flex flex-col relative">
      {isConnected ? (
        <div className="h2 text-center">
          {isNeroChain && renderNeroBadge()}
          {!isNeroChain && renderChainWarning()}

          <div className="p-2">
            {selectedPage == 0 ? (
              <Main />
            ) : selectedPage == 1 ? (
              <Swap />
            ) : selectedPage == 2 ? (
              <MultiSend />
            ) : selectedPage == 3 ? (
              <Lock />
            ) : (
              <Settings />
            )}
          </div>

          {/* Rest of your bottom navigation remains the same */}
          <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            {/* ... existing navigation code ... */}
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-4">To access LegacyVault's features on NERO Chain</p>
          <w3m-button />
        </div>
      )}
    </div>
  );
}