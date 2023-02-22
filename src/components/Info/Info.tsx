import { useAppSelector } from '../../hooks/redux-hooks';

export default function Info() {
  const drawInfo = useAppSelector((state) => state.drawReducer.drawInfo);

  return (
    <>
      <h2 className="content-section--title">Details</h2>
      <div className="content-info--wrapper">
        <div className="content-info--box" title="Journey time">
          <div className="info-content--wrapper">
            <h4 className="content-info--box--value">{drawInfo.time}</h4>
            <h4 className="content-info--box--title">
              TIME
              <span className="box--title--span">h</span>
            </h4>
          </div>
          <div className="info-content--wrapper">
            <h4 className="content-info--box--value">{drawInfo.dist}</h4>
            <h4 className="content-info--box--title">
              DIST
              <span className="box--title--span">km</span>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
