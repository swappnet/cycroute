import Map from '../Map/Map';
import Geocoder from '../../components/Geocoder/Geocoder';
import DrawType from '../../components/DrawType/DrawType';
import Info from '../../components/Info/Info';
import Layers from '../../components/Layers/Layers';
import MapControls from '../../components/MapControls/MapControls';
import Export from '../../components/Export/Export';

function Editor() {
  return (
    <main className="main-editor--wrapper">
      <Map />
      <MapControls />
      <div className="editor--wrapper">
        <div className="content-arrow--wrapper">
          <div className="arrow" />
        </div>
        <div className="editor-content">
          <section className="content-section">
            <Geocoder />
          </section>
          <section className="content-section">
            <Info />
          </section>
          <section className="content-section">
            <DrawType />
          </section>
          <section className="content-section">
            <Layers />
          </section>
          <section className="content-section export-section">
            <Export />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Editor;
