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
  Text
} from "@chakra-ui/react";
import { LogoutButton } from "../Logout";
import { Link } from "@chakra-ui/next-js";
import BoringAvatar from "boring-avatars";
import { useEffect, useState } from "react";
import { useInAppAuth } from "src/hooks/common";
import { useAppContext } from "src/context/state";

export const UserMenu = () => {
  const { user } = useInAppAuth();
  const { currentUser, isFetchingUser } = useAppContext();
  const getFirstName = (name: string) => name?.split?.(" ")[0];
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isNutritionist, setIsNutritionist] = useState(false);

  useEffect(() => {
    setIsAdmin(currentUser?.role === "admin");
    setIsMember(currentUser?.role === "user");
  }, [currentUser]);

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
              <Text as={"span"}>Hi, {getFirstName(currentUser?.fullName!)}</Text>
              <Avatar size={"sm"} name={currentUser?.fullName!} src={currentUser?.avatar || ""}></Avatar>{" "}
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
            <LogoutButton as="menuitem" />
          </MenuList>
          {/* </Portal> */}
        </Menu>
      )}
    </>
  );
};
