import { useState, useMemo } from 'react';

import * as L from 'leaflet';

//Hooks import
import GetPositionByDragging from './GetDragPosition';
import useUpdateMapView from '../../hooks/useUpdateMapView';
import useRenderRouting from '../../hooks/useRenderRouting';
import useClickedCoords from '../../hooks/useClickedCoords';
import useRenderPolyline from '../../hooks/useRenderPolyline';
import useRenderMarkers from '../../hooks/useRenderMarkers';

//Components import
import Contributors from '../../components/Contributors/Contributors';
import StyleMap from './TileLayer';
import { MapContainer, ZoomControl } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { useAppSelector } from '../../hooks/redux-hooks';

export default function Map() {
  const [map, setMap] = useState<L.Map | null>(null); // Create map Ref with state

  //---Hooks---
  useClickedCoords(map);
  useUpdateMapView(map);
  useRenderRouting(map);
  useRenderPolyline(map);
  useRenderMarkers(map);
  //---HooksEnd---

  const geocoderCoords = useAppSelector((state) => state.geocoderReducer);
  const layer = useAppSelector((state) => state.controlsReducer);

  const mapWrapper = useMemo(
    () => (
      <MapContainer
        attributionControl={false}
        zoomControl={false}
        center={[50, 30]}
        zoom={9}
        minZoom={2}
        scrollWheelZoom={true}
        className="map--wrapper"
        ref={setMap}
      >
        <StyleMap />
        <GetPositionByDragging />
        <ZoomControl position="bottomright" />
      </MapContainer>
    ),
    [geocoderCoords, layer.layer]
  );

  return (
    <>
      {mapWrapper}
      <Contributors />
    </>
  );
}
