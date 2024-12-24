import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../customHook/useAuth';

// api
import { getRoleById } from '../api/role/roleApi';

const GuestGuard = ({ children }) => {
    // const { menu } = useSelector((state) => state.menu);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [userRole, setUserRole] = React.useState('');

    const fetchRoleById = async () => {
        try {
            const response = await getRoleById({ _id: user.role });
            if (typeof response === 'string') {
                console.log(response);
            } else {
                if (response.role === 'SUPER_ADMIN') {
                    setUserRole('SUPER_ADMIN');
                } else if (response.role === 'SALEMAN') {
                    setUserRole('SALEMAN');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userRole) {
            if (isAuthenticated) {
                if (userRole === 'SUPER_ADMIN') {
                    navigate('/home'); // here you can send different routes or role wise dashboard
                } else if (userRole === 'SALEMAN') {
                    navigate('/receipt');
                }
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate, userRole]);

    useEffect(() => {
        if (user) {
            fetchRoleById();
        }
    }, [user]);

    return children;
};

export default GuestGuard;
