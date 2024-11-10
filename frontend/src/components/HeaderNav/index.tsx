import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
  HStack,
  Heading,
  IconButton,
  Image,
  List,
  ListItem,
  useDisclosure,
  Box,
  ResponsiveValue
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { LuMenu } from "react-icons/lu";
import { useInAppAuth, useResize } from "src/hooks/common";
import { useColorMode } from "@chakra-ui/react";
import { ConnectOrLogout } from "../Auth/ConnectOrRegister";
import RegisterForm from "../RegisterForm";
import { motion, useScroll, useTransform } from "framer-motion";
import { RegisterButton } from "../Auth/RegisterButton";
import { useAppContext } from "src/context/state";

export function HeaderNav() {
  const { isMobileSize, isTabletSize } = useResize();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isMobileNavbarOpen, onToggle: onMobileNavbarToggle, onClose: onMobileNavbarClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { ready } = useInAppAuth();
  const { currentUser } = useAppContext();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0.8, 1]);
  const headerY = useTransform(scrollY, [0, 50], [0, -10]);

  const bgColor = useColorModeValue("whiteAlpha.500", "blackAlpha.400");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("gs-yellow.600", "gs-yellow.400");
  const activeColor = useColorModeValue("gs-yellow.700", "gs-yellow.500");

  const linkStyles = {
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "500",
    color: textColor,
    textTransform: "uppercase" as ResponsiveValue<"uppercase">,
    position: "relative" as ResponsiveValue<"relative">,
    padding: "8px 12px",
    transition: "color 0.3s ease",
    _before: {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "0%",
      height: "2px",
      backgroundColor: hoverColor,
      transition: "width 0.3s ease"
    },
    _hover: {
      color: hoverColor,
      _before: {
        width: "100%"
      }
    },
    _active: {
      color: activeColor
    }
  };

  const links = [
    {
      id: 0,
      label: "Blog",
      href: "/blog"
    },
    {
      id: 1,
      label: "Communities",
      href: "/communities"
    },
    {
      id: 2,
      label: "Governance",
      href: "/proposals"
    },
    {
      id: 3,
      label: "Shop",
      href: "/shop/supplements"
    }
  ].map((link) => (
    <ListItem key={link.id}>
      <Link {...linkStyles} href={link.href}>
        {link.label}
      </Link>
    </ListItem>
  ));
  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={1000} px={{ base: 2, md: 3 }} py={2}>
      <Box
        bg={bgColor}
        backdropFilter={"auto"}
        borderRadius="xl"
        backdropBlur={"25px"}
        as={motion.div}
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <HStack minH={{ base: "50px", md: "60px" }} pl={3} justify={"space-between"}>
          <Heading>
            <Link href={"/"} textDecor={"none"}>
              <Image src={"/logo-with-text.png"} alt={"Greenspace Logo"} width={"200px"} />
            </Link>
          </Heading>

          <List className="is-nav" display={"flex"} gap={4} fontWeight={500} hidden={isMobileSize || isTabletSize}>
            {links}
          </List>

          <HStack px={4} py={2} h={"full"} justify={"flex-end"}>
            {!(isMobileSize || isTabletSize) && (
              <>
                <ConnectOrLogout openModal={onOpen} />
              </>
            )}

            {(isMobileSize || isTabletSize) && (
              <>
                {ready && !currentUser && <RegisterButton onClick={onOpen} styleProps={{ size: "sm" }} />}
                <IconButton ml={1} onClick={onMobileNavbarToggle} fontSize={24} aria-label="toggle mobile menu">
                  <LuMenu />
                </IconButton>
              </>
            )}
          </HStack>
        </HStack>
      </Box>
      {/* Mobile drawer */}
      {(isMobileSize || isTabletSize) && (
        <Drawer isOpen={isMobileNavbarOpen} onClose={onMobileNavbarClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader />
            <DrawerBody>
              <List my={10} className="is-nav" display={"flex"} flexDir={"column"} gap={4} fontWeight={500}>
                {links}
              </List>
              <HStack minW={{ base: 150, lg: 350 }} p={2}>
                <ConnectOrLogout openModal={onOpen} />
              </HStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      <RegisterForm isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
