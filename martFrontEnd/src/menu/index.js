import { Box, CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// icons
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// custom hook
import useAuth from 'customHook/useAuth';

// api
import { getRoleById } from '../api/role/roleApi';

// component
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 200;

export default function PermanentDrawerLeft() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [label, setLabel] = useState('');
    const [accessableMenuList, setAccessableMenuList] = useState([]);

    const adminMenuList = [
        {
            label: 'Items',
            icon: <ReceiptLongIcon />,
            to: '/home'
        },
        {
            label: 'Sale',
            icon: <DescriptionIcon />,
            to: '/receipt'
        },
        {
            label: 'User',
            icon: <PersonAdd />,
            to: '/user'
        }
    ];

    const saleManMenuList = [
        {
            label: 'Sale',
            icon: <DescriptionIcon />,
            to: '/receipt'
        }
    ];

    const fetchRoleById = async () => {
        try {
            const response = await getRoleById({ _id: user.role });
            if (typeof response === 'string') {
                console.log(response);
            } else {
                if (response.role === 'SUPER_ADMIN') {
                    setAccessableMenuList(adminMenuList);
                } else if (response.role === 'SALEMAN') {
                    setAccessableMenuList(saleManMenuList);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleMenuItemClick = (path, selectedLabel) => {
        navigate(path);
        setLabel(selectedLabel);
    };

    React.useEffect(() => {
        if (user) {
            fetchRoleById();
        }
    }, [user]);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            {/* Header */}
            <Box sx={{ position: 'fixed', width: `calc(100% - ${drawerWidth}px)`, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Header label={label} />
            </Box>
            {/* Sidebar */}
            <Sidebar drawerWidth={drawerWidth} accessableMenuList={accessableMenuList} handleMenuItemClick={handleMenuItemClick} />
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    borderRadius: '5px',
                    marginLeft: '3%',
                    marginRight: '3%',
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    marginTop: '55px', // Shift content from Header (assuming 64px height for Header)
                    overflowY: 'auto' // Enable scrolling if content exceeds height
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
