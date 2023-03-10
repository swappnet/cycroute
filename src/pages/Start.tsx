import githublogo from '../assets/startPage/githublogo.svg';
import headerlogo from '../assets/headerlogo.svg';
import banner from '../assets/startPage/start-banner.webp';
import preview from '../assets/startPage/main-preview.svg';

import { useAppSelector, useAppDispatch } from '../hooks/redux-hooks';
import { switchDark } from '../reducers/controlsReducer';
import { NavLink } from 'react-router-dom';

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

const date = new Date();
const year = date.getFullYear(); // Get current year and save in variable

function StartScreen() {
  const drawCoords = useAppSelector((state) => state.drawReducer.drawCoords);
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);
  const dispatch = useAppDispatch();

  return (
    <div className="start--wrapper">
      <header className="start-header-wrapper">
        <div className="header-content">
          <div className="header-logo-wrapper">
            <h1 className="header-logo">cycroute</h1>
            <div className="header-logo-icon-wrapper">
              <img src={headerlogo} alt="" className="header-logo-icon " />
            </div>
          </div>
          <div className="header-buttons-wrapper">
            <input
              className="toggle"
              type="checkbox"
              onChange={() => {
                if (darkMode === 'dark') {
                  dispatch(switchDark('light'));
                  localStorage.setItem('theme', 'light');
                } else if (darkMode === 'light') {
                  dispatch(switchDark('dark'));
                  localStorage.setItem('theme', 'dark');
                }
              }}
            />
          </div>
        </div>
      </header>
      <main className="start-main-wrapper">
        <div className="main-banner-wrapper">
          <img
            src={banner}
            alt="Website banner"
            className="banner-image lazyload"
          />
          <h2 className="banner-title">CYCROUTE</h2>
          <div className="banner-gradient" />
        </div>
        <div className="main-content-wrapper">
          <section className="content-info-wrapper">
            <h3 className="info-title">READY TO START?</h3>
            <p className="info-description">
              Start your cycling adventure by building a route{' '}
            </p>
            <NavLink
              to="/Editor"
              className="info-button start-button"
              title={
                // Checking if route is existing or not and display btn text by condition
                drawCoords.length > 0 ? 'Continue editing' : 'Create new route'
              }
              aria-label={
                drawCoords.length > 0 ? 'Continue editing' : 'Create new route'
              }
            >
              {drawCoords.length > 0 ? (
                ''
              ) : (
                <div className="gg-add-r header-button-icon-wrapper" />
              )}
              {drawCoords.length > 0 ? 'Continue editing' : 'NEW ROUTE'}
            </NavLink>
          </section>
          <section className="content-ilus-wrapper">
            <img src={preview} alt="" className="ilus-image lazyload" />
          </section>
        </div>
      </main>
      <footer className="footer-wrapper">
        <a
          href="https://github.com/swappnet/cycroute"
          rel="noreferrer"
          title="Go to project GitHub"
          className="footer-link"
        >
          <img alt="" src={githublogo} className="link-icon" />
          Github
        </a>

        <p className="footer-copyright">??{year} Vladyslav Okuskov ' cycroute</p>
      </footer>
    </div>
  );
}

export default StartScreen;
