import { Button, MenuItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import { useAppContext } from "src/context/state";

export const LogoutButton = ({ as = "menuitem" }: { as: "menuitem" | "button" }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  async function handleLogout() {
    setIsLoading(true);
    setCurrentUser(null);
    await disconnectAsync();
    await signOut();
    router.replace("/");
    router.reload();
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
