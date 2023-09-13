import { INotification } from "../../types";
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATION,
  NotificationActionTypes,
} from "./types";

export interface NotificationState {
  items: INotification[];
}

const initialState: NotificationState = {
  items: [],
};
const notificationReducer = (
  state: NotificationState = initialState,
  action: NotificationActionTypes
): NotificationState => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      state.items.push({
        id: action.payload.id,
        message: action.payload.message,
        date: Date.now(),
        read: false,
      });
      return state;

    case CLEAR_NOTIFICATION:
      return {
        items: [],
      };
    default:
      return state;
  }
};
export { notificationReducer };
