// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import newsFormReducer from "./newsFormSlice";
import channelReducer from "./createChannelSlice";
import promotionReducer from "./promotionSlice";
import userReducer from "./userSlice";
import api from "./api";
import lightSyncReducer from "./lightSyncSlice";

export const store = configureStore({
  reducer: {
    newsForm: newsFormReducer,
    channelForm: channelReducer,
    promotionForm: promotionReducer,
    userState: userReducer,
    lightSyncState: lightSyncReducer,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
