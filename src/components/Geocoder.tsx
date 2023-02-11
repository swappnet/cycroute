import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addLatLng } from "../reducers/geocoderRed";
import { changeCurrentCoords } from "../reducers/controlsReducer";

export default function Geocoder() {
  const ref = useRef<HTMLFormElement>(null);
  const [geocoderValue, setGeocoderValue] = useState<string>("");
  const [geocoderResponse, setGeocoderResponse] = useState<any>(null);
  const [isGeocoderLoading, setIsGeocoderLoading] = useState<boolean>(false);
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleChangeGeocoder = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setGeocoderValue(e.target.value);
  };

  const handleShow = () => {
    setIsResultsOpen(true);
  };

  const handleClear = () => {
    setGeocoderValue("");
  };

  const handleSubmit = (e: React.FormEvent): void => {
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
    if (geocoderValue) {
      if (geocoderValue.length >= 3) {
        const timer = setTimeout(() => {
          fetchGeoData();
        }, 400);
        return () => clearTimeout(timer);
      } else if (geocoderValue.length === 0) {
        setGeocoderResponse([]);
      }
    }
  }, [geocoderValue]);

  useEffect(() => {
    //Close results windows if user click outside
    const checkIfClickedOutside = (e: MouseEvent): void => {
      if (
        isResultsOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setIsResultsOpen((prevIsResultsOpen) => !prevIsResultsOpen);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isResultsOpen]);

  let geoResult;

  if (geocoderResponse) {
    geoResult = geocoderResponse.slice(0, 3).map((item: any) => {
      return (
        <li className="geocoder-result" key={item.properties.lon}>
          <button
            onClick={() => {
              dispatch(
                addLatLng({
                  lat: item.properties.lat,
                  lng: item.properties.lon,
                  zoom: 12,
                })
              );
              dispatch(
                changeCurrentCoords({
                  currentCoords: {
                    lat: item.properties.lat,
                    lng: item.properties.lon,
                    zoom: 12,
                  },
                })
              );
              window.scrollTo(0, 0);
              setIsResultsOpen(false);
            }}
            tabIndex={0}
          >
            <div className="geocoder-result--title">
              {item.properties.formatted}
            </div>
          </button>
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
      ) : geocoderValue.length > 0 ? (
        <button
          className="content-geocoder--clear"
          onClick={handleClear}
          title="Clear text"
          tabIndex={0}
        >
          clear
        </button>
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
