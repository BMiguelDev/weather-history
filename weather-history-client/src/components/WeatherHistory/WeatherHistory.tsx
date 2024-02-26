import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";

import styles from "./WeatherHistory.module.scss";


const WeatherHistory = () => {
    const [data, setData] = useState<any>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [inputValue, setInputValue] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputValue === "" && inputRef.current) inputRef.current.focus(); // Focus on text input as soon as component mounts, if input value is still empty
    }, [inputValue]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputValue) return;

        setIsLoading(true)

        try {
            const response = await axios.get(
                `http://localhost:3001/api/weather_entries?latitude=12&longitude=14&start_date=2000-12-13&end_date=2000-12-14`
            );
            console.log(response.data);
            setData(response.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 422) {
                    console.log("Incorrect query parameters");
                    setErrorMessage(err.response?.data.error);
                } else {
                    console.log(err);
                }
            } else console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const validInputRegex = /^(?!.*(?: {2}|''|--|-'|'-))[A-Za-z\s'-]*$/; // Regex to validate location input
        if (event.target.value.match(validInputRegex)) setInputValue(event.target.value);
    };

    return (
        <main className={styles.main_container}>
            <form onSubmit={handleSubmit}>
                <div className={inputValue.length >= 50 ? "input_max_limit" : ""}>
                    <label htmlFor="inputValue">Location:</label>
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            id="inputValue"
                            name="title"
                            value={inputValue}
                            onChange={handleInputChange}
                            maxLength={50}
                            placeholder="Lisbon..."
                        />
                    </div>
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>

            <br />
            <div>{data.length !== 0 ? JSON.stringify(data) : "Loading"}</div>
            <br />
            {errorMessage !== "" ? <div>{errorMessage}</div> : ""}
        </main>
    );
};

export default WeatherHistory;
