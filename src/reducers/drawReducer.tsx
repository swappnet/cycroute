import { createSlice } from "@reduxjs/toolkit";

interface IDrawCoords {
  lat?: string;
  lng?: string;
}

interface IDrawReducer {
  drawInfo: { time: string; dist: string };
  drawCoords: IDrawCoords[];
  exportCoords: IDrawCoords[];
  drawCoordsDeleted: IDrawCoords[];
  drawCoordsFuture: IDrawCoords[];
}

const initialState: IDrawReducer = {
  drawInfo: { time: "0000", dist: "0000" },
  drawCoords: [],
  exportCoords: [],
  drawCoordsDeleted: [],
  drawCoordsFuture: [],
};

export const drawReducer = createSlice({
  name: "draw",
  initialState,
  reducers: {
    updateExportCoords: (state, action) => {
      return {
        ...state,
        exportCoords: action.payload,
      };
    },
    updateDrawInfo: (state, action) => {
      return {
        ...state,
        drawInfo: {
          ...state.drawInfo,
          time: action.payload.time,
          dist: action.payload.dist,
        },
      };
    },
    updateDrawCoords: (state, action) => {
      return {
        ...state,
        drawCoords: [
          ...state.drawCoords,
          {
            lat: action.payload.lat,
            lng: action.payload.lng,
          },
        ],
        drawCoordsDeleted: [],
        drawCoordsFuture: [],
      };
    },
    undoDrawCoords: (state) => {
      if (state.drawCoords.length === 0) return;
      if (state.drawCoords.length !== 0) {
        return {
          ...state,
          drawCoordsFuture: [
            ...state.drawCoordsFuture,
            ...state.drawCoords.slice(-1),
          ],
          drawCoords: state.drawCoords.filter(
            (index) => index !== state.drawCoords.length - 1
          ),
        };
      }
    },
    redoDrawCoords: (state) => {
      if (state.drawCoordsDeleted.length === 0) {
        return {
          ...state,
          drawCoords: [
            ...state.drawCoords,
            ...state.drawCoordsFuture.slice(-1),
          ],
          drawCoordsFuture: [
            ...state.drawCoordsFuture.filter(
              (index) => index !== state.drawCoordsFuture.length - 1
            ),
          ],
        };
      } else if (
        state.drawCoordsFuture.length === 0 &&
        state.drawCoordsDeleted.length > 0
      ) {
        return {
          ...state,
          drawCoords: [...state.drawCoordsDeleted],
          drawCoordsDeleted: [],
        };
      }
    },
    deleteDrawCoords: (state) => {
      if (state.drawCoords.length === 0) return;
      if (state.drawCoords.length !== 0) {
        return {
          ...state,
          drawCoordsDeleted: [...state.drawCoords],
          drawCoords: [],
          drawCoordsFuture: [],
          exportCoords: [],
        };
      }
    },
  },
});

export const {
  updateDrawInfo,
  updateDrawCoords,
  deleteDrawCoords,
  undoDrawCoords,
  redoDrawCoords,
  updateExportCoords,
} = drawReducer.actions;
export default drawReducer.reducer;
