import { ChakraProvider, Container } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import store from "app/store";
import { AuthProvider } from "common/contexts/Auth";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Provider store={store}>
    <ChakraProvider>
      <Container
        maxW={["container.sm", "container.md", "container.lg", "container.xl"]}
        h="100vh"
      >
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Container>
    </ChakraProvider>
  </Provider>
);

export default App;
