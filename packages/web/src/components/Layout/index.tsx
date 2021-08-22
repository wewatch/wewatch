import { Container, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => (
  <Flex direction="column" height="100vh">
    <Header />
    <Container as="main" maxW="container.xl" flexGrow={1} paddingY={2}>
      {children}
    </Container>
  </Flex>
);
