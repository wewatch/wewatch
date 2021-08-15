import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Provider } from "react-redux";

import store from "app/store";
import { Layout } from "components/Layout";
import { AuthProvider } from "contexts/Auth";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <DefaultSeo
      title="WeWatch"
      description="Watch Together"
      canonical="https://wewatch.dev"
      openGraph={{
        type: "website",
        locale: "en_US",
        url: "https://wewatch.dev",
        site_name: "WeWatch",
      }}
    />
    <Provider store={store}>
      <ChakraProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ChakraProvider>
    </Provider>
  </>
);

export default App;
