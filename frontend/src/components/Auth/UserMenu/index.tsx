import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text
} from "@chakra-ui/react";
import { LogoutButton } from "../Logout";
import { Link } from "@chakra-ui/next-js";
import { usePrivy } from "@privy-io/react-auth";
import { useGetUserQuery, useLazyGetUserQuery } from "src/state/services";
import BoringAvatar from "boring-avatars";
import { useCallback, useEffect, useState } from "react";
// import { USER } from "src/state/types";
import { useInAppAuth } from "src/hooks/common";
import { User } from "next-auth";
import { useAppContext } from "src/context/state";

export const UserMenu = () => {
  const { user, ready } = useInAppAuth();
  const { currentUser, isFetchingUser } = useAppContext();
  const getFirstName = (name: string) => name?.split?.(" ")[0];
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isNutritionist, setIsNutritionist] = useState(false);

  const getUserCb = useCallback(getUser, [user, getUser]);
  useEffect(() => {
    setIsAdmin(currentUser?.role === "admin");
    setIsMember(currentUser?.role === "user");
  }, [currentUser]);
  console.log({ user });

  return (
    <>
      {isFetchingUser && (
        <Button
          rounded={"full"}
          variant={"outline"}
          colorScheme="gs-gray"
          size={"sm"}
          isLoading={isFetchingUser}
          loadingText="Loading..."
        >
          Hi, <BoringAvatar size={30} />
        </Button>
      )}

      {!isFetchingUser && currentUser && (
        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            // variant={"outline"}
            colorScheme="gs-beige"
            // size={"sm"}
            gap={3}
          >
            <HStack>
              <Text as={"span"}>Hi, {getFirstName(savedUser?.fullName!)}</Text>
              <Avatar size={"sm"} name={savedUser?.fullName!} src={savedUser?.avatar || ""}></Avatar>{" "}
              {/* <BsChevronDown /> */}
            </HStack>
          </MenuButton>
          {/* <Portal> */}
          <MenuList zIndex={200} rounded={"12px"}>
            <MenuGroup>
              {isMember && (
                <MenuItem as={Link} href={"/member/dashboard"}>
                  Dashboard
                </MenuItem>
              )}
              {isNutritionist && (
                <MenuItem as={Link} href={"/nutritionist/dashboard"}>
                  Dashboard
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem as={Link} href={"/admin/dashboard"}>
                  Admin Dashboard
                </MenuItem>
              )}
            </MenuGroup>
            <MenuDivider />
          </MenuList>
          {/* </Portal> */}
        </Menu>
      )}
      <LogoutButton as={"button"} />
    </>
  );
};
