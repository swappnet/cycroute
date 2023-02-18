import {
  deleteDrawCoords,
  redoDrawCoords,
  undoDrawCoords,
} from '../../reducers/drawReducer';

import colorPicker from '../../assets/editor/picker.svg';
import colorPickerL from '../../assets/editor/pickerL.svg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { addLatLng } from '../../reducers/geocoderReducer';
import { updateDrawInfo } from '../../reducers/drawReducer';
import { showColorPicker } from '../../reducers/controlsReducer';

import deleteD from '../../assets/editor/deleteD.svg';

import { useState, useEffect } from 'react';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export default function MapControls() {
  const dispatch = useAppDispatch();
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const geocoderCoords = useAppSelector((state) => state.geocoderReducer);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const theme = useAppSelector((state) => state.controlsReducer.darkMode);

  const isPickerOpen = useAppSelector(
    (state) => state.controlsReducer.colorPicker.isOpen
  );
  const currentCoords = useAppSelector(
    (state) => state.controlsReducer.currentCoords
  );
  const drawCoordsDeleted = useAppSelector(
    (state) => state.drawReducer.drawCoordsDeleted
  );
  const drawCoordsFuture = useAppSelector(
    (state) => state.drawReducer.drawCoordsFuture
  );

  useEffect(() => {
    if (currentCoords !== geocoderCoords) {
      setIsLocationFound(false);
    }
  }, [currentCoords]);

  const [isLocationFetching, setIsLocationFetching] = useState<boolean>(false);
  const [isLocationFound, setIsLocationFound] = useState<boolean>(false);

  const getPos = (data: {
    coords: { latitude: number; longitude: number };
  }) => {
    console.log(typeof data);
    setIsLocationFound(true);
    setIsLocationFetching(false);
    dispatch(
      addLatLng({
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        zoom: 12,
      })
    );
  };

  function error(err: { code: number; message: string }) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setIsLocationFetching(false);
  }

  useEffect(() => {
    if (isLocationFetching) {
      navigator.geolocation.getCurrentPosition(getPos, error, options);
    }
  }, [isLocationFetching]);

  //FIXME Fix bug with layers return position to start when use location;

  return (
    <div className="map-controls--wrapper">
      <button
        className="map-controls--button"
        title="Undo action"
        aria-label="Undo action"
        disabled={drawCoords.length === 0 || drawType === 'None'}
        onClick={() => dispatch(undoDrawCoords(null))}
      >
        <i
          className={
            drawCoords.length === 0 || drawType === 'None'
              ? `gg-undo map-controls--icon disabled`
              : `gg-undo map-controls--icon`
          }
        ></i>
      </button>
      <button
        className="map-controls--button"
        title="Redo action"
        aria-label="Redo action"
        disabled={
          drawType === 'None' ||
          (drawCoordsFuture.length === 0 && drawCoordsDeleted.length === 0)
        }
        onClick={() => dispatch(redoDrawCoords(null))}
      >
        <i
          className={
            drawType === 'None' ||
            (drawCoordsFuture.length === 0 && drawCoordsDeleted.length === 0)
              ? `gg-redo map-controls--icon disabled`
              : `gg-redo map-controls--icon`
          }
        ></i>
      </button>
      <button
        className="map-controls--button"
        title="Delete route"
        aria-label="Delete route"
        disabled={drawCoords.length === 0}
        onClick={() => {
          dispatch(deleteDrawCoords(null));
          dispatch(
            updateDrawInfo({
              time: '0000',
              dist: '0000',
            })
          );
        }}
      >
        <img
          src={deleteD}
          alt=""
          className={
            drawCoords.length !== 0
              ? 'map-controls--icon  active'
              : 'map-controls--icon  disabled'
          }
        />
      </button>
      <button
        className="map-controls--button"
        title="Change line color"
        aria-label="Change line color"
        onClick={() => dispatch(showColorPicker(!isPickerOpen))}
      >
        <img
          src={theme === 'light' ? colorPickerL : colorPicker}
          alt=""
          className="map-controls--icon color-picker--icon"
        />
      </button>
      <button
        className="map-controls--button"
        title="Find location"
        aria-label="Find location"
        onClick={() => setIsLocationFetching(true)}
      >
        {isLocationFetching ? (
          <i className="gg-loadbar"></i>
        ) : (
          <i
            className={
              !isLocationFound
                ? `gg-pin map-controls--icon`
                : `gg-pin map-controls--icon found`
            }
          ></i>
        )}
      </button>
    </div>
  );
}
