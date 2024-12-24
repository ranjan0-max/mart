import { lazy } from 'react';

// project imports
import RouteGard from 'guard/routeGard';
import Loadable from '../componets/Loadable';
import AuthGuard from '../guard/authGuard';
import MenuLayout from '../menu';

const ItemDefault = Loadable(lazy(() => import('../view/item')));
const Recipt = Loadable(lazy(() => import('../view/sale/ReceiptForm')));
const User = Loadable(lazy(() => import('../view/user')));

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MenuLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/home',
            element: <RouteGard Component={ItemDefault} url={'/home'} />
        },
        {
            path: '/receipt',
            element: <RouteGard Component={Recipt} url={'/receipt'} />
        },
        {
            path: '/user',
            element: <RouteGard Component={User} url={'/user'} />
        }
    ]
};

export default MainRoutes;
