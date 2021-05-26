import { Container } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";

import Home from "./Home";
import NotFound from "./NotFound";
import Room from "./Room";

function App(): JSX.Element {
  return (
    <Container>
      <Router>
        <Home path="/" />
        <Room path="/rooms/:roomId" />
        <NotFound default />
      </Router>
    </Container>
  );
}

export default App;
