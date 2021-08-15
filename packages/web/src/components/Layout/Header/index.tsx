import { Box, Container, Flex, Link, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";

import { useAuth } from "contexts/Auth";

import UserInfo from "./UserInfo";

export const Header = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <Box width="100%" backgroundColor="cyan.500">
      <Container maxW="container.xl">
        <Flex paddingY={2} width="100%">
          <Link as={NextLink} href="/">
            WeWatch
          </Link>
          <Spacer />
          {user && <UserInfo user={user} />}
        </Flex>
      </Container>
    </Box>
  );
};