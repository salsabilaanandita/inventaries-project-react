import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    let navigate = useNavigate();
    let isLogin = localStorage.getItem("access_token");
    let user = null;
try {
  const userData = localStorage.getItem("user");
  if (userData && userData !== "undefined") {
    user = JSON.parse(userData);
  }
} catch (error) {
  console.error("Invalid JSON user data:", error);
}

    function logoutHandler() {
        // hapus localstorage ketika logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
            <Link className="navbar-brand fw-bold" to="/">INVENTARIS APP</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav align-items-center gap-2">
                    {!isLogin ? (
                        <li className="nav-item">
                            <Link to="/login" className="btn btn-outline-light">Login</Link>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <button onClick={logoutHandler} className="btn btn-outline-light">Logout</button>
                        </li>
                    )}

                    {user && user.role === "admin" && (
                        <>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard/profile" className="nav-link text-white">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard/admin/stuffs" className="nav-link text-white">Stuffs</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard/admin/inbound" className="nav-link text-white">Inbounds</Link>
                            </li>
                        </>
                    )}

                    {user && user.role === "staff" && (
                        <li className="nav-item dropdown">
                            <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Lendings
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/dashboard/staff/lending">New</Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/dashboard/staff/lending/data">Data</Link>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </nav>
);

}