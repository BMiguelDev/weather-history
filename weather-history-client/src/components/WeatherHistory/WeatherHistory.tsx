import { useState } from "react";
import axios from "axios";

import styles from "./WeatherHistory.module.scss";


const WeatherHistory = () => {

    const [inputValue, setInputValue] = useState<string>("");


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("submit")
    };

    return (
        <main className={styles.main_container}>
            <form onSubmit={handleSubmit}>
                <div className={inputValue.length >= 50 ? "input_max_limit" : ""}>
                    <label htmlFor="inputValue">Location:</label>
                    <div>
                        <input
                            type="text"
                            id="inputValue"
                            name="title"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            maxLength={50}
                            placeholder="Lisbon..."
                        />
                    </div>
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>
        </main>
    );
};

export default WeatherHistory;
