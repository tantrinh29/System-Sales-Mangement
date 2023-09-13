import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATION,
  NotificationActionTypes,
} from "./types";

const addNotification = (
  id: string,
  message: string
): NotificationActionTypes => {
  return { type: ADD_NOTIFICATION, payload: { id: id, message: message } };
};

const clearNotification = (): NotificationActionTypes => {
  return { type: CLEAR_NOTIFICATION };
};

export { addNotification, clearNotification };
