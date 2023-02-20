import { useAppDispatch } from '../../hooks/redux-hooks';
import { useMapEvents } from 'react-leaflet';
import {
  changeCurrentCoords,
  changeLocationStatus,
} from '../../reducers/controlsReducer';

function GetPositionByDragging() {
  const dispatch = useAppDispatch();
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
    dragstart: () => {
      dispatch(changeLocationStatus(false));
    },
  });
  return null;
}

export default GetPositionByDragging;
