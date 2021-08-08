import { VideoDTO } from "@/schemas/room";

export const compareVideo = (a: VideoDTO, b: VideoDTO): number => {
  if (a.rank < b.rank) {
    return -1;
  }
  if (a.rank > b.rank) {
    return 1;
  }
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return -1;
  }
  return 0;
};
