import { useRef, useState, useEffect } from 'react';

import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { updateDrawInfo, updateExportCoords } from '../reducers/drawReducer';
import { useAppSelector, useAppDispatch } from './redux-hooks';

const useRenderRouting = (e: L.Map | null) => {
  const [routingMachine, setRoutingMachine] = useState<L.Control | null>(null);
  const RoutingMachineRef = useRef<L.Control | null>(null);
  let key = import.meta.env.VITE_MAPBOX_API;

  const dispatch = useAppDispatch();

  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const drawInfo = useAppSelector((state) => state.drawReducer.drawInfo);

  useEffect(() => {
    if (!e) return;
    if (e) {
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
        show: false,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: '#00ACC1', opacity: 1, weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
          addWaypoints: false,
        },

        plan,
      });

      setRoutingMachine(RoutingMachineRef.current);
      return () => {
        if (RoutingMachineRef.current) {
          e.removeControl(RoutingMachineRef.current);
        }
      };
    }
  }, [e, drawCoords]);

  useEffect(() => {
    if (!routingMachine) return;
    if (!e) return;

    if (e) {
      if (routingMachine && drawType === 'Road') {
        routingMachine.addTo(e);
      } else if (routingMachine && drawType === 'Hand') {
        e.removeControl(routingMachine);
      }
    }
  }, [routingMachine, drawType, e]);

  useEffect(() => {
    if (!routingMachine) return;

    if (routingMachine) {
      (routingMachine as any).on('routesfound', function (e: any) {
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
};

export default useRenderRouting;