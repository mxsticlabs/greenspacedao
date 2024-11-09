import {
  AbsoluteCenter,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Box
} from "@chakra-ui/react";
import { GoogleLogin } from "src/components/GoogleLogin";
import { CustomConnectButton } from "../ConnectButton";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered returnFocusOnClose={false}>
      <ModalOverlay backdropFilter={"blur(5px)"} />
      <ModalContent rounded={"2xl"}>
        <ModalHeader />
        <ModalBody pb={8}>
          <VStack gap={4}>
            <CustomConnectButton />
            <Box pos="relative">
              <AbsoluteCenter>
                <Text fontSize={"sm"} color={"gray.500"}>
                  or
                </Text>
              </AbsoluteCenter>
            </Box>
            <GoogleLogin />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
