import {
  deleteDrawCoords,
  redoDrawCoords,
  undoDrawCoords,
} from "../reducers/drawReducer";
import { useDispatch, useSelector } from "react-redux";
import { addLatLng } from "../reducers/geocoderRed";
import { updateDrawInfo } from "../reducers/drawReducer";

import deleteD from "../assets/deleteD.svg";

import { useState, useEffect } from "react";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export default function MapControls() {
  const dispatch = useDispatch();
  const drawCoords = useSelector((state) => state.drawReducer.drawCoords);
  const geocoderCoords = useSelector((state) => state.geocoderReducer);
  const drawType = useSelector((state) => state.controlsReducer.draw);
  const currentCoords = useSelector(
    (state) => state.controlsReducer.currentCoords
  );
  const drawCoordsDeleted = useSelector(
    (state) => state.drawReducer.drawCoordsDeleted
  );
  const drawCoordsFuture = useSelector(
    (state) => state.drawReducer.drawCoordsFuture
  );

  useEffect(() => {
    if (currentCoords !== geocoderCoords) {
      setIsLocationFound(false);
    }
  }, [currentCoords]);

  const [isLocationFetching, setIsLocationFetching] = useState(false);
  const [isLocationFound, setIsLocationFound] = useState(false);

  const getPos = (data) => {
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

  function error(err) {
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
        rel="noreferrer"
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
        rel="noreferrer"
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
        rel="noreferrer"
        disabled={drawCoords.length === 0}
        onClick={() =>
          dispatch(deleteDrawCoords()) &
          dispatch(
            updateDrawInfo({
              time: "0000",
              dist: "0000",
            })
          )
        }
      >
        <img
          src={deleteD}
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
        rel="noreferrer"
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
