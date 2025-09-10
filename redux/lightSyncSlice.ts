import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MotionAlert {
  id: string;
  location: string;
  time: string;
  timestamp?: number;
}

interface LedState {
  temperature: number;
  humidity: number;
  redLedState: boolean;
  greenLedState: boolean;
  yellowLedState: boolean;
  allLightsState: boolean;
  motionDetected: boolean;
  motionAlerts: MotionAlert[];
  greenLedBrightness: number; // 0-255 value from ESP32
}

const initialState: LedState = {
  temperature: 26.6,
  humidity: 78,
  redLedState: false,
  greenLedState: false,
  yellowLedState: false,
  allLightsState: false,
  motionDetected: false,
  motionAlerts: [],
  greenLedBrightness: 128, // Default middle brightness
};

const ledSlice = createSlice({
  name: "leds",
  initialState,
  reducers: {
    updateSensorData(
      state,
      action: PayloadAction<{
        temperature: number;
        humidity: number;
      }>
    ) {
      state.temperature = action.payload.temperature;
      state.humidity = action.payload.humidity;
    },

    updateLedStates(
      state,
      action: PayloadAction<
        Partial<{
          redLedState: boolean;
          greenLedState: boolean;
          yellowLedState: boolean;
          allLightsState: boolean;
        }>
      >
    ) {
      if (action.payload.redLedState !== undefined) {
        state.redLedState = action.payload.redLedState;
      }
      if (action.payload.greenLedState !== undefined) {
        state.greenLedState = action.payload.greenLedState;
      }
      if (action.payload.yellowLedState !== undefined) {
        state.yellowLedState = action.payload.yellowLedState;
      }
      if (action.payload.allLightsState !== undefined) {
        state.allLightsState = action.payload.allLightsState;
      }
    },

    // Individual light toggles for optimistic updates
    toggleRedLed(state) {
      state.redLedState = !state.redLedState;
    },

    toggleGreenLed(state) {
      state.greenLedState = !state.greenLedState;
    },

    toggleYellowLed(state) {
      state.yellowLedState = !state.yellowLedState;
    },

    toggleAllLights(state) {
      state.allLightsState = !state.allLightsState;
    },

    updateMotionDetected(state, action: PayloadAction<boolean>) {
      state.motionDetected = action.payload;
    },

    addMotionAlert(state, action: PayloadAction<MotionAlert>) {
      state.motionAlerts.unshift(action.payload);
      // Keep only last 500 alerts
      if (state.motionAlerts.length > 500) {
        state.motionAlerts.pop();
      }
    },

    clearMotionAlerts(state) {
      state.motionAlerts = [];
    },

    updateGreenBrightness(state, action: PayloadAction<number>) {
      state.greenLedBrightness = action.payload;
    },
  },
});

export const {
  updateSensorData,
  updateLedStates,
  toggleRedLed,
  toggleGreenLed,
  toggleYellowLed,
  toggleAllLights,
  updateMotionDetected,
  addMotionAlert,
  clearMotionAlerts,
  updateGreenBrightness,
} = ledSlice.actions;

export default ledSlice.reducer;
