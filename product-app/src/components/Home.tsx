import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItemText, CssBaseline, Box, ListItemButton, IconButton, useMediaQuery, Theme } from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { styled } from '@mui/system';

const drawerWidth = 240;

// StyledNavLink with corrected active state handling
const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  display: 'block', // Ensure it behaves as a block element for consistent styling

  // Active state
  '&.active': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  // Hover state
  // '&:hover': {
  //   color: theme.palette.text.secondary,
  //   backgroundColor: theme.palette.action.hover,
  // },

  // Ensure the ListItemButton inside inherits styles properly
  '& .MuiListItemButton-root': {
    '&.active': {
      backgroundColor: 'transparent', // Prevent ListItemButton from overriding the active background
    },
  },
}));

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', marginTop: '64px' }}>
      <List>
        <StyledNavLink to="/add-product">
          <ListItemButton>
            <ListItemText primary="Add Product" />
          </ListItemButton>
        </StyledNavLink>
        
        <StyledNavLink to="/product-list">
          <ListItemButton>
            <ListItemText primary="Product List" />
          </ListItemButton>
        </StyledNavLink>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ marginBottom: -1, marginTop: -1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Product App
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Button color="inherit" variant="contained" onClick={onLogout} style={{ margin: '1rem', color: 'black' }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;