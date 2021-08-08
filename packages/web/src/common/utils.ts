import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { VideoDTO } from "@/schemas/room";

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
): string | undefined => {
  if ("status" in error) {
    return (error.data as any)?.message;
  }

  return error?.message;
};

interface MinMax<T> {
  min: T | null;
  max: T | null;
}

export const findMinMax = <T>(array: T[]): MinMax<T> =>
  array.reduce(
    (accumulator, value) => {
      let { min, max } = accumulator;

      min = min ?? value;
      max = max ?? value;

      return {
        min: value < min ? value : min,
        max: value > max ? value : max,
      };
    },
    { min: null, max: null } as MinMax<T>,
  );

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
