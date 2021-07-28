import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
): string | undefined => {
  if ("status" in error) {
    return (error.data as any)?.message;
  }

  return error?.message;
};
