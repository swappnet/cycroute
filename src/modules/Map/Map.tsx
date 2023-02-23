import { useState, useMemo } from 'react';

import * as L from 'leaflet'; // Leaflet import

//Hooks import
import { useAppSelector } from '../../hooks/redux-hooks';
import GetPositionByDragging from './GetDragPosition';
import useUpdateMapView from '../../hooks/updateMapView';
import useRenderRouting from '../../hooks/renderRouting';
import useClickedCoords from '../../hooks/updateClickedCoords';
import useRenderPolyline from '../../hooks/renderPolyline';
import useRenderMarkers from '../../hooks/renderMarkers';

//Components import
import Contributors from '../../components/Contributors/Contributors';
import StyleMap from './TileLayer';
import { MapContainer, ZoomControl } from 'react-leaflet';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import LocationMarker from './LocationMarker';
import useFitBoundsOnClick from '../../hooks/fitBounds';

export default function Map() {
  const [map, setMap] = useState<L.Map | null>(null); // Create map Ref with state

  //---Hooks---
  useClickedCoords(map);
  useUpdateMapView(map);
  useRenderRouting(map);
  useRenderPolyline(map);
  useRenderMarkers(map);
  useFitBoundsOnClick(map);
  //---HooksEnd---

  const geocoderCoords = useAppSelector((state) => state.geocoderReducer); // Coords that can change map center
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
        ref={setMap} // Getting ref of the map and set it in the state
      >
        <StyleMap />
        <GetPositionByDragging />
        <LocationMarker />
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
