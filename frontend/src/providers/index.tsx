import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppContextProvider } from "src/context/state";
import { Provider as ReduxProvider } from "react-redux";
import store from "src/state/store";
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <ReduxProvider store={store}>
        <ThirdwebProvider clientId="7d6dd3b28e4d16bb007c78b1f6c90b04" activeChain="sepolia">
          {children}
        </ThirdwebProvider>
      </ReduxProvider>
    </AppContextProvider>
  );
}

export default AppProviders;
