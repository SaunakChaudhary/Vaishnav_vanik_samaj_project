import React, { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { UserDataContext } from '../Context/userContext';

const Logout = () => {
    const { setLoggedInUser } = useContext(UserDataContext);

    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigate('/');
        setLoggedInUser([]);
    }, []);

    return (
        <></>
    )
}

export default Logout
