import type { UsersService } from "@/application/ports";
import { delay } from "@/utils";

export const usersService: UsersService = {
  getUserId: async () => {
    await delay(30);

    return "13b3bed0-9e48-488f-82c6-407077ae9e08";
  },
};
