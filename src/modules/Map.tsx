import { useState, useMemo, useEffect, useRef } from "react";
import GeoUtil from "leaflet-geometryutil";

import Contributors from "../components/Contributors";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import { useSelector, useDispatch } from "react-redux";
import {
  updateDrawCoords,
  updateDrawInfo,
  updateExportCoords,
} from "../reducers/drawReducer";
import { changeCurrentCoords } from "../reducers/controlsReducer";

import startMarker from "../assets/start-marker.svg";
import midMarker from "../assets/mid-marker.svg";
import finishMarker from "../assets/finish-marker.svg";

export default function Map() {
  const [map, setMap] = useState(null);

  const geocoderCoords = useSelector((state) => state.geocoderReducer);
  const drawType = useSelector((state) => state.controlsReducer.draw);
  const layer = useSelector((state) => state.controlsReducer);
  const drawInfo = useSelector((state) => state.drawReducer.drawInfo);
  const drawCoords = useSelector((state) => state.drawReducer.drawCoords);
  const darkMode = useSelector((state) => state.controlsReducer.darkMode);

  const dispatch = useDispatch();

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
    const [mapUrl, setMapUrl] = useState("");

    useMemo(() => {
      if (layer.layer === "default") {
        darkMode === "dark"
          ? setMapUrl(
              "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            )
          : setMapUrl(
              "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            );
      } else if (layer.layer === "satellite") {
        setMapUrl(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        );
      }
    }, [layer.layer]);

    return <TileLayer url={mapUrl} />;
  }

  const [clickedCoords, setClickedCoords] = useState(null);

  useEffect(() => {
    if (!map) return;

    if (map) {
      if (drawType === "None") return;
      if (drawType === "Hand" || "Road") {
        map.on("click", (e) => {
          setClickedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }
  }, [map, drawType]);

  useEffect(() => {
    if (!clickedCoords) return;

    if (clickedCoords && drawType === "Road") {
      dispatch(updateDrawCoords(clickedCoords));
    } else if (clickedCoords && drawType === "Hand") {
      dispatch(updateDrawCoords(clickedCoords));
    } else {
      setClickedCoords(null);
    }
  }, [clickedCoords]);

  const [routingMachine, setRoutingMachine] = useState(null);
  const RoutingMachineRef = useRef(null);
  let key = import.meta.env.VITE_MAPBOX_API;

  useEffect(() => {
    if (!map) return;
    if (map) {
      RoutingMachineRef.current = L.Routing.control({
        waypoints: drawCoords,
        router: L.Routing.mapbox(key, {
          profile: "mapbox/cycling",
        }),
        fitSelectedRoutes: false,
        waypointMode: "snap",
        show: false,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: "#00ACC1", opacity: 1, weight: 3 }],
        },
        createMarker: function (i, wp, nWps) {
          if (i === 0) {
            return L.marker(wp.latLng, {
              alt: "",
              icon: L.icon({
                iconUrl: startMarker,
                iconSize: [33, 33],
                iconAnchor: [6, 25],
              }),
              draggable: false,
            });
          }
          if (i > 0 && i < nWps - 1) {
            return L.marker(wp.latLng, {
              alt: "",
              icon: L.icon({
                iconUrl: midMarker,
                iconSize: [28, 28],
              }),
              draggable: false,
            });
          }
          if (i === nWps - 1) {
            return L.marker(wp.latLng, {
              alt: "",
              icon: L.icon({
                iconUrl: finishMarker,
                iconSize: [33, 33],
                iconAnchor: [10, 30],
              }),
              draggable: false,
            });
          }
        },
      });

      setRoutingMachine(RoutingMachineRef.current);
      return () => map.removeControl(RoutingMachineRef.current);
    }
  }, [map, drawCoords]);

  useEffect(() => {
    if (!routingMachine) return;
    if (!map) return;

    if (map) {
      if (routingMachine && drawType === "Road") {
        routingMachine.addTo(map);
      } else if (routingMachine && drawType === "Hand") {
        map.removeControl(routingMachine);
      }
    }
  }, [routingMachine, drawType, map]);

  const [drawPolyline, setDrawPolyline] = useState(null);
  const [drawPolylineMarkers, setDrawPolylineMarkers] = useState(null);

  useEffect(() => {
    if (!drawPolyline) return;

    if (drawPolyline && drawType === "Hand") {
      let startMarkerI, midMarkerI, finishMarkerI;
      const markersLayer = L.layerGroup();
      drawCoords.forEach((element, i) => {
        let lastIndex = drawCoords.length - 1;
        if (i === 0) {
          startMarkerI = L.marker(element, {
            alt: "",
            icon: L.icon({
              iconUrl: startMarker,
              iconSize: [33, 33],
              iconAnchor: [6, 25],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
        if (i > 0 && i < lastIndex) {
          midMarkerI = L.marker(element, {
            alt: "",
            icon: L.icon({
              iconUrl: midMarker,
              iconSize: [18, 18],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
        if (i == lastIndex && drawCoords.length > 1) {
          finishMarkerI = L.marker(element, {
            alt: "",
            icon: L.icon({
              iconUrl: finishMarker,
              iconSize: [33, 33],
              iconAnchor: [13, 32],
            }),
            draggable: false,
          }).addTo(markersLayer);
        }
      });

      setDrawPolylineMarkers(markersLayer);
      markersLayer.addTo(map);

      return () => map.removeLayer(markersLayer);
    }
  }, [map, drawCoords, drawType, drawPolyline]);

  useEffect(() => {
    if (!routingMachine) return;

    routingMachine.on("routesfound", function (e) {
      dispatch(
        updateDrawInfo({
          time: String(e.routes[0].summary.totalTime / 3600)
            .slice(0, 5)
            .replace(".", ","),
          dist: parseInt(e.routes[0].summary.totalDistance / 1000),
          high: "0000",
          low: "0000",
        })
      );
      dispatch(updateExportCoords(e.routes[0].coordinates));
    });
  }, [routingMachine, drawInfo]);

  useEffect(() => {
    if (!map) return;

    if (map) {
      const polyline = L.polyline(drawCoords, { color: "#00ACC1" });

      setDrawPolyline(polyline);

      return () => polyline.remove();
    }
  }, [map, drawCoords]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (drawPolyline && drawType === "Hand") {
      drawPolyline.addTo(map);
      dispatch(updateExportCoords(drawCoords));
    } else if (drawPolyline && drawType === "Road") {
      drawPolyline.remove();
    }
  }, [drawPolyline, drawType, map]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (drawPolyline && drawType === "Hand") {
      const polylineDist = GeoUtil.accumulatedLengths(drawPolyline);
      for (let i = 0; i < polylineDist.length; i++) {
        dispatch(
          updateDrawInfo({
            time: String(polylineDist[i] / 1000 / 11)
              .slice(0, 5)
              .replace(".", ","),
            dist: parseInt(polylineDist[i] / 1000),
            high: "0000",
            low: "0000",
          })
        );
        if (drawCoords.length === 0) {
          dispatch(
            updateDrawInfo({
              time: "0000",
              dist: "0000",
              high: "0000",
              low: "0000",
            })
          );
        }
      }
    }
  }, [drawPolyline, drawCoords, drawType]);

  function GetPositionByDragging() {
    const map = useMapEvents({
      drag: (e) => {
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
