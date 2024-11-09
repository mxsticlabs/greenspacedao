import { ChakraProvider } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";
import { useRouter } from "next/router";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { ReactNode, useCallback, useEffect } from "react";
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
  const {
    isLoggedIn,
    authenticate,
    createWallet
    // getPortfolio,
    // getSupportedTokens,
    // getWallets,
    // getUserDetails,
  } = useOkto() as OktoContextType;
  const { mutate } = useMutation({
    mutationFn: async function ({ address, email }: { address?: string; email?: string }) {
      const { data } = await axios.post<{ data: { isNewUser: boolean } }>("/api/users/is-new", {
        address: address,
        email: email
      });
      return data?.data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.isNewUser) {
        router.push("/onboarding/member");
        return;
      }
      router.push("/member/dashboard");
    }
  });

  useEffect(() => {
    if (session) {
      mutate({ email: session?.user?.email as string });
    }
  }, [mutate, session]);
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
    [status]
  );

  useEffect(() => {
    if (session?.id_token && !isLoggedIn) {
      handleAuthenticate(session?.id_token as string).then(async (res) => {
        const { wallets } = await createWallet();
        const baseAddress = wallets?.find((wallet) => wallet.network_name.toLowerCase() === "base")?.address;
        if (baseAddress) {
          await updateUser({
            addressOrAuthId: currentUser?.authId as string,
            address: baseAddress
          }).unwrap();
        }
      });
    }
  }, [createWallet, handleAuthenticate, isLoggedIn, session?.id_token]);

  useEffect(() => {
    setIsFetchingUser(isFetching);
  }, [isFetching, setIsFetchingUser]);
  useEffect(() => {
    if (currentUser) return;
    if (connectedAddress) {
      setAddress(connectedAddress);
      mutate({ address: connectedAddress });
    } else {
      setAddress("");
    }
    const isAuth = !isEmpty(connectedAddress);
    setIsAuthenticated(isAuth);
  }, [connectedAddress, currentUser, mutate, setAddress, setIsAuthenticated]);

  const getUserCb = useCallback(getUser, [user, getUser, address]);
  useEffect(() => {
    const fetchUser = async () => {
      if (!user && !address) return;
      await getUserCb({ usernameOrAuthId: address || (user?.authId as string) }, true)
        .unwrap()
        .then((response) => {
          const savedUser = response.data!;
          setCurrentUser(savedUser);
        });
    };
    fetchUser();
  }, [user, getUserCb, address, setCurrentUser]);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
