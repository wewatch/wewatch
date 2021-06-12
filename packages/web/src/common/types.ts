export type Notification = {
  status: "error" | "warning" | "info" | "success";
  title: string;
  description?: string;
};
