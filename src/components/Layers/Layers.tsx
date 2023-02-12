import defaultIcn from "../assets/default-icon.svg";
import satelliteIcn from "../assets/satellite-icon.svg";
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks";
import { changeLayer } from "../../reducers/controlsReducer/controlsReducer";
import { addLatLng } from "../../reducers/geocoderReducer/geocoderReducer";

export default function Layers() {
  const layer = useAppSelector((state) => state.controlsReducer);
  const dispatch = useAppDispatch();

  const handleLayerChange = (e: string) => {
    if (e === "toDefault") {
      dispatch(
        addLatLng({
          lat: layer.currentCoords.lat,
          lng: layer.currentCoords.lng,
        })
      );
      window.scrollTo(0, 0);
      dispatch(changeLayer("default"));
    } else if (e === "toSatellite") {
      dispatch(
        addLatLng({
          lat: layer.currentCoords.lat,
          lng: layer.currentCoords.lng,
        })
      );
      dispatch(changeLayer("satellite"));
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <h2 className="content-section--title">Layers</h2>
      <div className="content-layers--wrapper">
        <div
          className={
            layer.layer === "default"
              ? "content-layers-box active"
              : "content-layers-box"
          }
          tabIndex={0}
          role="button"
          title="Default layer"
          aria-label="Default layer"
          onClick={() => handleLayerChange("toDefault")}
        >
          <img className="content-layers-box--icon" src={defaultIcn} alt="" />
        </div>
        <div
          className={
            layer.layer === "satellite"
              ? "content-layers-box active"
              : "content-layers-box"
          }
          tabIndex={0}
          role="button"
          title="Satellite layer"
          aria-label="Satellite layer"
          onClick={() => handleLayerChange("toSatellite")}
        >
          <img className="content-layers-box--icon" src={satelliteIcn} alt="" />
        </div>
      </div>
    </>
  );
}
