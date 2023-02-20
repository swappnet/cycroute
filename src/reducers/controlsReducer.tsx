import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGeocoderReducer } from './geocoderReducer';

interface IControlsReducer {
  draw: string;
  layer: string;
  darkMode: string;
  isLocationFound: boolean;
  colorPicker: { color: string; isOpen: boolean };
  currentCoords: { lat: number; lng: number };
}

const initialState: IControlsReducer = {
  draw: 'None',
  layer: 'default',
  darkMode: 'light',
  isLocationFound: false,
  colorPicker: { color: '#00ACC1', isOpen: false },
  currentCoords: {
    lat: 50.45,
    lng: 30.5241,
  },
};

export const controlsReducer = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    changeLocationStatus: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLocationFound: action.payload,
      };
    },
    showColorPicker: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        colorPicker: { ...state.colorPicker, isOpen: action.payload },
      };
    },
    changeLineColor: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        colorPicker: { ...state.colorPicker, color: action.payload },
      };
    },
    changeDraw: (state, action) => {
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

export const {
  changeDraw,
  changeLayer,
  changeCurrentCoords,
  switchDark,
  changeLineColor,
  showColorPicker,
  changeLocationStatus,
} = controlsReducer.actions;
export default controlsReducer.reducer;
