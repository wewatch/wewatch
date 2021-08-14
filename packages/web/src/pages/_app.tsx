import { ChakraProvider, Container } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import store from "app/store";
import { isBrowser } from "common/utils";
import Auth from "features/auth";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider store={store}>
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
          {isBrowser && <Auth />}
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
