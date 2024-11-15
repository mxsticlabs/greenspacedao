import PageLoader from "src/components/PageLoader";
import PageWrapper from "src/components/PageWrapper";
import { HeaderNav } from "src/components/HeaderNav";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  HStack,
  Stack,
  Image,
  useColorModeValue,
  Input,
  useDisclosure
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Community } from "src/types/shared";
import { useRouter } from "next/router";
import Footer from "src/components/Footer";
import { useCheckHasJoinCommunityMutation, useGetCommunitiesQuery, useJoinCommunityMutation } from "src/state/services";
import { useInAppAuth } from "src/hooks/common";
import { Link } from "@chakra-ui/next-js";
import { CardLoading } from "src/components/CommunityPage/CardLoading";
import { replaceCloudflareIpfs, shortenText } from "src/utils";
import Head from "next/head";
import { useAppContext } from "src/context/state";
import AuthModal from "src/components/Auth/Modal";

export default function CommunitiesPage() {
  const { data, isLoading, isFetching } = useGetCommunitiesQuery({});
  const communities = data?.data!;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { connect } = useInAppAuth({ openModal: onOpen });
  const { isAuthenticated, currentUser } = useAppContext();
  const [joinCommunity, { isLoading: isJoiningComm }] = useJoinCommunityMutation();
  const [checkHasJoinCommunity, { isLoading: isCheckingJoin }] = useCheckHasJoinCommunityMutation();
  const [hasJoined, setHasJoined] = useState(false);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    if (communities) {
      setFilteredCommunities(
        communities.filter((community) => community.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [communities, searchTerm]);

  async function handleJoinCommunity(community: Community) {
    if (!isAuthenticated) {
      connect();
      return;
    }
    await checkHasJoinCommunity({
      communityId: community.id,
      spaceIdOrId: community.spaceId,
      userId: currentUser?.authId as string
    })
      .unwrap()
      .then(async (res) => {
        const hasJoined = res.data.hasJoined;
        setHasJoined(hasJoined);
        if (!isCheckingJoin && !hasJoined) {
          await joinCommunity({
            communityId: community.id,
            spaceIdOrId: community.spaceId,
            userId: currentUser?.authId as string
          }).unwrap();
        }
      });
  }

  return (
    <>
      <AuthModal isOpen={isOpen} onClose={onClose} />
      {/* <PageWrapper> */}
      <Head>
        <title>GreenspaceDAO | Communities</title>
      </Head>

      <HeaderNav />

      <Box px={{ base: 3, sm: 4, lg: 6 }} pb={12} pt={"var(--navbar-height)"}>
        <Box mx="auto">
          <Heading size="xl" my={8} color={headingColor} textAlign="center">
            Discover Communities with Similar Interests
          </Heading>
          <Flex direction="column" align="center" mb={8}>
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              w="full"
              size={"lg"}
              mb={4}
              rounded="full"
              maxW={1100}
            />
          </Flex>
          <Flex gap={6} wrap="wrap" justify={"center"}>
            {(isLoading || isFetching) && [0, 0, 0, 0].map((_, i) => <CardLoading key={"comm-loading" + i} />)}
            {!isLoading && !isFetching && (
              <Flex gap={6} wrap={"wrap"} align="stretch" justify="center" maxW={"full"}>
                {filteredCommunities.map((community) => (
                  <Stack
                    key={community.spaceId}
                    bg={cardBgColor}
                    rounded="xl"
                    shadow="lg"
                    overflow="hidden"
                    minW={280}
                    maxW={350}
                    w="full"
                    transition="all 0.3s"
                  >
                    <Box h={200} pos="relative">
                      <Image
                        alt=""
                        src={replaceCloudflareIpfs(community?.coverImage!) || "/assets/community-default-bg.png"}
                        h="full"
                        objectFit="cover"
                        w="full"
                      />
                      <Box pos="absolute" bottom={-10} left={4} bg={cardBgColor} rounded="full" p={1} shadow="md">
                        <Image
                          alt=""
                          w={20}
                          h={20}
                          rounded="full"
                          objectFit={"cover"}
                          src={replaceCloudflareIpfs(community?.displayImage!) || "/assets/community-dp.png"}
                        />
                      </Box>
                    </Box>
                    <Box p={6} pt={12}>
                      <Heading size="md" mb={3} color={headingColor}>
                        {community.name}
                      </Heading>
                      {community.description && (
                        <Text fontSize="sm" color={textColor} mb={4} noOfLines={3}>
                          {community.description}
                        </Text>
                      )}
                      <Stack spacing={3}>
                        <Button
                          as={Link}
                          href={"/community/" + community.spaceId}
                          colorScheme="blue"
                          variant="outline"
                          w="full"
                          rounded={"full"}
                        >
                          Visit Community
                        </Button>
                        <Button
                          rounded={"full"}
                          onClick={() => handleJoinCommunity(community)}
                          isLoading={isJoiningComm || isCheckingJoin}
                          loadingText={`${isCheckingJoin ? "Checking..." : isJoiningComm ? "Joining..." : ""}`}
                          colorScheme="green"
                          w="full"
                          isDisabled={hasJoined}
                        >
                          {hasJoined ? "Already a Member" : "Become a Member"}
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </Flex>
            )}
          </Flex>
        </Box>
      </Box>
      {/* </PageWrapper> */}
      <Footer />
    </>
  );
}
