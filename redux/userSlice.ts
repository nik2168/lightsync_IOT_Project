import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

interface User {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    image: string;
    about: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface userState {
  user: User | null;
  token: string | null;
}

const initialState: userState = {
  user: (() => {
    const storedUser = SecureStore.getItem("press-user");
    return storedUser ? JSON.parse(storedUser) : null;
  })(),
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<userState>) => {
      state.user = action.payload.user;
      SecureStore.setItem("press-user", JSON.stringify(action.payload.user));
      if (action.payload.token)
        SecureStore.setItem("press-token", action.payload.token);
      console.log("Token stored:", action.payload.token);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      SecureStore.deleteItemAsync("press-user");
      SecureStore.deleteItemAsync("press-token");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
