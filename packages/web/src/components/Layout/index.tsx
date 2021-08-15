import { Container, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => (
  <VStack height="100vh" spacing="0">
    <Header />
    <Container maxW="container.xl" height="100%">
      {children}
    </Container>
  </VStack>
);
