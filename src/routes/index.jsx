import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Template from '../layouts/Template';
import Dashboard from '../pages/Dashboard';
import PrivatePage from '../pages/middleware/PrivatePage';
import LoginPage from '../pages/middleware/LoginPage';
import StuffIndex from '../pages/stuffs';
import InboundIndex from '../pages/inbounds';
import AdminRoute from '../pages/middleware/AdminRoute';
import StaffRoute from '../pages/middleware/StaffRoute';
import Lendings from '../pages/lendings';
import LendingData from '../pages/lendings/Data';

export const router = createBrowserRouter([
    {path: "/", element: <Template/>,
    children: [
        {path: "/", element: <App/>},
            {path: "/login",    
            element: <LoginPage/>,
            children: [
                {path: '', element: <Login />}
            ]
        },
        {
            path: "/dashboard",
            element: <PrivatePage/>,
            children: [
                {path: '', element: <Dashboard />},
                {
                    path: 'profile', element: <Profile />

                },
                { 
                    path: 'admin',
                    element: <AdminRoute />,
                    children: [
                        {
                            path: 'stuffs', 
                            element: <StuffIndex />,
                        },
                        {
                            path: 'inbound', 
                            element: <InboundIndex />,
                        }
                    ]        
                },
                {
                    path: 'staff',
                    element: <StaffRoute/>,
                    children: [
                        {path: 'lending', element: <Lendings/>},
                        {path: 'lending/data', element: <LendingData/>}
                    ]
                }
            ]
        }

    ]
    }
     
])

