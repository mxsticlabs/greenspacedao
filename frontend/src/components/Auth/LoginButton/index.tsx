import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useInAppAuth, useLocalStorage } from "src/hooks/common";
import AuthModal from "../Modal";

export const LoginButton: React.FC<{
  type: "member" | "nutritionist";
  text: string;
  styleProps: Record<string, any>;
}> = ({ type = "member", text, styleProps }) => {
  console.log({ type });
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
      <AuthModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
