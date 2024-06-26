import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css'; // Import the external CSS file

function ProfileButton() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

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

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className="menu-button">
        <FiMenu />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <>
          <li onClick={handleLogin}>Log In</li>
          <li onClick={handleSignup}>Sign Up</li>
          <li onClick={handleAdd}>Add a room</li>
        </>
      </ul>
    </>
  );
}

export default ProfileButton;
