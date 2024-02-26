import React, { useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WeatherHistory from "./components/WeatherHistory/WeatherHistory";
import "./App.scss";

const App = () => {
    const appContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Function to lock height at window's inner height
        const handleResize = () => {
            if (appContainerRef.current) appContainerRef.current.style.height = `${window.innerHeight}px`;
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div ref={appContainerRef} className="app_container">
                <Navbar />
                <WeatherHistory />
                <Footer />
            </div>
        </LocalizationProvider>
    );
};

export default App;
