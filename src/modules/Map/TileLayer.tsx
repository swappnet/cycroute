import { useMemo, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { useAppSelector } from '../../hooks/redux-hooks';

function StyleMap() {
  const [mapUrl, setMapUrl] = useState<string>('');
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);
  const layer = useAppSelector((state) => state.controlsReducer);

  useMemo(() => {
    if (layer.layer === 'default') {
      darkMode === 'dark'
        ? setMapUrl(
            'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          )
        : setMapUrl(
            'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
          );
    } else if (layer.layer === 'satellite') {
      setMapUrl(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      );
    }
  }, [layer.layer]);

  return <TileLayer url={mapUrl} />;
}

export default StyleMap;
