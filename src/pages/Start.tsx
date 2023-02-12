import startlogo from "../assets/startlogo.svg";
import githublogo from "../assets/githublogo.svg";

import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks";
import { switchDark } from "../reducers/controlsReducer/controlsReducer";
import { MouseEventHandler } from "react";

const date = new Date();
const year = date.getFullYear();

function StartScreen({ newRoute }: { newRoute: MouseEventHandler }) {
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);
  const dispatch = useAppDispatch();

  return (
    <div className="start--wrapper">
      <div className="start--wrapper-top">
        <div className="start-image--wrapper">
          <img
            src={startlogo}
            className="start-image"
            aria-label="Start Logo"
            alt=""
          />
        </div>
        <button className="start-button" onClick={newRoute}>
          New route
        </button>
      </div>

      <footer className="start--wrapper-bottom">
        <div className="theme-switch-wrapper">
          Dark theme
          <label className="theme-switch" htmlFor="checkbox">
            <input
              type="checkbox"
              id="checkbox"
              title="Change theme"
              aria-label="Change theme"
              onChange={() => {
                if (darkMode === "dark") {
                  dispatch(switchDark("light"));
                } else if (darkMode === "light") {
                  dispatch(switchDark("dark"));
                }
              }}
            />
            <div className="slider round"></div>
          </label>
        </div>

        <a
          href="https://github.com/swappnet/cycroute"
          className="start-github--link"
          target="_blank"
          title="Project in GitHub"
          aria-label="Project in GitHub"
          rel="noreferrer"
          tabIndex={0}
        >
          <img
            src={githublogo}
            className="start-github--image"
            aria-label="GitHub Logo"
            alt=""
          />
          <span className="start-github--text">GitHub</span>
        </a>
        <p className="start-copy">
          Copyright&copy;{` ${year} Vladyslav Okuskov`}
        </p>
      </footer>
    </div>
  );
}

export default StartScreen;
