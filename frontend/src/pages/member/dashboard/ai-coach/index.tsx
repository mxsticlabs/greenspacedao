import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatBubble from "src/components/MemberAICoach/ChatBubble";
import MessageButton from "src/components/MemberAICoach/MessageButton";
import SamplePromptsCard from "src/components/MemberAICoach/SamplePromptsCard";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import isEmpty from "just-is-empty";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages";
import DashBoardLayout from "src/components/MemberDashboardLayout";
import { Box, Container, Flex, Text, Textarea, VStack, Button, Grid, useColorModeValue } from "@chakra-ui/react";
import { useInAppAuth } from "src/hooks/common";
import { useAccount } from "wagmi";
import { Channel } from "pusher-js";
import { pusherClient } from "src/lib/pusher/client";
import { generateUrlSafeId, objectToSearchParams } from "src/utils";
import { useAppContext } from "src/context/state";

const samplePrompts = [
  "What nutrition is best for a female BMI of 20?",
  "Any exercises I can do, without hurting my back?"
];

type ActionType = "LIST_THREAD_IDS" | "GET_THREAD" | "CREATE_THREAD_WITH_QUESTION" | "DELETE_THREAD" | "ASK_QUESTION";
type Payload<T = any> = T;

interface Action {
  type: ActionType;
  payload: Payload;
}

interface ChatState {
  loading: boolean;
  thread_new: boolean;
  thread_currentId: string;
  thread_threadIds: string;
  thread_messages: OpenAI.Beta.Threads.Messages.Message[];
  active_question: string;
  active_question_disabled: boolean;
}

const AiCoachPage = () => {
  // ... [Previous state management code remains unchanged]

  return (
    <DashBoardLayout>
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" h="calc(100vh - 100px)">
          <Box flex="1" overflowY="auto" px={4} pb={24}>
            {isEmpty(state.thread_messages) ? (
              <VStack spacing={8} align="center" pt={8}>
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" fontFamily="bellota">
                  I'm here to help you live healthy and better!
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {samplePrompts.map((body, index) => (
                    <SamplePromptsCard key={index} title={"Chat"} body={body} />
                  ))}
                </Grid>
                <VStack spacing={4}>
                  {state.thread_threadIds?.split(" ").map((threadIdWithDate: string) => {
                    const [threadId, date] = threadIdWithDate.split("::");
                    return (
                      <Button
                        key={threadId}
                        onClick={async () => await handleGetThread(threadId)}
                        variant="outline"
                        w="full"
                      >
                        {threadId} {date}
                      </Button>
                    );
                  })}
                </VStack>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                {state.thread_messages.map((chat, index) => (
                  <ChatBubble
                    key={index + "chat"}
                    name={chat.role === "assistant" ? "GreenspaceAI" : "Me"}
                    message={(chat.content[0] as TextContentBlock).text.value}
                    isUser={chat.role === "user"}
                  />
                ))}
                {activeResponse && <ChatBubble name="GreenspaceAI" message={activeResponse} />}
              </VStack>
            )}
          </Box>

          <Box position="fixed" bottom={4} left="50%" transform="translateX(-50%)" maxW="container.md" w="full" px={4}>
            <Box bg={useColorModeValue("white", "gray.800")} borderRadius="lg" boxShadow="lg" p={4}>
              <Box position="relative">
                <Textarea
                  placeholder="Ask me anything..."
                  value={state.active_question}
                  onChange={(e) => {
                    updateState({
                      active_question: e.target.value
                    });
                  }}
                  minH="4rem"
                  resize="none"
                  border="none"
                  _focus={{ boxShadow: "none" }}
                />
              </Box>
              <Flex justify="flex-end" mt={4}>
                <Button
                  colorScheme="green"
                  onClick={async () => {
                    await handleAskQuestion();
                  }}
                  isDisabled={state.active_question_disabled}
                >
                  Send Message
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Container>
    </DashBoardLayout>
  );
};

export default AiCoachPage;
