import { Link } from 'react-router-dom';
import ProfileButton from '../Navigation/ProfileButton';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <img src="/logo3.png" alt="DalVacationHomes Logo" className="logo" />
      </Link>
      <div className="quote">
      A rental home is a blank canvas for your life’s most beautiful memories.
      </div>
      <nav className="nav">
        <ul className="navigation">
          <li>
            <ProfileButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
