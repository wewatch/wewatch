import React, { useContext } from "react";

import { PlaylistDTO } from "@/schemas/room";

const PlaylistContext = React.createContext<PlaylistDTO>({
  id: "",
  name: "",
  videos: [],
});

export default PlaylistContext;

export const usePlaylist = (): PlaylistDTO => useContext(PlaylistContext);
