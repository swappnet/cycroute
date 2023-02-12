import headerlogo from '../../assets/headerlogo.svg';

function Header() {
  return (
    <nav className="header--wrapper">
      <h1 className="header-title">CYCROUTE</h1>
      <img
        src={headerlogo}
        className="header-logo"
        aria-label="Header Logo"
        alt=""
      />
    </nav>
  );
}

export default Header;
