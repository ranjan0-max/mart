import WebhookIcon from '@mui/icons-material/Webhook';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';

const Sidebar = ({ drawerWidth, accessableMenuList, handleMenuItemClick }) => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: 'white',
                    zIndex: (theme) => theme.zIndex.appBar - 1 // Ensure Drawer is below AppBar
                }
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar style={{ paddingLeft: '5%' }}>
                <WebhookIcon />
                <Typography sx={{ fontWeight: 'bolder', marginLeft: 1 }}>Billing & Invoice</Typography>
            </Toolbar>
            <List>
                {accessableMenuList.map((menu) => (
                    <ListItem key={menu.label} disablePadding>
                        <ListItemButton onClick={() => handleMenuItemClick(menu.to, menu.label)}>
                            <ListItemIcon>{menu.icon}</ListItemIcon>
                            <ListItemText primary={menu.label} primaryTypographyProps={{ fontWeight: 'bold' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
