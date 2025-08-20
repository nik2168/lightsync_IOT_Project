import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChannelFormState {
  logoUri: string | null;
  broadcastType: string;
  channelName: string;
  media: string;
  phoneNumber: string;
  pinCode: any;
  channelEmail: string;
  managementDetails: {
    managerName: string;
    phoneNumber: string;
  };
  marketingDetails: {
    managerName: string;
    phoneNumber: string;
  };
  financialDetails: {
    phoneNumber: string;
    emergencyPhoneNumber: string;
  };
  description: string;
  incomeTaxInformation: {
    gstNumber: string;
    panNumber: string;
  };
  // Add other fields if needed from other screens
}

const initialState: ChannelFormState = {
  logoUri: null,
  broadcastType: "Satelite",
  channelName: "",
  media: "",
  phoneNumber: "",
  pinCode: "",
  channelEmail: "",
  managementDetails: {
    managerName: "",
    phoneNumber: "",
  },
  marketingDetails: {
    managerName: "",
    phoneNumber: "",
  },
  financialDetails: {
    phoneNumber: "",
    emergencyPhoneNumber: "",
  },
  description: "",
  incomeTaxInformation: {
    gstNumber: "",
    panNumber: "",
  },
};

type UpdatePayload = {
  field: keyof ChannelFormState;
  value: ChannelFormState[keyof ChannelFormState]; // allows nested objects, strings, etc.
};

const channelFormSlice = createSlice({
  name: "newsForm",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<UpdatePayload>) {
      const { field, value } = action.payload;
      state[field] = value as any;
    },
    resetForm: () => initialState,
    resetForm2(state) {
      state["managementDetails"] = {
        managerName: "",
        phoneNumber: "",
      };
      state["marketingDetails"] = {
        managerName: "",
        phoneNumber: "",
      };
      state["financialDetails"] = {
        phoneNumber: "",
        emergencyPhoneNumber: "",
      };
      (state["incomeTaxInformation"] = {
        gstNumber: "",
        panNumber: "",
      }),
        (state["description"] = "");
    },
  },
});

export const { updateField, resetForm, resetForm2 } = channelFormSlice.actions;
export default channelFormSlice.reducer;
