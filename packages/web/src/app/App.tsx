import { ChakraProvider, Container } from "@chakra-ui/react";
import { Router } from "@reach/router";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import NotFound from "features/404";
import Auth from "features/auth";
import Home from "features/home";
import Room from "features/room";

import store, { persistor } from "./store";

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <Container
            maxW={[
              "container.sm",
              "container.md",
              "container.lg",
              "container.xl",
            ]}
            h="100vh"
          >
            <Auth />
            <Router>
              <Home path="/" />
              <Room path="/rooms/:roomId" />
              <NotFound default />
            </Router>
          </Container>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
