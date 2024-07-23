import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';

import { logoutUser } from '../../utils/Auth';

import Cookies from 'js-cookie';

function ProfileButton() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    if (Cookies.get("user_id")) {
      setIsUserLoggedIn(true);
    }

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleLogin = () => {
    closeMenu();
    navigate('/login');
  };

  const handleSignup = () => {
    closeMenu();
    navigate('/signup');
  };

  const handleAdd = () => {
    closeMenu();
    navigate('/add');
  };
  
  const handleReport = () => {
    closeMenu();
    navigate('/dashboard');
  };

  const handleTickets = () => {
    closeMenu();
    navigate('/tickets');
  };

  const handleLogout = () => {
    closeMenu();
    
    Cookies.remove('jwtToken');
    Cookies.remove('user_id');
    Cookies.remove('email');
    Cookies.remove('name');
    Cookies.remove('profile');

    logoutUser();

    window.location.reload();
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className="menu-button">
        <FiMenu />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <>
          {!isUserLoggedIn && (<li onClick={handleLogin}>Log In</li>)}
          {!isUserLoggedIn && <li onClick={handleSignup}>Sign Up</li>}
          <li onClick={handleAdd}>Add a room</li>
          <li onClick={handleReport}>Report & Analytics</li>
          <li onClick={handleTickets}>Tickets</li>
          {isUserLoggedIn && <li onClick={handleLogout}>Logout</li>}
        </>
      </ul>
    </>
  );
}

export default ProfileButton;
