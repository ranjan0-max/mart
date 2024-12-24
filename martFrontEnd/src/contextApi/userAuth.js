import React, { createContext, useState } from 'react';
import axios from '../intercepter/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('accessToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const init = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                if (accessToken && verifyToken(accessToken)) {
                    setSession(accessToken);
                    const response = await axios.get('/auth/user');
                    const { user } = response.data.data;
                    setUser(user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        init();
    }, []);

    const login = async (data) => {
        try {
            const response = await axios.post('/auth/login', data);
            setUser(response.data.data.user);
            setIsAuthenticated(true);
            window.localStorage.setItem('accessToken', response.data.data.accessToken);
            // navigate('/home');
        } catch (error) {
            console.log(error);
        }
    };

    const logOut = async () => {
        try {
            await axios.get('/auth/logout');
        } catch (error) {
            console.log('error ', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, login, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
