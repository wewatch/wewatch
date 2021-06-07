import { ChakraProvider, Container } from "@chakra-ui/react";
import { Router } from "@reach/router";
import React from "react";

import Home from "./Home";
import NotFound from "./NotFound";
import Room from "./Room";

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
