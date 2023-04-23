//#region notification
export interface NotificationService {
  notify: (message: string) => void;
  error: (error: unknown) => void;
}
//#endregion
