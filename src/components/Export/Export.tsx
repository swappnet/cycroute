import { useAppSelector } from '../../hooks/redux-hooks';
import { useState } from 'react';
import downloadjs from 'downloadjs';
import { NavLink } from 'react-router-dom';

import Select, { StylesConfig } from 'react-select';

const date = new Date();
const current_date = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;

enum ExportType {
  none,
  gpx,
  kml,
}

type SelectOptionType = { value: string | number; label: string };

const options = [
  { value: 1, label: 'GPX' },
  { value: 2, label: 'KML' },
];

const customStyles: StylesConfig<SelectOptionType, false> = {
  option: (base, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...base,
      backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.31)' : '',
    };
  },
};

export default function Export() {
  const exportCoords = useAppSelector(
    (state) => state.drawReducer.exportCoords
  );

  const [filename, setFilename] = useState<string>('');
  const [exportType, setExportType] = useState(ExportType.none);

  const handleChange = (option: SelectOptionType | null) => {
    if (option) {
      if (option.value === 1) {
        setExportType(ExportType.gpx);
      } else if (option.value === 2) {
        setExportType(ExportType.kml);
      }
    }
  };

  const generateGPX = (coords: any) => {
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.topografix.com/GPX/gpx_style/0/2 http://www.topografix.com/GPX/gpx_style/0/2/gpx_style.xsd" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpx_style="http://www.topografix.com/GPX/gpx_style/0/2" version="1.1" creator="https://cycroute.netlify.app/">
  <metadata>
    <name>${
      filename.length === 0 || !filename
        ? `new_route_${current_date}`
        : filename
    }</name>
  <author>
    <name>cycroute</name>
    <link href="https://cycroute.netlify.app/"></link>
  </author>
  </metadata>
  <trk>
    <name>${
      filename.length === 0 || !filename
        ? `new_route_${current_date}`
        : filename
    }</name>
    <type>Cycling</type>
    <trkseg>`;

    coords.forEach((coord: any) => {
      gpx += `
      <trkpt lat="${coord.lat}" lon="${coord.lng}"></trkpt>`;
    });

    gpx += `
    </trkseg>
    </trk>
  </gpx>`;

    return gpx;
  };

  const generateKML = (coords: any) => {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>${
    filename.length === 0 || !filename ? `new_route_${current_date}` : filename
  }</name>`;

    coords.forEach((coord: any, index: any) => {
      kml += `
  <Placemark>
    <name>Point ${index + 1}</name>
    <description>Waypoint</description>
    <Point>
      <coordinates>${coord.lng},${coord.lat},0</coordinates>
    </Point>
  </Placemark>`;
    });

    kml += `
</Document>
</kml>`;

    return kml;
  };

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleFilename = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const handleExport = () => {
    setIsFormOpen(true);
  };

  const handleDownload = () => {
    const kml = generateKML(exportCoords);
    const gpx = generateGPX(exportCoords);

    if (exportCoords) {
      if (exportType === ExportType.none) {
        return null;
      }
      if (exportType === ExportType.gpx) {
        downloadjs(
          gpx,
          `${
            filename.length === 0 || !filename
              ? `new_route_${current_date}`
              : filename
          }.gpx`,
          'application/gpx+xml'
        );
      }
      if (exportType === ExportType.kml) {
        downloadjs(
          kml,
          `${
            filename.length === 0 || !filename
              ? `new_route_${current_date}`
              : filename
          }.kml`,
          'application/vnd.google-earth.kml+xml'
        );
      }

      setIsFormOpen(false);
      setFilename('');
    }
  };

  return (
    <>
      <p className="content-section--title">Export</p>
      <div className="content-export--wrapper">
        <Select
          styles={customStyles}
          classNamePrefix={'export-select'}
          className="content-export--select"
          name="selectedExportType"
          aria-label="export type"
          placeholder="Export type"
          closeMenuOnSelect={true}
          onChange={handleChange}
          options={options}
        />

        <button
          className={
            exportCoords.length === 0 || exportType === 0 || isFormOpen
              ? 'content-export--button disabled-export'
              : 'content-export--button'
          }
          title={`Export as ${exportType === 1 ? 'GPX' : 'KML'}`}
          aria-label={`Export as ${exportType === 1 ? 'GPX' : 'KML'}`}
          onClick={handleExport}
          disabled={exportCoords.length === 0 || exportType === 0 || isFormOpen}
        >
          Export as {exportType === 0 ? '' : exportType === 1 ? 'GPX' : 'KML'}
        </button>
        {isFormOpen && (
          <div className="content-export-download--wrapper">
            <p className="content-export-download--title">Choose name</p>
            <form className="download-form">
              <div
                role="button"
                title="Close download window"
                aria-label="Close download windows"
                className="download-form--close"
                tabIndex={0}
                onClick={() => setIsFormOpen(false)}
              >
                <i className="gg-close"></i>
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
                title={`Download ${exportType === 1 ? 'GPX' : 'KML'}`}
                aria-label={`Download ${exportType === 1 ? 'GPX' : 'KML'}`}
                onClick={handleDownload}
                tabIndex={0}
              >
                Download
              </button>
            </form>
          </div>
        )}
      </div>
      <NavLink to="/" className="editor-back-link" title="Back to Home">
        Back to Home
      </NavLink>
    </>
  );
}
