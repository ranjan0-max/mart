import { AppBar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

// custom hook
import useAuth from 'customHook/useAuth';

// icon
import { IconSettings } from '@tabler/icons-react';

// constant
const ITEM_HEIGHT = 30;
const drawerWidth = 200;

const Header = ({ label }) => {
    const { logOut } = useAuth();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleSetting = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleLogOut = async () => {
        await logOut();
    };

    return (
        <Container maxWidth={false}>
            <div>
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        background: 'linear-gradient(to right, #11cdef, #1171ef)',
                        color: 'white',
                        boxShadow: 'none',
                        zIndex: (theme) => theme.zIndex.drawer + 1 // Ensure AppBar is above Drawer
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'black' }}>
                            {label.toUpperCase()}
                        </Typography>
                        <Box sx={{ flexGrow: 2 }} /> {/* Spacer */}
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={menuAnchorEl ? 'long-menu' : undefined}
                            aria-expanded={menuAnchorEl ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleSetting}
                            sx={{ cursor: 'pointer', color: 'black' }}
                        >
                            <IconSettings />
                        </IconButton>
                        <Menu
                            id="settings-menu"
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        </Container>
    );
};

export default Header;
