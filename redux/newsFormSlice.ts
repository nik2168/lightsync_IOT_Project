// store/newsFormSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NewsFormState {
  headline: string;
  selectedContentType: string;
  selectedCategory: string;
  description: string;
  mediaUri: string | null;
  location: any;
}

const initialState: NewsFormState = {
  headline: "",
  selectedContentType: "Video",
  selectedCategory: "Public",
  description: "",
  mediaUri: null,
  location: "Current location (Default)",
};

type UpdatePayload = {
  field: keyof NewsFormState;
  value: string | null;
};

const newsFormSlice = createSlice({
  name: "newsForm",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<UpdatePayload>) {
      const { field, value } = action.payload;
      state[field] = value as any;
    },
    resetForm: () => initialState,
    resetForm2(state) {
      state["description"] = "";
      state["mediaUri"] = null;
    },
  },
});

export const { updateField, resetForm, resetForm2 } = newsFormSlice.actions;
export default newsFormSlice.reducer;
