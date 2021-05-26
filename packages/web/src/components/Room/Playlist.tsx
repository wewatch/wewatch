import { List, ListItem } from "@material-ui/core";
import { nanoid } from "nanoid";
import React from "react";

import PlaylistItem from "./PlaylistItem";

interface PlaylistProps {
  urls: string[];
}

const Playlist = ({ urls }: PlaylistProps): JSX.Element => {
  const items = urls.map((url) => (
    <ListItem key={nanoid()}>
      <PlaylistItem url={url} />
    </ListItem>
  ));
  return <List>{items}</List>;
};

export default Playlist;
