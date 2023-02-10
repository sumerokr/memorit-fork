import type { NotificationService } from "@/application/ports";

export const notificationService: NotificationService = {
  notify: (message) => {
    console.info(message);
  },
  error: (error) => {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    console.info(message);
  },
};
