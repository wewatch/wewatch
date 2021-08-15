import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import store from "app/store";
import { Layout } from "components/Layout";
import { AuthProvider } from "contexts/Auth";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Provider store={store}>
    <ChakraProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  </Provider>
);

export default App;
