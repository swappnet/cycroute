import { useAppDispatch, useAppSelector } from './redux-hooks';
import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import GeoUtil from 'leaflet-geometryutil';

import * as L from 'leaflet';

import { updateDrawInfo, updateExportCoords } from '../reducers/drawReducer';

const useRenderPolyline = (e: L.Map | null) => {
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const lineColor = useAppSelector(
    (state) => state.controlsReducer.colorPicker.color
  );

  const dispatch = useAppDispatch();
  const location = useLocation();
  const [drawPolyline, setDrawPolyline] = useState<L.Polyline | null>(null);

  useEffect((): ReturnType<L.Polyline | any> => {
    if (!e) return;

    if (e) {
      const polyline = L.polyline(drawCoords as any, {
        color: lineColor,
        weight: 4,
      });

      if (polyline) {
        setDrawPolyline(polyline);
        return () => polyline.remove();
      }
    }
  }, [e, drawCoords, lineColor]);

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
  }, [drawPolyline, drawType, e, location]);

  useEffect(() => {
    if (!drawPolyline) return;

    if (drawPolyline && drawType === 'Hand') {
      const polylineDist = GeoUtil.accumulatedLengths(drawPolyline);
      for (let i = 0; i < polylineDist.length; i++) {
        dispatch(
          updateDrawInfo({
            time: (polylineDist[i] / 1000 / 11).toFixed(2),

            dist: (polylineDist[i] / 1000).toFixed(1),
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
