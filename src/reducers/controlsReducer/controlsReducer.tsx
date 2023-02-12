import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGeocoderReducer } from '../geocoderReducer/geocoderReducer';

interface IControlsReducer {
  draw: string;
  layer: string;
  darkMode: string;
  currentCoords: { lat: number; lng: number };
}

const initialState: IControlsReducer = {
  draw: 'None',
  layer: 'default',
  darkMode: 'light',
  currentCoords: {
    lat: 50.45,
    lng: 30.5241,
  },
};

export const controlsReducer = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    changeDraw: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        draw: action.payload,
      };
    },
    changeLayer: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        layer: action.payload,
      };
    },
    switchDark: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        darkMode: action.payload,
      };
    },
    changeCurrentCoords: (
      state,
      action: PayloadAction<{
        currentCoords: { lat: number; lng: number; zoom?: number };
      }>
    ) => {
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

export const { changeDraw, changeLayer, changeCurrentCoords, switchDark } =
  controlsReducer.actions;
export default controlsReducer.reducer;
