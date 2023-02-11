import { useState, useEffect } from "react";

const Contributors = () => {
  const [isContrShown, setIsContrShown] = useState(false);

  const handleContrShown = (e) => {
    setIsContrShown(e);
  };

  useEffect(() => {
    // Show contributors text 1.5 sec
    const timer = setTimeout(() => {
      setTimeout > 0 ? handleContrShown(true) : handleContrShown(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isContrShown]);
  return (
    <>
      <button
        className="contributors-button"
        onClick={handleContrShown}
        title="Contributors"
        aria-label="Contributors"
        rel="noreferrer"
      >
        ?
      </button>
      {isContrShown && (
        <div className="contributors-wrapper">
          <a
            className="contributors-link"
            href="https://leafletjs.com"
            target="_blank"
            title="A JavaScript library for interactive maps"
            rel="noreferrer"
          >
            🇺🇦 Leaflet
          </a>
          |
          <a
            href="https://github.com/cyclosm/cyclosm-cartocss-style/releases"
            className="contributors-link"
            target="_blank"
            title="CyclOSM - Open Bicycle render"
            rel="noreferrer"
          >
            © CyclOSM
          </a>
          |
          <a
            href="https://www.esri.com/"
            className="contributors-link"
            target="_blank"
            title="Esri Copyright"
            rel="noreferrer"
          >
            © Esri
          </a>
          |
          <a
            href="https://stadiamaps.com/"
            className="contributors-link"
            target="_blank"
            title="stadiamaps"
            rel="noreferrer"
          >
            © stadiamaps
          </a>
          |
          <a
            href="https://www.openstreetmap.org/copyright"
            className="contributors-link"
            target="_blank"
            title="stadiamaps"
            rel="noreferrer"
          >
            © OpenStreetMaps
          </a>
        </div>
      )}
    </>
  );
};

export default Contributors;
