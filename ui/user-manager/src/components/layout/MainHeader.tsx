import React from "react";
import { AppBar,
         Toolbar,
         Box,
         IconButton,
         Button,
         Tooltip,
         Avatar,
         Menu,
         MenuItem,
         Typography} from "@mui/material";
import { indigo } from '@mui/material/colors';

import { useDispatch, useSelector } from 'react-redux';

import MenuIcon from '@mui/icons-material/Menu';
import { navMenuItems, rightMenuItems, NavMenuItemType } from '../../constants/MenuConstants';
import classes from "./MainHeader.module.css";
import { Link, useNavigate } from 'react-router-dom';
import {logo} from '../../assets/images';
import { RootState } from '../../store';
import {resetAuthStatus} from '../../store/auth/auth-slice';

const MainHeader = () => {
    const authStatus = useSelector((state: RootState) => state.auth.isAuthenticated);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const dispatch = useDispatch();
    let navigate = useNavigate();

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
    const handleCloseUserMenu = (menuItem: any) => {
        setAnchorElUser(null);
        console.log("Menu Item: " + menuItem);
        if (menuItem.target.outerText.toLowerCase() === "logout") {
          dispatch(resetAuthStatus());
          navigate("/home");
          return;
        }

        if (menuItem.target.outerText.toLowerCase() === "dashboard") {
          navigate("/dashboard");
        }
    };

    const profileMenu = () => {
      if (authStatus) {
        return (
          <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open User Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt= {accessToken!.userInfo.firstName + " " + accessToken!.userInfo.lastName}
                          src="/static/images/avatar/2.jpg"
                          sx={{ bgcolor: indigo[500] }}
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
        );
      } else {
        return null;
      }
    }

    /** Return main header menu items */
    const mainHeaderMenu = (item: NavMenuItemType, isDropdown: boolean) => {
      const menuClassName = isDropdown? "nav-link-menu":"nav-link";
      if (item.navLink.startsWith("https:") ) {
        if (!authStatus)
          return isDropdown ? getDropdownLoginUrl(item, menuClassName) : getLoginUrl(item, menuClassName);
        else
          return null;
      } else if (item.isPrivate) {
          if (authStatus) {
            return !isDropdown? menuLinkItem(item) : menuDropdownItem(item);
          } else {
            return null;
          }
      } else {
        return !isDropdown? menuLinkItem(item) : menuDropdownItem(item);;
      }
    }

    const getLoginUrl = (item: NavMenuItemType, menuClassName: string) => {
      return (
        <MenuItem key={item.key} onClick={handleCloseNavMenu}>
        <Button
          key={item.key}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, color: 'white', display: 'block' }}>
            <Typography textAlign="center">
              <a href={item.navLink} className={classes[menuClassName]}>{item.value}</a>
            </Typography>
        </Button>
      </MenuItem>
      );
    }

    const getDropdownLoginUrl = (item: NavMenuItemType, menuClassName: string) => {
      return (
        <MenuItem key={item.key} onClick={handleCloseNavMenu}>
          <Typography textAlign="center">
            <a href={item.navLink} className={classes[menuClassName]}>{item.value}</a>
          </Typography>
        </MenuItem>
      );
    }

    const menuDropdownItem = (item: NavMenuItemType) => {
      return (
        <MenuItem key={item.key} onClick={handleCloseNavMenu}>
        <Typography textAlign="center">
            <Link to={item.navLink} className={classes["nav-link-menu"]}>
                {item.value}
            </Link>
        </Typography>
      </MenuItem>
      );
    }

    const welcomeSection = () => {
      return (
        <Typography variant="h6">
          {(authStatus)? "Welcome " + accessToken?.userInfo.firstName : ""}
        </Typography>
      );
    }

    const menuLinkItem = (item: NavMenuItemType) => {
      return (
        <Button
          key={item.key}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, color: 'white', display: 'block' }}>
        <Typography textAlign="center">
          <Link to={item.navLink} className={classes["nav-link"]}>
            {item.value}
          </Link>
        </Typography>
      </Button>
      )
    }

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
                    mainHeaderMenu(item, true)
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navMenuItems.map((item) => (

                  mainHeaderMenu(item, false)

              ))}
            </Box>
            { welcomeSection()}
              {
                profileMenu()
              }
          </Toolbar>
      </AppBar>
    );

}

export default MainHeader;
