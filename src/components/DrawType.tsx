import HandIcon from "../assets/hand-icon.svg";
import RoadIcon from "../assets/road-icon.svg";

import { useSelector, useDispatch } from "react-redux";
import { changeDraw } from "../reducers/controlsReducer";

export default function DrawType() {
  const drawType = useSelector((state) => state.controlsReducer.draw);
  const dispatch = useDispatch();

  return (
    <>
      <h2 className="content-section--title">Draw Route</h2>
      <div className="content-draw--wrapper">
        <div
          className={
            drawType === "Road" ? "content-draw-box active" : "content-draw-box"
          }
          tabIndex={0}
          title="Follow Road"
          aria-label="Follow Road"
          role="button"
          onClick={() =>
            drawType === "Road"
              ? dispatch(changeDraw("None"))
              : dispatch(changeDraw("Road"))
          }
        >
          <h3 className="content-draw-box--title">Follow Road</h3>
          <img className="content-draw-box--icon" src={RoadIcon} alt="" />
        </div>
        <div
          className={
            drawType === "Hand" ? "content-draw-box active" : "content-draw-box"
          }
          tabIndex={0}
          title="Follow Hand"
          aria-label="Follow Hand"
          role="button"
          onClick={() =>
            drawType === "Hand"
              ? dispatch(changeDraw("None"))
              : dispatch(changeDraw("Hand"))
          }
        >
          <h3 className="content-draw-box--title">Follow Hand</h3>
          <img className="content-draw-box--icon" src={HandIcon} alt="" />
        </div>
      </div>
    </>
  );
}
