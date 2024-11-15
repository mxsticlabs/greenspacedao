import DashboardLayout from "src/components/MemberDashboardLayout";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";

import { useStorage } from "@thirdweb-dev/react";
import { useCallback, useEffect, useState } from "react";
import { MemberRegisterFormFields } from "src/components/RegisterForm";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import { useAppContext } from "src/context/state";
import { OktoContextType, useOkto } from "okto-sdk-react";

export default function MemberDashboardPage() {
  const { currentUser: userData, isFetchingUser } = useAppContext();
  const { showWidgetModal } = useOkto() as OktoContextType;
  const storage = useStorage();
  const [registerData, setRegisterData] = useState<MemberRegisterFormFields | null>(null);

  const fetchDataFromIPFSStorage = useCallback(() => {
    if (userData?.userCid) {
      storage?.downloadJSON(userData?.userCid).then((res) => {
        setRegisterData(res);
      });
    }
  }, [userData, storage]);
  useEffect(() => {
    fetchDataFromIPFSStorage();
  }, [fetchDataFromIPFSStorage]);
  useEffect(() => {}, [registerData]);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  function handleFundWalletClick() {
    showWidgetModal();
  }
  return (
    <DashboardLayout>
      <Box className="min-h-full h-full" px={"4"} py={4}>
        <DashboardEmptyArea isLoading={isFetchingUser} isEmpty={!isFetchingUser && !registerData}>
          <Card rounded={"xl"} shadow="md">
            <CardBody>
              <Heading size="lg" color={textColor}>
                Your wallet
              </Heading>
              <VStack align={"start"} my={4}>
                <Text color={textColor} fontSize={"x-large"} fontWeight={600}>
                  USD:2.56{" "}
                </Text>
                <Button onClick={handleFundWalletClick} rounded={"full"} colorScheme="gs-yellow">
                  Fund wallet
                </Button>
              </VStack>
            </CardBody>
          </Card>
          <Flex direction={"column"} w={"full"} py={5} px={4} bg={bgColor} rounded={"xl"} shadow="md">
            {!isFetchingUser && registerData && (
              <>
                <Heading size="lg" color={textColor} mb={6}>
                  Your Details
                </Heading>

                <Box>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    General
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" mb={6}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <InfoItem label="Name" value={registerData.fullName} />
                      <InfoItem label="DOB" value={registerData.birthDate || ""} />
                      <InfoItem label="Country" value={registerData.country || ""} />
                      <InfoItem label="Biological Sex" value={registerData.sex} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Specific
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" mb={6}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <InfoItem label="Weight" value={`${registerData.weight || ""} kg`} />
                      <InfoItem label="Height" value={registerData.height} />
                      <InfoItem label="Diet" value={registerData.diet} />
                      <InfoItem label="Week Activity" value={registerData.active || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Extras
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" mb={6}>
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Sitting" value={`${registerData.sitting || ""} hrs`} />
                      <InfoItem label="Alcohol" value={registerData.alcohol || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Smoking
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" mb={6}>
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Smoke" value={registerData.smoke} />
                      <InfoItem label="Last smoke" value={registerData.smokingStopped || ""} />
                      <InfoItem label="Smoke length" value={registerData.smokingLength || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Others
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm">
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Sleep" value={`${registerData.sleepLength || ""} hrs`} />
                      <InfoItem label="Overall Health" value={registerData.overallHealth || ""} />
                    </Flex>
                  </Card>
                </Box>
              </>
            )}
          </Flex>
        </DashboardEmptyArea>
      </Box>
    </DashboardLayout>
  );
}
const InfoItem = ({ label, value }: { label: string; value: string }) => {
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");

  return (
    <Flex direction="column">
      <Text color={labelColor} fontWeight={"bold"} fontSize="sm">
        {label}
      </Text>
      <Text color={valueColor} fontSize="md">
        {value}
      </Text>
    </Flex>
  );
};
