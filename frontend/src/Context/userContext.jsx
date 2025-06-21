import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();
const UserContext = ({ children }) => {
    const [User, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : [];
    });

    const [LoggedInUser, setLoggedInUser] = useState([]);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);

    useEffect(() => {
        if (User) {
            localStorage.setItem("user", JSON.stringify(User));
        } else {
            localStorage.removeItem("user");
        }
    }, [User]);

    useEffect(() => {
        if (LoggedInUser) {
            setLoggedInUser(LoggedInUser)
            localStorage.setItem("user", JSON.stringify(LoggedInUser));
        }
    }, [LoggedInUser])

    return (
        <UserDataContext.Provider value={{ User, setUser, LoggedInUser, setLoggedInUser,setAdminLoggedIn,adminLoggedIn }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
