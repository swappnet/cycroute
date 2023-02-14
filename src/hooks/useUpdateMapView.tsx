import { useAppSelector } from './redux-hooks';
import { useEffect } from 'react';

const useUpdateMapView = (e: L.Map | null) => {
  const geocoderCoords = useAppSelector((state) => state.geocoderReducer);

  useEffect(() => {
    if (!e) return;

    if (e) {
      e.setView([geocoderCoords.lat, geocoderCoords.lng], geocoderCoords.zoom);
    }
  }, [e, geocoderCoords]);
};
export default useUpdateMapView;
