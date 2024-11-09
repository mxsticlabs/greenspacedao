import { Button, MenuItem } from "@chakra-ui/react";
import { useLogout } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";

export const LogoutButton = ({ as = "menuitem" }: { as: "menuitem" | "button" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  async function handleLogout() {
    setIsLoading(true);
    await signOut();
    await disconnectAsync();
    router.push("/");
    setIsLoading(false);
  }
  return (
    <>
      {as === "button" && (
        <Button
          isLoading={isLoading}
          rounded={"full"}
          maxW={200}
          flex={1}
          colorScheme="red"
          gap={3}
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </Button>
      )}
      {as === "menuitem" && (
        <MenuItem
          isLoading={isLoading}
          as={Button}
          gap={3}
          // variant={"ghost"}
          flex={1}
          colorScheme="red"
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </MenuItem>
      )}
    </>
  );
};
