import React from "react";
import { AppBar,
         Container,
         Toolbar,
         Box,
         IconButton,
         Button,
         Tooltip,
         Avatar,
         Menu,
         MenuItem,
         Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { navMenuItems, rightMenuItems } from "../../constants/MenuConstants";
import classes from "./MainHeader.module.css";
import { Link } from 'react-router-dom';

import {logo} from '../../assets/images';

const MainHeader = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }
    ;
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return(
        <AppBar position="static" className={classes.header}>
          <Toolbar disableGutters className={classes["app-toolbar"]}>
            <img alt='logo' src={String(logo)} style={{ width: '5rem'}}/>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
              <IconButton
                size="large"
                aria-label="Holy Family Main Menu"
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
                {navMenuItems.map((item) => (
                  <MenuItem key={item.key} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                        <Link to={item.navLink} className={classes["nav-link-menu"]}>
                            {item.value}
                        </Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navMenuItems.map((item) => (
                <Button
                  key={item.key}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Typography textAlign="center">
                      {item.navLink.startsWith("https:") ?
                          <a href={item.navLink} className={classes["nav-link"]}>{item.value}</a>
                          :
                          <Link to={item.navLink} className={classes["nav-link"]}>
                              {item.value}
                          </Link>
                      }
                  </Typography>
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" 
                          src="/static/images/avatar/2.jpg" 
                          className={classes["app-avatar"]}/>
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
                {rightMenuItems.map((item) => (
                  <MenuItem key={item.key} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{item.value}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
      </AppBar>
    );

}

export default MainHeader;
