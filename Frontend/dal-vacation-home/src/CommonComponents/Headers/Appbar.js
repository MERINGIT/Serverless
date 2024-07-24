import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = [
    {
        name: 'Add a room',
        route: '/add',
        role: 'property-agent'
    }, 
    {
        name: 'Report Analytics',
        route: '/dashboard',
        role: 'property-agent'
    }, 
    {
        name: 'Tickets',
        route: '/tickets',
        role: 'property-agent'
    }, 
    { 
        name: 'My Bookings',
        route: "/",
        role: 'user'
    }
];

function ResponsiveAppBar({name, role, toggleUpdated}) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [updated, setUpdated] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('user_id');
    Cookies.remove('email');
    Cookies.remove('name');
    Cookies.remove('profile');
    setAnchorElUser(null);
    toggleUpdated();
    navigate('/login');
  }
  
  return (
    <AppBar position="static" style={{padding: '5px', marginBottom: '1rem'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <img src="/logo3.png" alt="DalVacationHomes Logo" className="logo" />
          </Link>
        
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Typography variant='h5'>A rental home is a blank canvas for your life’s most beautiful memories!</Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={name} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                {
                    ((role == null) || (role == 'undefined')) && (
                        <>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Link to="/login" style={{textDecoration: 'none', color: '#000'}}>
                                    <Typography textAlign="center">Log In</Typography>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Link to="/signup" style={{textDecoration: 'none', color: '#000'}}>
                                    <Typography textAlign="center">Sign Up</Typography>
                                </Link>
                            </MenuItem>
                        </>
                    )
                }
                {settings.map((setting) => setting.role === role && (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Link to={setting.route} style={{textDecoration: 'none', color: '#000'}}>
                            <Typography textAlign="center">{setting.name}</Typography>
                        </Link>
                    </MenuItem>
                ))}
                {
                    ((role === 'user') || (role == 'property-agent')) && (
                        <MenuItem onClick={handleLogOut}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    )
                }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
