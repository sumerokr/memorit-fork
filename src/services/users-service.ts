import type { UsersService } from "@/application/ports";
import { supabase } from "@/supabase";
import { notificationService } from "./notification-service";

export const usersService: UsersService = {
  getUserId: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      notificationService.error(error);
      return null;
    }

    return data.session?.user.id ?? null;
  },
};
