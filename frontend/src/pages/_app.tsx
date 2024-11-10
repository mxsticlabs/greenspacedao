import "src/styles/globals.css";
import "swiper/css";
import "src/styles/tiptap.css";
import type { AppProps } from "next/app";
import { useColorMode } from "@chakra-ui/react";
import { fonts } from "src/lib/fonts";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config } from "src/config/wagmi";
import store from "src/state/store";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Provider as ReduxProvider } from "react-redux";
import { HuddleClient } from "@huddle01/web-core";
import { HuddleProvider } from "@huddle01/react";
import { useEffect } from "react";
import OktoNextAuthProvider from "src/providers/okto-next-auth";
import { NextAuthSession } from "src/types";
import { AppChakraProvider } from "src/providers/chakra";
import { AppContextProvider } from "src/context/state";
const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
  options: {
    // `activeSpeakers` will be most active `n` number of peers, by default it's 8
    activeSpeakers: {
      size: 8
    }
  }
});

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<{ session: NextAuthSession }>) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-poppins: ${fonts.poppins.style.fontFamily};
          }
        `}
      </style>
      <OktoNextAuthProvider session={session}>
        <AppContextProvider>
          <WagmiProvider config={config}>
          
              <ThirdwebProvider clientId="7d6dd3b28e4d16bb007c78b1f6c90b04" activeChain="sepolia">
                <ReduxProvider store={store}>
                  <QueryClientProvider client={queryClient}>
                    <HuddleProvider client={huddleClient}>
                      <AppChakraProvider>
                        <ColorModeToggle />
                        <Component {...pageProps} />
                      </AppChakraProvider>
                    </HuddleProvider>
                  </QueryClientProvider>
                </ReduxProvider>
              </ThirdwebProvider>
         
          </WagmiProvider>
        </AppContextProvider>
      </OktoNextAuthProvider>
    </>
  );
}
function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const handleKeyCommand = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "m") {
        toggleColorMode();
      }
    };
    // register the keyboard command
    document.addEventListener("keypress", handleKeyCommand);
    return () => {
      document.removeEventListener("keypress", handleKeyCommand);
    };
  }, [toggleColorMode]);
  return (
    <>
      {/* <Button pos={"fixed"} top={0} left={0} zIndex={20000} onClick={toggleColorMode}> */}
      {/* Toggle {colorMode === "light" ? "Dark" : "Light"} */}
      {/* </Button> */}
    </>
  );
}
