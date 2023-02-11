import { createSlice } from "@reduxjs/toolkit";

interface IGeocoderReducer {
  lat: number;
  lng: number;
  zoom: number;
}

const initialState: IGeocoderReducer = {
  lat: 50.45,
  lng: 30.5241,
  zoom: 9,
};

export const geocoderReducer = createSlice({
  name: "geocoderLatLng",
  initialState,
  reducers: {
    addLatLng: (state, action) => {
      return {
        ...state,
        lat: action.payload.lat,
        lng: action.payload.lng,
        zoom: action.payload.zoom,
      };
    },
  },
});

export const { addLatLng } = geocoderReducer.actions;
export default geocoderReducer.reducer;
