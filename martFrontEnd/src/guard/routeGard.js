import Loadable from 'componets/Loadable';
import { lazy, useEffect, useState } from 'react';
import useAuth from '../customHook/useAuth';

// api
import { getRoleById } from '../api/role/roleApi';

// constants
import { ADMIN_URL, SALE_MAN_URL } from 'constant/constant';

const MaintenanceError = Loadable(lazy(() => import('../componets/Error')));

function RouteGard(props) {
    const { user } = useAuth();

    const [show, setShow] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [accessableUrls, setAccessableUrls] = useState([]);

    const fetchRoleById = async () => {
        try {
            const response = await getRoleById({ _id: user.role });
            if (typeof response === 'string') {
                console.log(response);
            } else {
                setUserRole(response.role);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setValuesOfAccessableUrls = () => {
        if (userRole === 'SUPER_ADMIN') {
            setAccessableUrls(ADMIN_URL);
        } else if (userRole === 'SALEMAN') {
            setAccessableUrls(SALE_MAN_URL);
        } else {
            setAccessableUrls([]);
        }
    };

    const { Component, url } = props;

    const checkAccess = () => {
        if (accessableUrls.includes(url)) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    useEffect(() => {
        checkAccess();
    }, [url, accessableUrls]);

    useEffect(() => {
        if (user) {
            fetchRoleById();
        }
    }, [user]);

    useEffect(() => {
        if (userRole) {
            setValuesOfAccessableUrls();
        }
    }, [userRole]);

    return show ? <Component /> : <MaintenanceError />;
}

export default RouteGard;
