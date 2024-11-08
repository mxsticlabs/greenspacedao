import { ChakraProvider } from "@chakra-ui/react";
import isEmpty from "just-is-empty";
import { ReactNode, useEffect } from "react";
import theme from "src/config/theme";
import { useAppContext } from "src/context/state";
import { useAccount } from "wagmi";

export function AppChakraProvider({ children }: { children: ReactNode }) {
  const { address: connectedAddress } = useAccount();
  const { setAddress, setIsAuthenticated } = useAppContext();
  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    } else {
      setAddress("");
    }
    const isAuth = !isEmpty(connectedAddress);
    setIsAuthenticated(isAuth);
  }, [connectedAddress, setAddress, setIsAuthenticated]);

  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
