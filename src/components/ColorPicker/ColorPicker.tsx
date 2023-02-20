import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  changeLineColor,
  showColorPicker,
} from '../../reducers/controlsReducer';

import { HexColorPicker } from 'react-colorful';

import { useState } from 'react';

const ColorPicker = () => {
  const isPickerOpen = useAppSelector(
    (state) => state.controlsReducer.colorPicker.isOpen
  );
  const lineColor = useAppSelector(
    (state) => state.controlsReducer.colorPicker.color
  );
  const [color, setColor] = useState(lineColor);

  const dispatch = useAppDispatch();

  if (isPickerOpen) {
    return (
      <div className="picker-wrapper">
        <div className="picker-header-wrapper">
          {' '}
          <div
            role="button"
            title="Close color picker"
            aria-label="Close color picker"
            className="download-form--close picker-close"
            tabIndex={0}
            onClick={() => dispatch(showColorPicker(false))}
          >
            <i className="gg-close"></i>
          </div>
          <p className="picker-title">Line color</p>
        </div>
        <HexColorPicker color={color} onChange={setColor} />
        <button
          className="picker-submit-button"
          title="Submit color"
          aria-label="Sumbit color"
          onClick={() => dispatch(changeLineColor(color))}
        >
          Submit
        </button>
      </div>
    );
  } else return null;
};

export default ColorPicker;
