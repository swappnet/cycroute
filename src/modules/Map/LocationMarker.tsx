import { Circle } from 'react-leaflet';
import { useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/redux-hooks';
import { LatLngExpression } from 'leaflet';

function LocationMarker() {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

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
