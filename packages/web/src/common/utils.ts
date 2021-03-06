import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export { storage } from "hooks/local-storage/storage";

export const isBrowser = typeof window !== "undefined";

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

export const secondsToHHMMSS = (seconds: number): string => {
  const hh = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mm = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  if (hh === "00") {
    return `${mm}:${ss}`;
  }

  return `${hh}:${mm}:${ss}`;
};
