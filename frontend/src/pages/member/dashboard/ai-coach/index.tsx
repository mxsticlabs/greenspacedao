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
import axios from "axios";

const samplePrompts = [
  "What nutrition is best for a female BMI of 20?",
  "Any exercises I can do, without hurting my back?"
];

type ActionType =
  | "LIST_THREAD_IDS"
  | "GET_THREAD"
  | "CREATE_THREAD_WITH_QUESTION"
  | "DELETE_THREAD"
  | "ASK_QUESTION"
  | "UPDATE_STATE";
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
  const { address } = useAccount();
  const { isAuthenticated } = useAppContext();
  const [activeResponse, setActiveResponse] = useState<string>("");
  const [channel, setChannel] = useState<Channel | null>(null);

  const initialState: ChatState = {
    loading: false,
    thread_new: true,
    thread_currentId: "",
    thread_threadIds: "",
    thread_messages: [],
    active_question: "",
    active_question_disabled: false
  };

  const reducer = (state: ChatState, action: Action): ChatState => {
    switch (action.type) {
      case "LIST_THREAD_IDS":
        return {
          ...state,
          thread_threadIds: action.payload
        };
      case "GET_THREAD":
        return {
          ...state,
          thread_currentId: action.payload.threadId,
          thread_messages: action.payload.messages,
          thread_new: false
        };
      case "CREATE_THREAD_WITH_QUESTION":
        return {
          ...state,
          thread_currentId: action.payload.threadId,
          thread_messages: action.payload.messages,
          active_question: "",
          thread_new: true
        };
      case "ASK_QUESTION":
        return {
          ...state,
          thread_messages: action.payload,
          active_question: "",
          active_question_disabled: false
        };
      case "DELETE_THREAD":
        return {
          ...state,
          thread_messages: [],
          thread_currentId: "",
          thread_new: true
        };
      case "UPDATE_STATE":
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateState = (updates: Partial<ChatState>) => {
    Object.entries(updates).forEach(([key, value]) => {
      dispatch({ type: "UPDATE_STATE", payload: { [key]: value } });
    });
  };

  const handleGetThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/ai-coach/thread?${objectToSearchParams({ threadId })}`);
      const data = await response.json();
      dispatch({ type: "GET_THREAD", payload: data });
    } catch (error) {
      console.error("Error getting thread:", error);
    }
  };

  const handleAskQuestion = async () => {
    if (!state.active_question) return;
    updateState({ active_question_disabled: true });

    try {
      const response = await axios.post("/api/ai-coach/question", {
        question: state.active_question,
        threadId: state.thread_currentId,
        isNewThread: state.thread_new
      });

      const data = response.data;

      if (state.thread_new) {
        dispatch({ type: "CREATE_THREAD_WITH_QUESTION", payload: data });
      } else {
        dispatch({ type: "ASK_QUESTION", payload: data.messages });
      }

      const channelName = `private-${address}-${data.threadId}`;
      const channel = pusherClient.subscribe(channelName);
      setChannel(channel);

      channel.bind("assistant-response", (data: { content: string }) => {
        setActiveResponse((prev) => prev + data.content);
      });

      channel.bind("assistant-done", () => {
        handleGetThread(data.threadId);
        setActiveResponse("");
        channel.unbind_all();
        pusherClient.unsubscribe(channelName);
      });
    } catch (error) {
      console.error("Error asking question:", error);
      updateState({ active_question_disabled: false });
    }
  };

  useEffect(() => {
    const getThreadIds = async () => {
      try {
        const response = await fetch("/api/ai-coach/threads", {});
        const data = await response.json();
        dispatch({ type: "LIST_THREAD_IDS", payload: data.threadIds });
      } catch (error) {
        console.error("Error getting thread IDs:", error);
      }
    };

    if (isAuthenticated) {
      getThreadIds();
    }
  }, [isAuthenticated]);

  return (
    <DashBoardLayout>
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" h="calc(100vh - 100px)">
          <Box flex="1" overflowY="auto" px={4} pb={24}>
            {isEmpty(state.thread_messages) ? (
              <VStack spacing={8} align="center" pt={8}>
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" fontFamily="bellota">
                  I&apos;m here to help you live healthy and better!
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

          <Box position="sticky" bottom={4} maxW="container.md" w="full" px={4} mx={"auto"}>
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
                  minH="3rem"
                  resize="none"
                  border="none"
                  _focus={{ boxShadow: "none" }}
                />
              </Box>
              <Flex justify="flex-end" mt={4}>
                <Button
                  colorScheme="green"
                  rounded="full"
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
