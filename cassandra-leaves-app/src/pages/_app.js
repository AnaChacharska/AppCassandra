import React, { createContext, useState } from "react";
import "../app/globals.css";
import { DarkModeProvider } from "../contexts/DarkModeContext";

// Create GlobalContext
export const GlobalContext = createContext();

function MyApp({ Component, pageProps }) {
    const [leavesData, setLeavesData] = useState([]);

    return (
        <GlobalContext.Provider value={{ leavesData, setLeavesData }}>
            <DarkModeProvider>
                <Component {...pageProps} />
            </DarkModeProvider>
        </GlobalContext.Provider>
    );
}

export default MyApp;
