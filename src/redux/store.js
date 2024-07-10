import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import userReducer from "./slice/user.slice";
import playlistReducer from "./slice/playlist.slice";
import songReducer from "./slice/song.slice";
import systemReducer from "./slice/system.slice";
import libraryReducer from "./slice/library.slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};
const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  playlist: playlistReducer,
  song: songReducer,
  system: systemReducer,
  library: libraryReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
