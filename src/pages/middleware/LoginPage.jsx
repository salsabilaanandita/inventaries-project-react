import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function LoginPage(){
    let authentication = localStorage.getItem("access_token");
    return authentication ? <Navigate to="/dashboard" replace /> : <Outlet />
}