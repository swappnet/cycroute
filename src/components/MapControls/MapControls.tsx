import {
  deleteDrawCoords,
  redoDrawCoords,
  undoDrawCoords,
} from '../../reducers/drawReducer';

import { ReactComponent as ColorPicker } from '../../assets/editor/picker.svg';
import { ReactComponent as ColorPickerL } from '../../assets/editor/pickerL.svg';
import { ReactComponent as Delete } from '../../assets/editor/deleteD.svg';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { addLatLng } from '../../reducers/geocoderReducer';
import {
  changeCurrentCoords,
  changeFitBounds,
  changeLocationStatus,
} from '../../reducers/controlsReducer';
import { updateDrawInfo } from '../../reducers/drawReducer';
import { showColorPicker } from '../../reducers/controlsReducer';
import useKeyPressed from '../../hooks/useKeyPressed';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

// Options for navigator geolocation
const options = {
  enableHighAccuracy: true,
  timeout: 5000, // Find location for 5 sec
  maximumAge: 0,
};

export default function MapControls() {
  const [isLocationFetching, setIsLocationFetching] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const isLocationFound = useAppSelector(
    (state) => state.controlsReducer.isLocationFound
  );
  const theme = useAppSelector((state) => state.controlsReducer.darkMode);

  const { code } = useKeyPressed();

  const location = useLocation();

  const isPickerOpen = useAppSelector(
    (state) => state.controlsReducer.colorPicker.isOpen
  );
  const drawCoordsDeleted = useAppSelector(
    (state) => state.drawReducer.drawCoordsDeleted
  );
  const drawCoordsFuture = useAppSelector(
    (state) => state.drawReducer.drawCoordsFuture
  );

  // Delete route from map
  const handleDelete = () => {
    dispatch(deleteDrawCoords(null));
    dispatch(
      updateDrawInfo({
        time: '0000',
        dist: '0000',
      })
    );
  };

  // Fit route on the map
  const handleRouteFit = () => {
    dispatch(changeFitBounds(true));
    dispatch(changeLocationStatus(true));
  };

  // Get position of navigator geolocation
  const getPos = (data: {
    coords: { latitude: number; longitude: number };
  }) => {
    setIsLocationFetching(false);
    dispatch(changeLocationStatus(true));
    dispatch(
      addLatLng({
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        zoom: 16,
      })
    );
    dispatch(
      changeCurrentCoords({
        currentCoords: {
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          zoom: 16,
        },
      })
    );
  };

  // Throw error when can`t find position
  const error = (err: { code: number; message: string }) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setIsLocationFetching(false);
  };

  useEffect(() => {
    // When isLocationFetching is true, fetch position
    if (isLocationFetching) {
      navigator.geolocation.getCurrentPosition(getPos, error, options);
    }
  }, [isLocationFetching]);

  useEffect(() => {
    // Define keys and do actions when keyCode is pressed
    if (code === 'KeyQ') {
      dispatch(undoDrawCoords(null));
    }
    if (code === 'KeyE') {
      dispatch(redoDrawCoords(null));
    }
    if (code === 'KeyD') {
      dispatch(deleteDrawCoords(null));
      dispatch(
        updateDrawInfo({
          time: '0000',
          dist: '0000',
        })
      );
    }
    if (code === 'KeyL') {
      setIsLocationFetching(true);
    }
    if (code === 'KeyJ') {
      dispatch(showColorPicker(!isPickerOpen));
    }
  }, [code]);

  useEffect(() => {
    // When pathname(location) is changing clear route from map
    handleDelete();
  }, [location]);

  return (
    <div className="map-controls--wrapper">
      <button
        className="map-controls--button"
        title="Undo action [Q]"
        aria-label="Undo action [Q]"
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
        title="Redo action [E]"
        aria-label="Redo action [E]"
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
        title="Delete route [D]"
        aria-label="Delete route [D]"
        disabled={drawCoords.length === 0}
        onClick={() => {
          handleDelete();
        }}
      >
        <Delete
          className={
            drawCoords.length !== 0
              ? 'map-controls--icon  active'
              : 'map-controls--icon  disabled'
          }
        />
      </button>
      <button
        className="map-controls--button"
        title="Change line color [J]"
        aria-label="Change line color [J]"
        onClick={() => dispatch(showColorPicker(!isPickerOpen))}
      >
        {theme === 'light' ? (
          <ColorPickerL className="map-controls--icon color-picker--icon" />
        ) : (
          <ColorPicker className="map-controls--icon color-picker--icon" />
        )}
      </button>
      <button
        className="map-controls--button"
        title="Fit route"
        aria-label="Fit route"
        disabled={drawCoords.length === 0}
        onClick={handleRouteFit}
      >
        <i
          className={
            drawType === 'None' || drawCoords.length === 0
              ? `gg-maximize map-controls--icon disabled`
              : `gg-maximize map-controls--icon`
          }
        ></i>
      </button>
      <button
        className="map-controls--button"
        title="Find location [L]"
        aria-label="Find location [L]"
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
