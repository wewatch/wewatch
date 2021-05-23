import { Router } from "@reach/router";
import React from "react";

import Home from "./Home";
import NotFound from "./NotFound";
import Room from "./Room";

function App(): JSX.Element {
  return (
    <Router>
      <Home path="/" />
      <Room path="/rooms/:roomId" />
      <NotFound default />
    </Router>
  );
}

export default App;
