// store/promotionFormSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PromotionFormState {
  businessName: string;
  city: string;
  ownerName: string;
  phoneNumber: string;
  category: string;
  typeOfPromotion: string;
  mediaUri: string | null;
  description: string;
}

const initialState: PromotionFormState = {
  businessName: "",
  city: "",
  ownerName: "",
  phoneNumber: "",
  category: "",
  typeOfPromotion: "",
  mediaUri: null,
  description: "",
};

type UpdatePayload = {
  field: keyof PromotionFormState;
  value: string | null;
};

const promotionFormSlice = createSlice({
  name: "newsForm",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<UpdatePayload>) {
      const { field, value } = action.payload;
      state[field] = value as any;
    },
    resetForm: () => initialState,
    resetForm2(state) {
      state["category"] = "";
      state["typeOfPromotion"] = "";
      state["description"] = "";
      state["mediaUri"] = null;
    },
  },
});

export const { updateField, resetForm, resetForm2 } =
  promotionFormSlice.actions;
export default promotionFormSlice.reducer;
