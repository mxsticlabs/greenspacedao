import { ChakraProvider } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect } from "react";
import theme from "src/config/theme";
import { useAppContext } from "src/context/state";
import { useInAppAuth } from "src/hooks/common";
import { useLazyGetUserQuery } from "src/state/services";
import { useAccount } from "wagmi";

export function AppChakraProvider({ children }: { children: ReactNode }) {
  const { address: connectedAddress } = useAccount();
  const { user } = useInAppAuth();
  const router = useRouter();
  const [getUser, { isLoading }] = useLazyGetUserQuery();

  const { setAddress, setIsAuthenticated, setCurrentUser, setIsFetchingUser, address } = useAppContext();
  const { mutate } = useMutation({
    mutationFn: async function (address: string) {
      const { data } = await axios.post<{ data: { isNewUser: boolean } }>("/api/users/is-new", {
        address: address
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
    setIsFetchingUser(isLoading);
  }, [isLoading, setIsFetchingUser]);
  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
      mutate(connectedAddress);
    } else {
      setAddress("");
    }
    const isAuth = !isEmpty(connectedAddress);
    setIsAuthenticated(isAuth);
  }, [connectedAddress, mutate, setAddress, setIsAuthenticated]);
  useEffect(() => {}, []);
  const getUserCb = useCallback(getUser, [user, getUser]);
  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !address) return;

      await getUserCb({ usernameOrAuthId: address || user?.authId || "" }, true)
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
