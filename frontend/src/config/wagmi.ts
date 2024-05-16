import { createConfig,http } from "wagmi";

import { mainnet,scrollSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet,scrollSepolia],
  // multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),[scrollSepolia.id]:http()
  },
});