import React, { createContext, useState } from "react";
import "../app/globals.css";

export const GlobalContext = createContext();

function MyApp({ Component, pageProps }) {
    const [leavesData, setLeavesData] = useState([]);

    return (
        <GlobalContext.Provider value={{ leavesData, setLeavesData }}>
            <Component {...pageProps} />
        </GlobalContext.Provider>
    );
}

export default MyApp;
