import { Options } from "@sentry/types";

const IGNORED_HANDLERS = [
  // SearchController.search
  "search",
  // RoomGateway.handlePing
  "handlePing",
];

export const tracesSampler: NonNullable<Options["tracesSampler"]> = (
  samplingContext,
) => {
  const {
    transactionContext: { name },
  } = samplingContext;

  return !IGNORED_HANDLERS.includes(name);
};
