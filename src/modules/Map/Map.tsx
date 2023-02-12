import { useState, useMemo, useEffect, useRef } from 'react';
import GeoUtil from 'leaflet-geometryutil';

import * as L from 'leaflet';
import 'leaflet-routing-machine';

import Contributors from '../../components/Contributors/Contributors';

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  updateDrawCoords,
  updateDrawInfo,
  updateExportCoords,
} from '../../reducers/drawReducer/drawReducer';
import { changeCurrentCoords } from '../../reducers/controlsReducer/controlsReducer';

import startMarker from '../../assets/start-marker.svg';
import midMarker from '../../assets/mid-marker.svg';
import finishMarker from '../../assets/finish-marker.svg';

export default function Map() {
  const [map, setMap] = useState<L.Map | null>(null);

  const geocoderCoords = useAppSelector((state) => state.geocoderReducer);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const layer = useAppSelector((state) => state.controlsReducer);
  const drawInfo = useAppSelector((state) => state.drawReducer.drawInfo);
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!map) return;

    if (map) {
      map.setView(
        [geocoderCoords.lat, geocoderCoords.lng],
        geocoderCoords.zoom
      );
    }
  }, [map, geocoderCoords]);

  function StyleMap() {
    const [mapUrl, setMapUrl] = useState<string>('');

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

  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    if (map) {
      if (drawType === 'None') return;
      if (drawType === 'Hand' || 'Road') {
        map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
          setClickedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }
  }, [map, drawType]);

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

  const [routingMachine, setRoutingMachine] = useState<L.Control | null>(null);
  const RoutingMachineRef = useRef<L.Control | null>(null);
  let key = import.meta.env.VITE_MAPBOX_API;

  useEffect(() => {
    if (!map) return;
    if (map) {
      const plan = new L.Routing.Plan(drawCoords as any, {
        createMarker: function () {
          return false;
        },
      });

      RoutingMachineRef.current = L.Routing.control({
        waypoints: drawCoords as any,
        router: L.Routing.mapbox(key, {
          profile: 'mapbox/cycling',
        }),
        fitSelectedRoutes: false,
        waypointMode: 'snap',
        show: false,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: '#00ACC1', opacity: 1, weight: 4 }],
          extendToWaypoints: false,
          missingRouteTolerance: 0,
          addWaypoints: false,
        },

        plan,
      });

      setRoutingMachine(RoutingMachineRef.current);
      return () => {
        if (RoutingMachineRef.current) {
          map.removeControl(RoutingMachineRef.current);
        }
      };
    }
  }, [map, drawCoords]);

  useEffect(() => {
    if (!routingMachine) return;
    if (!map) return;

    if (map) {
      if (routingMachine && drawType === 'Road') {
        routingMachine.addTo(map);
      } else if (routingMachine && drawType === 'Hand') {
        map.removeControl(routingMachine);
      }
    }
  }, [routingMachine, drawType, map]);

  const [drawPolyline, setDrawPolyline] = useState<L.Polyline | null>(null);

  useEffect((): any => {
    const markersLayer = L.layerGroup();
    if (map) {
      drawCoords.forEach((coords: any, i) => {
        let lastIndex = drawCoords.length - 1;
        if (i === 0) {
          return L.marker(coords, {
            alt: '',
            icon: L.icon({
              iconUrl: startMarker,
              iconSize: [33, 33],
              iconAnchor: [6, 25],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
        if (i > 0 && i < lastIndex) {
          return L.marker(coords, {
            alt: '',
            icon: L.icon({
              iconUrl: midMarker,
              iconSize: [18, 18],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
        if (i === lastIndex && drawCoords.length > 1) {
          return L.marker(coords, {
            alt: '',
            icon: L.icon({
              iconUrl: finishMarker,
              iconSize: [33, 33],
              iconAnchor: [13, 32],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
      });

      markersLayer.addTo(map);
      return () => map.removeLayer(markersLayer);
    }
  }, [drawCoords]);

  useEffect(() => {
    if (!routingMachine) return;

    if (routingMachine) {
      (routingMachine as any).on('routesfound', function (e: { routes: any }) {
        dispatch(
          updateDrawInfo({
            time: String(e.routes[0].summary.totalTime / 3600)
              .slice(0, 5)
              .replace('.', ','),
            dist: Math.floor(e.routes[0].summary.totalDistance / 1000),
          })
        );
        dispatch(updateExportCoords(e.routes[0].coordinates));
      });
    }
  }, [routingMachine, drawInfo]);

  useEffect((): any => {
    if (!map) return;

    if (map) {
      const polyline = L.polyline(drawCoords as any, {
        color: '#00ACC1',
        weight: 4,
      });

      if (polyline) {
        setDrawPolyline(polyline);
        return () => polyline.remove();
      }
    }
  }, [map, drawCoords]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (map) {
      if (drawPolyline && drawType === 'Hand') {
        drawPolyline.addTo(map);
        dispatch(updateExportCoords(drawCoords));
      } else if (drawPolyline && drawType === 'Road') {
        drawPolyline.remove();
      }
    }
  }, [drawPolyline, drawType, map]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (drawPolyline && drawType === 'Hand') {
      const polylineDist = GeoUtil.accumulatedLengths(drawPolyline);
      for (let i = 0; i < polylineDist.length; i++) {
        dispatch(
          updateDrawInfo({
            time: String(polylineDist[i] / 1000 / 11)
              .slice(0, 5)
              .replace('.', ','),
            dist: Math.floor(polylineDist[i] / 1000),
          })
        );
        if (drawCoords.length === 0) {
          dispatch(
            updateDrawInfo({
              time: '0000',
              dist: '0000',
            })
          );
        }
      }
    }
  }, [drawPolyline, drawCoords, drawType]);

  function GetPositionByDragging() {
    useMapEvents({
      drag: (e: L.LeafletEvent) => {
        dispatch(
          changeCurrentCoords({
            currentCoords: {
              lat: e.target.getCenter().lat,
              lng: e.target.getCenter().lng,
              zoom: e.target.getZoom(),
            },
          })
        );
      },
    });
    return null;
  }

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
