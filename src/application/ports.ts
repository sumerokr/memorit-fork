export interface UsersService {
  getUserId: () => Promise<string | null>;
}

//#region notification
export interface NotificationService {
  notify: (message: string) => void;
  error: (error: unknown) => void;
}
//#endregion
