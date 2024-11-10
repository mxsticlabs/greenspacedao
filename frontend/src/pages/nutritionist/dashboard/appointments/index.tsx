import {
  Td,
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Avatar
} from "@chakra-ui/react";
import { format } from "date-fns";
import NutritionistDashBoardLayout from "src/components/NutritionistDashboardLayout";
import Head from "next/head";

import axios from "axios";

import { useRouter } from "next/router";
import { useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import PageLoader from "src/components/PageLoader";
import { HiPhone } from "react-icons/hi2";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import { useAddMeetingMutation, useCreateRoomMutation } from "src/state/services";
import { useInAppAuth } from "src/hooks/common";
import { useAppContext } from "src/context/state";

export default function DashBoard() {
  const today = new Date().getTime();
  const router = useRouter();
  const { currentUser } = useAppContext();
  const [meetingTitle, setMeetingTitle] = useState("Discussion");
  const [isSending, setIsSending] = useState(false);

  const [createRoom, {}] = useCreateRoomMutation();

  const [addMeeting, { isLoading }] = useAddMeetingMutation();
  async function handleCreateNewMeeting() {
    try {
      setIsSending(true);

      //const response = await createRoom({ title: meetingTitle }).unwrap();

      const response = await axios.post<{
        data: { roomId: string; token: string };
      }>("/api/create-room", {
        title: meetingTitle
        // userMeta: session.user,
      });
      const data = response.data.data;

      const roomId = data?.roomId;

      await addMeeting({
        roomId: roomId as string,
        title: meetingTitle,
        userId: currentUser?.authId as string
      })
        .unwrap()
        .then(() => {
          setIsSending(false);
          router.push(`/meeting/${roomId}`);
        });
    } catch (error) {
      console.log("Error creating room", { error });
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard | Appointments</title>
      </Head>
      <PageLoader>
        <PageWrapper>
          <NutritionistDashBoardLayout>
            <Box px={4} mt={6}>
              <Flex align={"center"} justify={"space-between"}>
                <Flex align={"center"} gap={6}>
                  <Heading size={"lg"}>Today&apos;s Appointments</Heading>{" "}
                  <Text
                    className="bg-primaryGreen text-white rounded-full py-1 px-4 "
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                  >
                    {format(today, "E, d MMM yyyy")}
                  </Text>
                </Flex>
                {/* <Button className="bg-primaryGreen text-primaryBeige hover:bg-primaryYellowTrans hover:text-primaryGreen">Create Meal Plan</Button> */}
              </Flex>

              <TableContainer my={6}>
                <Table>
                  <Thead bg={"gray.800"} className="mb-4">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Time</Th>
                      <Th>Duration</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr bg={"gray.800"} rounded={"md"} my={4}>
                      <Td>
                        {" "}
                        <Flex align={"center"} gap={3}>
                          <Avatar size={"sm"} rounded={"md"} src="/images/user-59.jpg" />{" "}
                          <Text as={"span"} fontWeight={"semibold"}>
                            Lilian James
                          </Text>
                        </Flex>
                      </Td>
                      <Td>7:45 - 8:30 AM GMT+1</Td>
                      <Td>45 MINS</Td>
                      <Td>
                        <Flex gap={4}>
                          {" "}
                          <Button
                            size={"sm"}
                            rounded={"full"}
                            isLoading={isLoading}
                            onClick={async () => await handleCreateNewMeeting()}
                            gap={2}
                            colorScheme="gs-yellow"
                          >
                            <HiPhone size={20} name="phone" /> Start Call
                          </Button>
                          <Button size={"sm"} variant={"outline"} rounded={"full"}>
                            View Details
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr bg={"gray.800"} rounded={"md"} my={4}>
                      <Td>
                        <Flex align={"center"} gap={3}>
                          <Avatar size={"sm"} rounded={"md"} src="/images/user-53.jpg" />
                          <Text as={"span"} fontWeight={"semibold"}>
                            Chris Eze
                          </Text>
                        </Flex>{" "}
                      </Td>
                      <Td>12:30 - 1:00 PM GMT+1</Td>
                      <Td>30 MINS</Td>
                      <Td>
                        <Flex gap={4}>
                          <Button
                            size={"sm"}
                            rounded={"full"}
                            isLoading={isLoading}
                            onClick={async () => await handleCreateNewMeeting()}
                            gap={2}
                            colorScheme="gs-yellow"
                          >
                            <HiPhone size={20} name="phone" /> Start Call
                          </Button>
                          <Button size={"sm"} variant={"outline"} rounded={"full"}>
                            View Details
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <Box my={6}>
                <Heading mb={5} size={"lg"}>
                  Upcoming Appointments
                </Heading>
                <DashboardEmptyArea isLoading={false} text="No upcoming appointments"></DashboardEmptyArea>
              </Box>

              <Box>
                <Heading size={"lg"}>Pending Appointments</Heading>

                <TableContainer my={6}>
                  <Table>
                    <Thead bg={"gray.800"} className="mb-4">
                      <Tr>
                        <Th>Name</Th>
                        <Th>Time</Th>
                        <Th>Duration</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr bg={"gray.800"} rounded={"md"} my={4}>
                        <Td>
                          {" "}
                          <Flex align={"center"} gap={3}>
                            <Avatar size={"sm"} rounded={"md"} src="/images/user-59.jpg" />{" "}
                            <Text as={"span"} fontWeight={"semibold"}>
                              Lilian James
                            </Text>
                          </Flex>
                        </Td>
                        <Td>7:45 - 8:30 AM GMT+1</Td>
                        <Td>45 MINS</Td>
                        <Td>
                          <Flex gap={4}>
                            <Button
                              px={4}
                              size={"sm"}
                              rounded={"full"}
                              gap={2}
                              isLoading={isLoading}
                              className="hover:bg-primaryYellowTrans hover:text-[#403CEA] text-primaryBeige bg-[#403CEA]"
                              //   onClick={() => createRoom()}
                            >
                              Accept
                            </Button>
                            <Button px={4} size={"sm"} variant={"outline"} rounded={"full"} colorScheme="red">
                              Decline
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr bg={"gray.800"} rounded={"md"} my={4}>
                        <Td>
                          <Flex align={"center"} gap={3}>
                            <Avatar size={"sm"} rounded={"md"} src="/images/user-53.jpg" />
                            <Text as={"span"} fontWeight={"semibold"}>
                              Chris Eze
                            </Text>
                          </Flex>{" "}
                        </Td>
                        <Td>12:30 - 1:00 PM GMT+1</Td>
                        <Td>30 MINS</Td>
                        <Td>
                          <Flex gap={4}>
                            <Button px={4} size={"sm"} rounded={"full"} gap={2}>
                              Accept
                            </Button>
                            <Button px={4} size={"sm"} variant={"outline"} rounded={"full"} colorScheme="red">
                              Decline
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </NutritionistDashBoardLayout>
        </PageWrapper>
      </PageLoader>
    </>
  );
}
