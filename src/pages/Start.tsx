import githublogo from '../assets/startPage/githublogo.svg';
import headerlogo from '../assets/headerlogo.svg';
import linkedinlogo from '../assets/startPage/linkedin-icon.svg';
import banner from '../assets/startPage/start-banner.webp';
import preview from '../assets/startPage/main-preview.svg';

import { useAppSelector, useAppDispatch } from '../hooks/redux-hooks';
import { switchDark } from '../reducers/controlsReducer';
import { NavLink } from 'react-router-dom';

const date = new Date();
const year = date.getFullYear();

function StartScreen() {
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);
  const dispatch = useAppDispatch();

  return (
    <div className="start--wrapper">
      <header className="start-header-wrapper">
        <div className="header-content">
          <div className="header-logo-wrapper">
            <h1 className="header-logo">cycroute</h1>
            <div className="header-logo-icon-wrapper">
              <img src={headerlogo} alt="" className="header-logo-icon" />
            </div>
          </div>
          <div className="header-buttons-wrapper">
            <NavLink
              to="/Editor"
              className="header-button start-button"
              title="Create new route"
              aria-label="Create new route"
            >
              <div className="gg-add-r header-button-icon-wrapper" />
              <p className="header-button-title">NEW ROUTE</p>
            </NavLink>
            <div className="darkmode-button-wrapper">
              <div className="daynight">
                <label htmlFor="checkbox">
                  <input
                    type="checkbox"
                    name=""
                    id="checkbox"
                    onChange={() => {
                      if (darkMode === 'dark') {
                        dispatch(switchDark('light'));
                      } else if (darkMode === 'light') {
                        dispatch(switchDark('dark'));
                      }
                    }}
                  />
                  <div className="toggle">
                    <div className="cloud"></div>
                    <div className="star"></div>
                    <div className="sea"></div>
                    <div className="mountains"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="start-main-wrapper">
        <div className="main-banner-wrapper">
          <img src={banner} alt="Website banner" className="banner-image" />
          <h2 className="banner-title">CYCROUTE</h2>
          <div className="banner-gradient" />
        </div>
        <div className="main-content-wrapper">
          <section className="content-ilus-wrapper">
            <img src={preview} alt="" className="ilus-image" />
          </section>
          <section className="content-info-wrapper">
            <h3 className="info-title">READY TO START?</h3>
            <p className="info-description">
              Start your cycling adventure by building a route{' '}
            </p>
            <NavLink
              to="/Editor"
              className="info-button start-button"
              title="Create new route"
              aria-label="Create new route"
            >
              NEW ROUTE
            </NavLink>
          </section>
        </div>
      </main>
      <footer className="footer-wrapper">
        <a
          href="https://www.linkedin.com/in/vladokuskov/"
          rel="noreferrer"
          title="Go to project GitHub"
          className="footer-link"
        >
          <img alt="" src={linkedinlogo} className="link-icon" />
          LinkedIn
        </a>
        <a
          href="https://github.com/swappnet/cycroute"
          rel="noreferrer"
          title="Go to project GitHub"
          className="footer-link"
        >
          <img alt="" src={githublogo} className="link-icon" />
          Github
        </a>

        <p className="footer-copyright">©{year} Vladyslav Okuskov ' cycroute</p>
      </footer>
    </div>
  );
}

export default StartScreen;
