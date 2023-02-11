import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import downloadjs from "downloadjs";

const date = new Date();
const current_date = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;

export default function Export() {
  const exportCoords = useSelector((state) => state.drawReducer.exportCoords);

  const [paths, setPaths] = useState(null);
  const [filename, setFilename] = useState("");

  const XMLHeader = `<?xml version="1.0" encoding="UTF-8"?>
 <gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.topografix.com/GPX/gpx_style/0/2 http://www.topografix.com/GPX/gpx_style/0/2/gpx_style.xsd" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpx_style="http://www.topografix.com/GPX/gpx_style/0/2" version="1.1" creator="https://gpx.studio">`;

  const metadata = `
  <metadata>
  <name>${
    filename.length === 0 || !filename ? `new_route_${current_date}` : filename
  }</name>
  <author>
    <name>cycroute</name>
    <link href="https://cycroute.netlify.app/"></link>
  </author>
  </metadata>`;

  const gpxStart = `
  <trk>
    <name>${
      filename.length === 0 || !filename
        ? `new_route_${current_date}`
        : filename
    }</name>
    <type>Cycling</type>
    <trkseg>`;

  const gpxEnd = `
    </trkseg>
  </trk>
</gpx>`;

  function createPaths() {
    if (exportCoords !== 0) {
      setPaths(
        exportCoords.map((coords) => {
          return `<trkpt lat="${coords.lat}" lon="${coords.lng}"></trkpt>`;
        })
      );
    } else if (exportCoords == 0) {
      return null;
    }
  }

  useEffect(() => {
    createPaths();
  }, [exportCoords]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFilename = (e) => {
    setFilename(e.target.value);
  };

  const handleExport = () => {
    setIsFormOpen(true);
  };

  const handleDownload = () => {
    downloadjs(
      new Blob([
        XMLHeader + metadata + gpxStart + paths.map((path) => path) + gpxEnd,
      ]),
      `${
        filename.length === 0 || !filename
          ? `new_route_${current_date}`
          : filename
      }.gpx`,
      "application/gpx+xml"
    );

    setIsFormOpen(false);
    setFilename("");
  };

  return (
    <>
      <p className="content-section--title">Export</p>
      <div className="content-export--wrapper">
        <button
          className={
            exportCoords == 0 || isFormOpen
              ? "content-export--button disabled-export"
              : "content-export--button"
          }
          title="Export GPX"
          aria-label="Export GPX"
          onClick={handleExport}
          disabled={exportCoords == 0 || isFormOpen}
        >
          Export as GPX
        </button>
        {isFormOpen && (
          <div className="content-export-download--wrapper">
            <p className="content-export-download--title">Choose name</p>
            <form className="download-form" tabIndex={0}>
              <div
                role="button"
                title="Close download window"
                aria-label="Close download windows"
                className="download-form--close"
                tabIndex={0}
                onClick={() => setIsFormOpen(false)}
              >
                x
              </div>
              <input
                className="download-form--input"
                title="Choose file name"
                onChange={handleFilename}
                name="filename"
                value={filename}
                placeholder={`new_route_${current_date}`}
                aria-label="Choose file name"
                tabIndex={0}
              />
              <button
                className="download-form--submit"
                title="Download GPX"
                aria-label="Download GPX"
                onClick={handleDownload}
                tabIndex={0}
              >
                Download
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
