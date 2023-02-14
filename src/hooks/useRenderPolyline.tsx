import { useAppDispatch, useAppSelector } from './redux-hooks';
import { useState, useEffect } from 'react';

import GeoUtil from 'leaflet-geometryutil';

import * as L from 'leaflet';

import { updateDrawInfo, updateExportCoords } from '../reducers/drawReducer';

const useRenderPolyline = (e: L.Map | null) => {
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);

  const dispatch = useAppDispatch();

  const [drawPolyline, setDrawPolyline] = useState<L.Polyline | null>(null);

  useEffect((): ReturnType<L.Polyline | any> => {
    if (!e) return;

    if (e) {
      const polyline = L.polyline(drawCoords as any, {
        color: '#00ACC1',
        weight: 4,
      });

      if (polyline) {
        setDrawPolyline(polyline);
        return () => polyline.remove();
      }
    }
  }, [e, drawCoords]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (e) {
      if (drawPolyline && drawType === 'Hand') {
        drawPolyline.addTo(e);
        dispatch(updateExportCoords(drawCoords));
      } else if (drawPolyline && drawType === 'Road') {
        drawPolyline.remove();
      }
    }
  }, [drawPolyline, drawType, e]);

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
};

export default useRenderPolyline;
