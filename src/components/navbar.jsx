import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    let navigate = useNavigate();
    let isLogin = localStorage.getItem("access_token");
    let user = JSON.parse(localStorage.getItem("user"));
    function logoutHandler() {
        // hapus localstorage ketika logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">INVENTARIS APP</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {!isLogin ? (
                            <li className="nav-item">
                                <Link to="/login" className="nav-link active" aria-current="page">Login</Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <a className="nav-link active" href="#" aria-current="page" onClick={logoutHandler}>logout</a>
                            </li>
                        )
                        }
                        {
                            user && user.role == "admin" ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/dashboard" className="nav-link active" aria-current="page">Dashboard</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/dashboard/profile" className="nav-link active" aria-current="page">Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/dashboard/admin/stuffs" className='nav-link active' aria-current="page">Stuffs</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/dashboard/admin/inbound" className='nav-link active' aria-current="page">Inbounds</Link>
                                    </li>
                                    {/* <li className="nav-item ">
                                        <a className="nav-link active" href="#" aria-current="page" onClick={logoutHandler}>logout</a>
                                    </li> */}
                                </>


                            ) : user && user.role == "staff" ? (
                                <>
                                    <div className="dropdown">
                                        <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Lendings
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/dashboard/staff/lending">New</Link></li>
                                            <li><Link className="dropdown-item" to="/dashboard/staff/lending/data">Data</Link></li>
                                            {/* <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                                        </ul>
                                    </div>
                                </>
                            ) : ''
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}