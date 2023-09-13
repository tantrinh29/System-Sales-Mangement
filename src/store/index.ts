import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import authReducer, { AuthState } from "./auth/reducers";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";
import { setAuthToken } from "../helpers/setToken";
import {
  NotificationState,
  notificationReducer,
} from "./notification/reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

interface RootState {
  auth: AuthState;
  notification: NotificationState;
}

const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type AppState = ReturnType<typeof rootReducer>;

const configureStore = () => {
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  return createStore(persistedReducer, composeEnhancers(middlewareEnhancer));
};

const store = configureStore();
const persistedStore = persistStore(store);

export { store, persistedStore };
