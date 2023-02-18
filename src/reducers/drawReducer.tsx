import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IDrawCoords {
  lat?: number;
  lng?: number;
}

interface IDrawReducer {
  drawInfo: { time?: number | string; dist?: string | number };
  drawCoords: IDrawCoords[];
  exportCoords: IDrawCoords[];
  drawCoordsDeleted: IDrawCoords[];
  drawCoordsFuture: IDrawCoords[];
}

const initialState: IDrawReducer = {
  drawInfo: { time: '0000', dist: '0000' },
  drawCoords: [],
  exportCoords: [],
  drawCoordsDeleted: [],
  drawCoordsFuture: [],
};

export const drawReducer = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    updateExportCoords: (state, action) => {
      return {
        ...state,
        exportCoords: action.payload,
      };
    },
    updateDrawInfo: (
      state,
      action: PayloadAction<{ time: number | string; dist: number | string }>
    ) => {
      return {
        ...state,
        drawInfo: {
          ...state.drawInfo,
          time: action.payload.time,
          dist: action.payload.dist,
        },
      };
    },
    updateDrawCoords: (state, action: PayloadAction<IDrawCoords>) => {
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
    undoDrawCoords: (state, index) => {
      if (state.drawCoords.length === 0) return;
      if (state.drawCoords.length !== 0) {
        return {
          ...state,
          drawCoordsFuture: [
            ...state.drawCoordsFuture,
            ...state.drawCoords.slice(-1),
          ],
          drawCoords: state.drawCoords.filter(
            (item, index) => index !== state.drawCoords.length - 1
          ),
        };
      }
    },
    redoDrawCoords: (state, index) => {
      if (state.drawCoordsDeleted.length === 0) {
        return {
          ...state,
          drawCoords: [
            ...state.drawCoords,
            ...state.drawCoordsFuture.slice(-1),
          ],
          drawCoordsFuture: [
            ...state.drawCoordsFuture.filter(
              (item, index) => index !== state.drawCoordsFuture.length - 1
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
    deleteDrawCoords: (state, index) => {
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
