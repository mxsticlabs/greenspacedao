import { Box, Heading, Stack } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";
import { CardLoading } from "../../CardLoading";
import { useGetCommunityChallengesQuery } from "src/state/services";
import isEmpty from "just-is-empty";

export default function Challenges({ spaceIdOrId }: { spaceIdOrId: string }) {
  const {
    data: challengesResponse,
    isLoading,
    isFetching,
  } = useGetCommunityChallengesQuery({
    spaceIdOrId: spaceIdOrId,
  });
  const challenges = challengesResponse?.data;
  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6}>
      <Heading size={"lg"} fontWeight={600} mb={4}>
        Challenges
      </Heading>
      <Stack gap={5}>
        {(isLoading || isFetching) &&
          [0, 0, 0, 0].map((_, i) => (
            <CardLoading key={"challenge-loading" + i} />
          ))}
        {!isLoading &&
          !isFetching &&
          !isEmpty(challenges) &&
          challenges?.map((challenge, i) => (
            <ChallengeCard
              challenge={challenge}
              spaceIdOrId={spaceIdOrId}
              key={i}
            />
          ))}
      </Stack>
    </Stack>
  );
}
