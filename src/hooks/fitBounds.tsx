import { useEffect } from 'react';

import * as L from 'leaflet';

import { useAppSelector, useAppDispatch } from './redux-hooks';
import { changeFitBounds } from '../reducers/controlsReducer';

const useFitBoundsOnClick = (e: L.Map | null) => {
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const isFitBounds = useAppSelector(
    (state) => state.controlsReducer.isFitBounds
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (e && isFitBounds) {
      e.fitBounds(drawCoords as L.LatLngBoundsExpression);
      dispatch(changeFitBounds(false));
    }
  }, [isFitBounds, drawCoords]);
};

export default useFitBoundsOnClick;
