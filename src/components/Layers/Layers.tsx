import defaultIcn from '../../assets/editor/default-icon.webp';
import satelliteIcn from '../../assets/editor/satellite-icon.webp';
import { useAppSelector, useAppDispatch } from '../../hooks/redux-hooks';
import { changeLayer } from '../../reducers/controlsReducer';
import { addLatLng } from '../../reducers/geocoderReducer';

import { useEffect } from 'react';

import useKeyPressed from '../../hooks/useKeyPressed';

export default function Layers() {
  const layer = useAppSelector((state) => state.controlsReducer);
  const dispatch = useAppDispatch();

  const { code } = useKeyPressed();

  const handleLayerChange = (e: string) => {
    if (e === 'toDefault') {
      dispatch(
        addLatLng({
          lat: layer.currentCoords.lat,
          lng: layer.currentCoords.lng,
        })
      );
      window.scrollTo(0, 0);
      dispatch(changeLayer('default'));
    } else if (e === 'toSatellite') {
      dispatch(
        addLatLng({
          lat: layer.currentCoords.lat,
          lng: layer.currentCoords.lng,
        })
      );
      dispatch(changeLayer('satellite'));
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (code === 'KeyN') {
      handleLayerChange('toDefault');
    } else if (code === 'KeyM') {
      handleLayerChange('toSatellite');
    }
  }, [code]);

  return (
    <>
      <h2 className="content-section--title">Layers</h2>
      <div className="content-layers--wrapper">
        <div
          className="content-layers-box"
          tabIndex={0}
          role="button"
          title="Default layer [N]"
          aria-label="Default layer [N]"
          onClick={() => handleLayerChange('toDefault')}
        >
          <div
            className={
              layer.layer === 'default'
                ? 'content-layers-box--icon--bg active'
                : 'content-layers-box--icon--bg'
            }
          />
          <p
            className={
              layer.layer === 'default'
                ? 'content-layers-box--title active'
                : 'content-layers-box--title'
            }
          >
            Default
          </p>
          <img className="content-layers-box--icon" src={defaultIcn} alt="" />
        </div>
        <div
          className="content-layers-box"
          tabIndex={0}
          role="button"
          title="Satellite layer [M]"
          aria-label="Satellite layer [M]"
          onClick={() => handleLayerChange('toSatellite')}
        >
          <div
            className={
              layer.layer === 'satellite'
                ? 'content-layers-box--icon--bg active'
                : 'content-layers-box--icon--bg'
            }
          />
          <p
            className={
              layer.layer === 'satellite'
                ? 'content-layers-box--title active'
                : 'content-layers-box--title'
            }
          >
            Satellite
          </p>
          <img className="content-layers-box--icon" src={satelliteIcn} alt="" />
        </div>
      </div>
    </>
  );
}
