import { Box, Heading, Text, useColorModeValue, VStack, Container } from "@chakra-ui/react";
import Head from "next/head";
import MemberRegisterForm from "src/components/MemberRegisterForm";
import { MemberRegisterFormFields } from "src/components/RegisterForm";
import { useDebounce, useInAppAuth } from "src/hooks/common";
import { useAddUserMutation, useLazyGetUserQuery, useUpdateUserMutation } from "src/state/services";
import { useRouter } from "next/router";
import { useAppContext } from "src/context/state";
import { useEffect, useState } from "react";
import { OktoContextType, useOkto, type Wallet } from "okto-sdk-react";

export default function OnboardMemberPage() {
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();

  const { user, connect } = useInAppAuth();

  // const [user, setUser] = useState<USER | undefined>(undefined);
  const router = useRouter();
  const [amount, setAmount] = useState("0.01");
  const debouncedAmount = useDebounce<string>(amount, 500);
  const { address, currentUser } = useAppContext();
  const { getWallets, createWallet } = useOkto() as OktoContextType;
  const [updateUser] = useUpdateUserMutation();
  const [getUser] = useLazyGetUserQuery();
  const [cid, setCid] = useState<string>("");
  const [formData, setFormData] = useState<MemberRegisterFormFields>({
    fullName: "",
    email: "",
    sex: "",
    country: "",
    weight: "",
    height: "",
    diet: "",
    active: "",
    sitting: "",
    alcohol: "",
    smoke: "",
    sleepLength: "",
    overallHealth: "",
    birthDate: "",
    smokingStopped: "",
    smokingLength: ""
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  async function handleFormSubmit(formData: MemberRegisterFormFields, userCid?: string) {
    try {
      setFormData(formData);
      setCid(userCid as string);
      if (!user && address) {
        await addUser({
          address: address,
          userCid,
          fullName: formData.fullName,
          email: formData.email
        }).unwrap();
        router.push("/member/dashboard");
      } else if (user) {
        let userWallets: Wallet[] = [];
        let baseWallet: string;
        const { wallets } = await getWallets();
        baseWallet = wallets?.find((wallet) => wallet.network_name.toLowerCase() === "base")?.address as string;
        if (!wallets?.length) {
          const { wallets } = await createWallet();
          userWallets = wallets;
          baseWallet = userWallets?.find((wallet) => wallet.network_name.toLowerCase() === "base")?.address as string;
          await updateUser({
            addressOrAuthId: user?.username as string,
            userCid,
            address: baseWallet,
            fullName: formData.fullName,
            email: formData.email
          }).unwrap();
          router.push("/member/dashboard");
          return;
        }
        await updateUser({
          addressOrAuthId: user?.username as string,
          userCid,
          address: baseWallet,
          fullName: formData.fullName,
          email: formData.email
        }).unwrap();
        router.push("/member/dashboard");
      } else {
        connect();
      }
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user?.fullName as string,
        email: user?.email as string
      }));
    }
  }, [currentUser, user]);

  return (
    <>
      <Head>
        <title>Welcome to GreenspaceDAO - Complete Your Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box bg={bgColor} minHeight="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="2xl" textAlign="center" color={textColor}>
              Let&apos;s Get to Know You Better
            </Heading>
            <Text fontSize="xl" textAlign="center" color={textColor}>
              You&apos;re almost there! Just a few more details and you&apos;ll be part of our community.
            </Text>
            <Box
              bg={cardBgColor}
              p={{ base: 6, md: 8 }}
              rounded="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MemberRegisterForm onSubmit={handleFormSubmit} initialValues={formData} />
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
