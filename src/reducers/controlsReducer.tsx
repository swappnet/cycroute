import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IControlsReducer {
  // Declare types for initial state
  draw: string;
  layer: string;
  darkMode: string;
  isFitBounds: boolean;
  isLocationFound: boolean;
  colorPicker: { color: string; isOpen: boolean };
  currentCoords: { lat: number; lng: number };
}

const initialState: IControlsReducer = {
  draw: 'None',
  layer: 'default',
  darkMode: 'light',
  isLocationFound: false,
  isFitBounds: false,
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
    // Is map should fit bounds of the route
    changeFitBounds: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isFitBounds: action.payload,
      };
    },
    // Is location is found or not
    changeLocationStatus: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLocationFound: action.payload,
      };
    },
    // Display color picker
    showColorPicker: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        colorPicker: { ...state.colorPicker, isOpen: action.payload },
      };
    },
    // Change route color
    changeLineColor: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        colorPicker: { ...state.colorPicker, color: action.payload },
      };
    },
    // Change Draw type - possible types are 'Hand' or 'Road', default 'None'
    changeDraw: (state, action) => {
      return {
        ...state,
        draw: action.payload,
      };
    },
    // Change map tile layer, possible values are 'default' or 'satellite'
    changeLayer: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        layer: action.payload,
      };
    },
    // Change theme, possible values are 'dark' or 'light'
    switchDark: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        darkMode: action.payload,
      };
    },
    // Change current LatLng, center of the map
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
  changeFitBounds,
} = controlsReducer.actions;
export default controlsReducer.reducer;
