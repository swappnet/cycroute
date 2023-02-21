import { ReactComponent as HandIcon } from '../../assets/editor/hand-icon.svg';
import { ReactComponent as RoadIcon } from '../../assets/editor/road-icon.svg';

import useKeyPressed from '../../hooks/useKeyPressed';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { changeDraw } from '../../reducers/controlsReducer';
import { useEffect } from 'react';

export default function DrawType() {
  const { code } = useKeyPressed();
  const drawType = useAppSelector((state) => state.controlsReducer.draw);
  const dispatch = useAppDispatch();

  const handleDrawChange = (e: string) => {
    if (drawType === e) {
      dispatch(changeDraw('None'));
    } else if (drawType !== e && e === 'Road') {
      dispatch(changeDraw('Road'));
    } else if (drawType !== e && e === 'Hand') {
      dispatch(changeDraw('Hand'));
    }
  };

  useEffect(() => {
    if (code === 'KeyC') {
      handleDrawChange('Road');
    } else if (code === 'KeyV') {
      handleDrawChange('Hand');
    }
  }, [code]);

  return (
    <>
      <h2 className="content-section--title">Draw Route</h2>
      <div className="content-draw--wrapper">
        <div
          className={
            drawType === 'Road' ? 'content-draw-box active' : 'content-draw-box'
          }
          tabIndex={0}
          title="Follow Road [C]"
          aria-label="Follow Road [C]"
          role="button"
          onClick={() => {
            handleDrawChange('Road');
          }}
        >
          <h3 className="content-draw-box--title">
            Follow
            <br />
            Road
          </h3>
          <RoadIcon className="content-draw-box--icon" />
        </div>
        <div
          className={
            drawType === 'Hand' ? 'content-draw-box active' : 'content-draw-box'
          }
          tabIndex={0}
          title="Follow Hand [V]"
          aria-label="Follow Hand [V]"
          role="button"
          onClick={() => {
            handleDrawChange('Hand');
          }}
        >
          <h3 className="content-draw-box--title">
            Follow
            <br />
            Hand
          </h3>
          <HandIcon className="content-draw-box--icon" />
        </div>
      </div>
    </>
  );
}
