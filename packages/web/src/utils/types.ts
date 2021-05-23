export type PaginationParams = {
  offset: number;
  limit: number;
};

export type Room = {
  id: string;
  urls: string[];
};

export type Notification = {
  severity: "error" | "warning" | "info" | "success";
  message: string;
};
