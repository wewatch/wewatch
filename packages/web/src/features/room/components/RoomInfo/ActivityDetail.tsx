import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

import { memberActions } from "@/actions/member";
import { roomActions } from "@/actions/room";
import { UserInfoDTO } from "@/schemas/user";
import UserAvatar from "components/UserAvatar";
import { useMembers } from "hooks/room";

import type { Activity } from "../../slices/activities";

const getDescription = ({
  user,
  activity,
}: {
  user: UserInfoDTO | null | undefined;
  activity: Activity;
}): JSX.Element | string => {
  const { name } = user ?? {};
  const { action } = activity;

  if (memberActions.joinRoom.match(action)) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" joins room"}
      </>
    );
  }

  if (memberActions.leaveRoom.match(action)) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" leaves room"}
      </>
    );
  }

  if (roomActions.setPlaying.match(action)) {
    const playing = action.payload;
    if (playing) {
      return (
        <>
          <Text as="span" fontWeight="bold">
            {name}
          </Text>
          {" resumes playing"}
        </>
      );
    }
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" stops playing"}
      </>
    );
  }

  if (roomActions.addVideo.match(action)) {
    const { video } = action.payload;
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" adds "}
        <Text as="span" fontWeight="bold">
          {video.title}
        </Text>
      </>
    );
  }

  if (roomActions.deleteVideo.match(action)) {
    const { title } = action.payload;
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" deletes "}
        <Text as="span" fontWeight="bold">
          {title}
        </Text>
      </>
    );
  }

  if (roomActions.updateVideo.match(action)) {
    const { title } = action.payload;
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" reorders "}
        <Text as="span" fontWeight="bold">
          {title}
        </Text>
      </>
    );
  }

  if (roomActions.setActiveURL.match(action)) {
    const { title } = action.payload;
    return (
      <>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        {" starts playing "}
        <Text as="span" fontWeight="bold">
          {title}
        </Text>
      </>
    );
  }

  return JSON.stringify(activity);
};

const ActivityDetail = (activity: Activity): JSX.Element => {
  const { userId } = activity;
  const members = useMembers();
  const user = userId === null ? null : members[userId]?.user;

  const avatar = user ? <UserAvatar {...user} /> : <Avatar />;

  return (
    <HStack>
      {avatar}
      <Box>{getDescription({ user, activity })}</Box>
    </HStack>
  );
};

export default ActivityDetail;
