import React from 'react'
import { useEffect, useContext } from "react";
import { UserDataContext } from "../Context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedAdmin = ({ children }) => {
    const navigate = useNavigate();
    const { setAdminLoggedIn } = useContext(UserDataContext);
    const token = localStorage.getItem("adminToken");

    const getUserData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/dashboard-data`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAdminLoggedIn(data.LoggedIn);
            } else {
                setAdminLoggedIn(data.LoggedIn);
                navigate("/admin/login");
            }
        } catch (error) {
            toast.error("Error while fetching user data " + error);
        }

    }

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
        } else {
            getUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return <>{children}</>;
}

export default ProtectedAdmin
