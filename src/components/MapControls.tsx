import {
  deleteDrawCoords,
  redoDrawCoords,
  undoDrawCoords,
} from "../reducers/drawReducer";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { addLatLng, IGeocoderReducer } from "../reducers/geocoderRed";
import { updateDrawInfo } from "../reducers/drawReducer";

import deleteD from "../assets/deleteD.svg";

import { useState, useEffect } from "react";

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
        disabled={drawCoords.length === 0 || drawType === "None"}
        onClick={() => dispatch(undoDrawCoords())}
      >
        <i
          className={
            drawCoords.length === 0 || drawType === "None"
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
          drawType === "None" ||
          (drawCoordsFuture.length === 0 && drawCoordsDeleted.length === 0)
        }
        onClick={() => dispatch(redoDrawCoords())}
      >
        <i
          className={
            drawType === "None" ||
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
          dispatch(deleteDrawCoords());
          dispatch(
            updateDrawInfo({
              time: "0000",
              dist: "0000",
            })
          );
        }}
      >
        <img
          src={deleteD}
          alt=""
          className={
            drawCoords.length !== 0
              ? "map-controls--icon--delete active"
              : "map-controls--icon--delete disabled"
          }
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
