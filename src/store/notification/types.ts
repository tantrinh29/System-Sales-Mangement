export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION";

interface AddNotification {
  type: typeof ADD_NOTIFICATION;
  payload: {
    id: string;
    message: string;
  };
}

interface ClearNotification {
  type: typeof CLEAR_NOTIFICATION;
}

export type NotificationActionTypes = AddNotification | ClearNotification;
