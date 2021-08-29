import { Box, Heading, VStack } from "@chakra-ui/react";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useEffect } from "react";

import { SocketEvent, SyncType, SyncValues } from "@/constants";
import { useSocket } from "contexts/Socket";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import { addActivities } from "../../slices/activities";
import ActivityDetail from "./ActivityDetail";

const variants = {
  pre: { opacity: 0 },
  visible: { opacity: 1 },
};

const Activities = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { socketEmit } = useSocket();

  useEffect(() => {
    socketEmit(
      SocketEvent.Sync,
      SyncType.Activities,
      (activities: SyncValues[SyncType.Activities]) => {
        dispatch(addActivities(activities));
      },
    );
  }, [dispatch, socketEmit]);

  const activities = useAppSelector((state) => state.activities);

  return (
    <VStack width="100%" height="100%" align="start">
      <Heading as="h2" size="md" paddingX={3}>
        Activities
      </Heading>
      <Box width="100%" height="100%" padding={2} overflow="auto">
        <AnimateSharedLayout>
          <motion.ul layout>
            <VStack align="start">
              {activities.map((activity) => (
                <motion.li
                  layout
                  variants={variants}
                  initial="pre"
                  animate="visible"
                  key={`${activity.timestamp}-${activity.userId}`}
                >
                  <ActivityDetail {...activity} />
                </motion.li>
              ))}
            </VStack>
          </motion.ul>
        </AnimateSharedLayout>
      </Box>
    </VStack>
  );
};

export default Activities;
