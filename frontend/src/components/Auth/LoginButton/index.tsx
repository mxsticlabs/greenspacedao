import React, { useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { OAuthProviderType, useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useInAppAuth, useLocalStorage } from "src/hooks/common";
import { useLazyGetUserQuery } from "src/state/services";
import { GoogleLogin } from "src/components/GoogleLogin";

export const LoginButton: React.FC<{
  type: "member" | "nutritionist";
  text: string;
  styleProps: Record<string, any>;
}> = ({ type = "member", text, styleProps }) => {
  console.log({ type });

  const { user } = usePrivy();
  const router = useRouter();
  const [getUser] = useLazyGetUserQuery();
  const [_, setNewMember] = useLocalStorage("new-member", {});
  const [_s, setStoredInfo] = useLocalStorage("stored-info", {});
  const [__, setNewNutritionist] = useLocalStorage("new-nutritionist", {});
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { connect } = useInAppAuth({ openModal: onOpen });
  // type LoginMethod =
  //   | "email"
  //   | "sms"
  //   | "siwe"
  //   | "farcaster"
  //   | OAuthProviderType
  //   | "passkey"
  //   | "telegram"
  //   | `privy:${string}`;
  // const handleLoginComplete = useCallback(
  //   (user: any, isNewUser: boolean, _: any, loginMethod: LoginMethod | null) => {
  //     console.log({ type, isNewUser, loginMethod, user });
  //     // if (type === "member") {
  //     if (isNewUser) {
  //       switch (loginMethod) {
  //         case "google":
  //           setNewMember({
  //             email: user?.google?.email,
  //             authId: user?.id,
  //             fullName: user?.google?.name,
  //             loginMethod: loginMethod,
  //             emailVerified: true
  //           });
  //           break;
  //         default:
  //           setNewMember({ email: user?.email, authId: user?.id, loginMethod: loginMethod });
  //       }
  //       // router.push("/onboarding/member");
  //       return;
  //     }
  //     router.push("/member/dashboard");
  //     // }
  //     // if (type === "nutritionist") {
  //     //   if (isNewUser) {
  //     //     switch (loginMethod) {
  //     //       case "google":
  //     //         setNewNutritionist({ email: user?.google?.email, authId: user?.id, fullName: user?.google?.name });
  //     //         break;
  //     //       default:
  //     //         setNewNutritionist({ email: user?.email, authId: user?.id });
  //     //     }
  //     //     router.push("/onboarding/nutritionist");
  //     //     return;
  //     //   }
  //     //   router.push("/nutritionist/dashboard");
  //     // }
  //   },
  //   [type, router, setNewMember]
  // );

  // const { login } = useLogin({ onComplete: handleLoginComplete });

  const handleClick = () => {
    connect();
    // setStoredInfo({ fromLogin: true });
  };

  return (
    <>
      <Button onClick={handleClick} {...styleProps}>
        {text}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered returnFocusOnClose={false}>
        <ModalOverlay backdropFilter={"blur(5px)"} />
        <ModalContent rounded={"2xl"}>
          <ModalHeader />
          <ModalBody pb={8}>
            <VStack>
              <GoogleLogin />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
