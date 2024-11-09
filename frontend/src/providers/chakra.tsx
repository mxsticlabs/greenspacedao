import { ChakraProvider } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";
import { useRouter } from "next/router";
import { OktoContextType, useOkto, WalletData } from "okto-sdk-react";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import theme from "src/config/theme";
import { useAppContext } from "src/context/state";
import { useInAppAuth } from "src/hooks/common";
import { useLazyGetUserQuery, useUpdateUserMutation } from "src/state/services";
import { useAccount } from "wagmi";
import { useNextAuthSession } from "./okto-next-auth";

export function AppChakraProvider({ children }: { children: ReactNode }) {
  const { address: connectedAddress } = useAccount();
  const { user } = useInAppAuth();
  const router = useRouter();
  const [getUser, { isFetching }] = useLazyGetUserQuery();
  const { data: session, status } = useNextAuthSession();
  const { setAddress, setIsAuthenticated, setCurrentUser, currentUser, setIsFetchingUser, address } = useAppContext();

  const [updateUser] = useUpdateUserMutation();
  const { isLoggedIn, authenticate } = useOkto() as OktoContextType;

  // Memoize mutation to prevent unnecessary re-renders
  const { mutate } = useMutation({
    mutationFn: async function ({ address, email }: { address?: string; email?: string }) {
      const { data } = await axios.post<{ data: { isNewUser: boolean } }>("/api/users/is-new", {
        address: address,
        email: email
      });
      return data?.data;
    },
    onSuccess: (data) => {
      if (data?.isNewUser) {
        router.push("/onboarding/member");
        return;
      }
      router.push("/member/dashboard");
    }
  });

  // Fixed missing session dependency
  useEffect(() => {
    if (session?.user?.email && !session?.user?.address) {
      router.push("/onboarding/member");
    }
  }, [session?.user?.address, session?.user?.email]);

  // Fixed missing authenticate dependency and memoized callback
  const handleAuthenticate = useCallback(
    async (idToken: string): Promise<any> => {
      if (status !== "loading" && isEmpty(idToken)) {
        return { result: false, error: "No google login" };
      }

      return new Promise((resolve) => {
        authenticate(idToken as string, (result: any, error: any) => {
          if (result) {
            resolve({ result: true });
          } else if (error) {
            resolve({ result: false, error });
          }
        });
      });
    },
    [status, authenticate]
  );
  const createWallet = useCallback(async () => {
    const baseUrl = "https://sandbox-api.okto.tech";
    const apiKey = process.env.NEXT_PUBLIC_OKTO_API_KEY;
    let authToken = "";
    if (typeof window !== "undefined") {
      const authDetails = JSON.parse(localStorage.getItem("AUTH_DETAILS") || "{}");
      authToken = authDetails?.authToken;
    }
    try {
      const response = await fetch(`${baseUrl}/api/v1/wallet`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey || "",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      console.log("Wallet created:", data);
      return data.data as WalletData;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      throw error;
    }
  }, []);
  // Fixed missing dependencies and added error handling
  useEffect(() => {
    const handleWalletCreation = async () => {
      if (session?.id_token && !isLoggedIn) {
        try {
          const authResult = await handleAuthenticate(session.id_token);
          if (authResult.result) {
            // implement a few seconds wait before creating a wallet
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const { wallets } = await createWallet();
            const baseAddress = wallets?.find((wallet) => wallet.network_name.toLowerCase() === "base")?.address;
            console.log("baseAddress", baseAddress);

            if (baseAddress) {
              setAddress(baseAddress);
              await updateUser({
                addressOrAuthId: user?.username as string,
                address: baseAddress
              }).unwrap();
            }
          }
        } catch (error) {
          console.error("Wallet creation failed:", error);
        }
      }
    };
    handleWalletCreation();
  }, [
    createWallet,
    handleAuthenticate,
    isLoggedIn,
    session?.id_token,
    currentUser?.authId,
    updateUser,
    setAddress,
    user?.username
  ]);

  useEffect(() => {
    setIsFetchingUser(isFetching);
  }, [isFetching, setIsFetchingUser]);

  // Memoized address check to prevent unnecessary updates
  const shouldUpdateAddress = useMemo(() => {
    return !currentUser && connectedAddress !== address;
  }, [currentUser, connectedAddress, address]);

  useEffect(() => {
    if (shouldUpdateAddress) {
      if (connectedAddress) {
        setAddress(connectedAddress);
        mutate({ address: connectedAddress });
      } else {
        setAddress("");
      }
      const isAuth = !isEmpty(connectedAddress);
      setIsAuthenticated(isAuth);
    }
  }, [shouldUpdateAddress, connectedAddress, mutate, setAddress, setIsAuthenticated]);

  // Memoized callback with all dependencies
  const getUserCb = useCallback(getUser, [getUser]);

  // Added cleanup and error handling
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!user?.username && !address) return;
      try {
        const response = await getUserCb({ usernameOrAuthId: address || (user?.username as string) }, true).unwrap();
        if (mounted && response.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [user?.username, getUserCb, address, setCurrentUser]);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
