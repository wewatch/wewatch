import { Box, Center, Portal, Spinner } from "@chakra-ui/react";

const props = {
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100vw",
  height: "100vh",
} as const;

const LoadingScreen = (): JSX.Element => (
  <Portal>
    <Box {...props} backgroundColor="white" />
    <Center {...props}>
      <Spinner size="xl" />
    </Center>
  </Portal>
);

export default LoadingScreen;
