import { Center, Spinner } from "@chakra-ui/react";

const LoadingScreen = (): JSX.Element => (
  <Center minH="100vh">
    <Spinner size="xl" />
  </Center>
);

export default LoadingScreen;
