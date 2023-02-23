import { useState } from 'react';

const Contributors = () => {
  const [isContrShown, setIsContrShown] = useState<boolean>(false);

  const handleContributionShown = () => {
    setIsContrShown(true);

    const timer: number = window.setTimeout(() => {
      // Show contributors for 1.5 s
      setIsContrShown(false);
    }, 1500);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <button
        className="contributors-button"
        onClick={() => handleContributionShown()}
        title="Contributors"
        aria-label="Contributors"
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
