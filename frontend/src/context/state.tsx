import { createContext, useContext, useEffect, useState } from "react";
import { useNextAuthSession } from "src/providers/okto-next-auth";
import { USER_ACCOUNT_TYPE } from "src/types";
import { User, stateContextType } from "src/types/state";

const contextDefaultValue: stateContextType = {
  allTokensData: {},
  address: "",
  setAllTokenData: () => null,
  setAddress: () => null,
  loading: false,
  setLoading: () => null,
  isUserConnected: false,
  setIsUserConnected: () => null,
  user: {} as User,
  setUser: () => null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  accountType: null,
  ensName: null,
  setEnsName: () => null,
  ensAvatar: null,
  setEnsAvatar: () => null,
  setAccountType: () => {}
};

type StateContextProviderProps = {
  children: React.ReactNode;
};

const AppContext = createContext<stateContextType>(contextDefaultValue);

export function AppContextProvider({ children }: StateContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [allTokensData, setAllTokenData] = useState<any>({
    userNftUri: "https://bafybeicxroigojtsvluxivtdkgmhcjijhnlvco2prg57ws6k3hqetkvhzu.ipfs.dweb.link/user%20badge.png",
    nutritionistNftUri:
      "https://bafybeihbll3mj2l44kqy67gbxwnvui2zqfdphzr5mr53mxto77hgo4umka.ipfs.dweb.link/nutritionist%20badge.png"
  });
  const [address, setAddress] = useState<string>("");
  const [accountType, setAccountType] = useState<USER_ACCOUNT_TYPE>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
  const [ensName, setEnsName] = useState<any>();
  const [ensAvatar, setEnsAvatar] = useState<any>();
  const { status } = useNextAuthSession();
  const [user, setUser] = useState<User>({
    userAddress: "",
    name: "",
    userCidData: "",
    startDate: "",
    endDate: "",
    amount: ""
  });

  const sharedState = {
    allTokensData,
    setAllTokenData,
    address,
    setAddress,
    loading,
    setLoading,
    isUserConnected,
    setIsUserConnected,
    user,
    isAuthenticated,
    setIsAuthenticated,
    accountType,
    setAccountType,
    setUser,

    ensName,
    setEnsName,
    ensAvatar,
    setEnsAvatar
  };
  useEffect(() => {
    setIsAuthenticated((status !== "loading" && status !== "unauthenticated") || address.trim() !== "");
  }, [accountType, address, status]);

  return <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
