import { useState, useEffect } from 'react';
import { updateDrawCoords } from '../reducers/drawReducer';
import { useAppDispatch, useAppSelector } from './redux-hooks';

const useClickedCoords = (e: L.Map | null) => {
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const dispatch = useAppDispatch();

  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!e) return;

    if (e) {
      if (drawType === 'None') return;
      if (drawType === 'Hand' || 'Road') {
        e.on('click', (e: { latlng: { lat: number; lng: number } }) => {
          setClickedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }
  }, [e, drawType]);

  useEffect(() => {
    if (!clickedCoords) return;

    if (clickedCoords && drawType === 'Road') {
      dispatch(updateDrawCoords(clickedCoords));
    } else if (clickedCoords && drawType === 'Hand') {
      dispatch(updateDrawCoords(clickedCoords));
    } else {
      setClickedCoords(null);
    }
  }, [clickedCoords]);
};

export default useClickedCoords;
