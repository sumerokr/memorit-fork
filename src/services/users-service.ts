import type { UsersService } from "@/application/ports";
import { delay } from "@/utils";

export const usersService: UsersService = {
  getUserId: async () => {
    await delay(300);

    return "";
  },
};
