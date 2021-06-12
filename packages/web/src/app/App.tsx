import { ChakraProvider, Container } from "@chakra-ui/react";
import { Router } from "@reach/router";
import React from "react";

import NotFound from "features/404";
import Home from "features/home";
import Room from "features/room";

function App(): JSX.Element {
  return (
    <ChakraProvider>
      <Container
        maxW={["container.sm", "container.md", "container.lg", "container.xl"]}
        h="100vh"
      >
        <Router>
          <Home path="/" />
          <Room path="/rooms/:roomId" />
          <NotFound default />
        </Router>
      </Container>
    </ChakraProvider>
  );
}

export default App;
