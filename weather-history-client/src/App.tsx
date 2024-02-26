import React, { useEffect, useRef } from "react";

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
            <div ref={appContainerRef} className="app_container">
                <Navbar />
                <WeatherHistory />
                <Footer />
            </div>
    );
};

export default App;
