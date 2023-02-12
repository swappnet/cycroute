import { createSlice } from "@reduxjs/toolkit";

interface IControlsReducer {
  draw: string;
  layer: string;
  darkMode: string;
  currentCoords: { lat: number; lng: number };
}

const initialState: IControlsReducer = {
  draw: "None",
  layer: "default",
  darkMode: "light",
  currentCoords: {
    lat: 50.45,
    lng: 30.5241,
  },
};

export const controlsReducer = createSlice({
  name: "controls",
  initialState,
  reducers: {
    updateLocation: (state, action) => {
      return {
        ...state,
        location: action.payload,
      };
    },
    changeDraw: (state, action) => {
      return {
        ...state,
        draw: action.payload,
      };
    },
    changeLayer: (state, action) => {
      return {
        ...state,
        layer: action.payload,
      };
    },
    switchDark: (state, action) => {
      return {
        ...state,
        darkMode: action.payload,
      };
    },
    changeCurrentCoords: (state, action) => {
      return {
        ...state,
        currentCoords: {
          lat: action.payload.currentCoords.lat,
          lng: action.payload.currentCoords.lng,
        },
      };
    },
  },
});

export const {
  changeDraw,
  changeLayer,
  changeCurrentCoords,
  updateLocation,
  switchDark,
} = controlsReducer.actions;
export default controlsReducer.reducer;
