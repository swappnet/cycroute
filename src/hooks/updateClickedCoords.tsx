import { useState, useEffect } from 'react';
import { updateDrawCoords } from '../reducers/drawReducer';
import { useAppDispatch, useAppSelector } from './redux-hooks';

const useClickedCoords = (e: L.Map | null) => {
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const dispatch = useAppDispatch();

  // Creating state for clicked coords ( map )
  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!e) return;

    // Check if 'Hand' or 'Road' is active and update clicked coords state only if
    // one of those is active
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

    // When clicked coords state is updating, change draw coords and draw markers and route on map

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
