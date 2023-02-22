import { Circle, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/redux-hooks';

function LocationMarker() {
  const [position, setPosition] = useState<any>(null);

  const isLocationFound = useAppSelector(
    (state) => state.controlsReducer.isLocationFound
  );

  const currentCoords = useAppSelector(
    (state) => state.controlsReducer.currentCoords
  );

  useEffect(() => {
    if (isLocationFound) {
      setPosition(currentCoords);
    } else if (!isLocationFound) {
      const timer: number = window.setTimeout(() => {
        setPosition(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLocationFound, currentCoords]);

  function LocationMarkerInner() {
    return position === null ? null : (
      <Circle center={position} radius={120} fillOpacity={0.5} />
    );
  }

  return <LocationMarkerInner />;
}

export default LocationMarker;
