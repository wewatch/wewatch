import { VStack } from "@chakra-ui/react";
import React from "react";

import PlaylistItem from "./PlaylistItem";

interface PlaylistProps {
  urls: string[];
}

const Playlist = ({ urls }: PlaylistProps): JSX.Element => {
  const items = urls.map((url) => <PlaylistItem url={url} key={url} />);
  return <VStack>{items}</VStack>;
};

export default Playlist;
