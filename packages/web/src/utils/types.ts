export type PaginationParams = {
  offset: number;
  limit: number;
};

export type Notification = {
  severity: "error" | "warning" | "info" | "success";
  message: string;
};
