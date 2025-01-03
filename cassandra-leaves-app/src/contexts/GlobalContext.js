import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [leaves, setLeaves] = useState([]);

    return (
        <GlobalContext.Provider value={{ leaves, setLeaves }}>
            {children}
        </GlobalContext.Provider>
    );
};