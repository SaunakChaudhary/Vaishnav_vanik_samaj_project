/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useContext } from "react";
import { UserDataContext } from "../Context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedUser = ({ children }) => {
    const navigate = useNavigate();
    const { setLoggedInUser } = useContext(UserDataContext);
    const token = localStorage.getItem("token");

    const getUserData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/get-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                const {
                    password,
                    __v,
                    createdAt,
                    updatedAt,
                    ...safeUser
                } = data.user;

                setLoggedInUser(safeUser);
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error("Error while fetching user data " + error);
        }

    }

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            getUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return <>{children}</>;
}

export default ProtectedUser
