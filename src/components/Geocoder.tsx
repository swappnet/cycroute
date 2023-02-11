import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addLatLng } from "../reducers/geocoderRed";
import { changeCurrentCoords } from "../reducers/controlsReducer";

export default function Geocoder() {
  const ref = useRef();
  const [geocoderValue, setGeocoderValue] = useState("");
  const [geocoderResponse, setGeocoderResponse] = useState([]);
  const [isGeocoderLoading, setIsGeocoderLoading] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const dispatch = useDispatch();

  const handleChangeGeocoder = (e) => {
    setGeocoderValue(e.target.value);
  };

  const handleShow = () => {
    setIsResultsOpen(true);
  };

  const handleClear = () => {
    setGeocoderValue("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const fetchGeoData = async () => {
    let key = import.meta.env.VITE_GEOCODER_API;
    let url = `https://api.geoapify.com/v1/geocode/search?text=${geocoderValue}&apiKey=${key}`;
    setIsGeocoderLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      data.features.length > 0
        ? setGeocoderResponse(data.features)
        : setGeocoderResponse("Nothing found");
      setIsGeocoderLoading(false);
      setIsResultsOpen(true);
    } catch (err) {
      console.log("We have some problems:" + err);
    }
  };

  useEffect(() => {
    //Fetch location after 1.1 sec after state updated
    if (geocoderValue.length >= 3) {
      const timer = setTimeout(() => {
        fetchGeoData();
      }, 1100);
      return () => clearTimeout(timer);
    } else if (geocoderValue.length === 0) {
      setGeocoderResponse([]);
    }
  }, [geocoderValue]);

  useEffect(() => {
    //Close results windows if user click outside
    const checkIfClickedOutside = (e) => {
      if (isResultsOpen && ref.current && !ref.current.contains(e.target)) {
        setIsResultsOpen((prevIsResultsOpen) => !prevIsResultsOpen);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isResultsOpen]);

  let geoResult;

  if (typeof geocoderResponse === "object") {
    geoResult = geocoderResponse.slice(0, 3).map((item) => {
      return (
        <li className="geocoder-result" key={item.properties.lon}>
          <a
            onClick={() =>
              dispatch(
                addLatLng({
                  lat: item.properties.lat,
                  lng: item.properties.lon,
                  zoom: 12,
                })
              ) &
              dispatch(
                changeCurrentCoords({
                  currentCoords: {
                    lat: item.properties.lat,
                    lng: item.properties.lon,
                    zoom: 12,
                  },
                })
              ) &
              window.scrollTo(0, 0) &
              setIsResultsOpen(false)
            }
            tabIndex={0}
            rel="noreferrer"
          >
            <div className="geocoder-result--title">
              {item.properties.formatted}
            </div>
          </a>
        </li>
      );
    });
  } else if (typeof geocoderResponse === "string") {
    geoResult = <li className="geocoder-result--notfound">Nothing found</li>;
  }

  return (
    <form
      ref={ref}
      autoComplete="off"
      className="content-geocoder--wrapper"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="location"
        onSubmit={handleSubmit}
        onClick={handleShow}
        onChange={handleChangeGeocoder}
        value={geocoderValue}
        title="Search location"
        className="content-geocoder--input"
        placeholder="Search by place name"
        tabIndex={0}
      />
      {isGeocoderLoading ? (
        <div className="geocoder-loading"></div>
      ) : !geocoderValue == [] ? (
        <a
          className="content-geocoder--clear"
          onClick={handleClear}
          role="button"
          title="Clear text"
          tabIndex={0}
        >
          clear
        </a>
      ) : (
        <i className="gg-search content-geocoder--search--icon"></i>
      )}
      {isResultsOpen && (
        <div className="geocoder-results--wrapper">
          <ul className="geocoder-results">{geoResult}</ul>
        </div>
      )}
    </form>
  );
}
