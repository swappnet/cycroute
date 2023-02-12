import geocoderReducer from './geocoderReducer';
import controlsReducer from './controlsReducer';
import drawReducer from './drawReducer';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    geocoderReducer: geocoderReducer,
    controlsReducer: controlsReducer,
    drawReducer: drawReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
