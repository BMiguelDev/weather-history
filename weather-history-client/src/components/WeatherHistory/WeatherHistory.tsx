import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

import { Coordinates, LocationItem } from "../../models/model";
import styles from "./WeatherHistory.module.scss";

const DEBOUNCE_TIME = 300;
const TIME_INTERVAL_DAYS = 7;

const WeatherHistory = () => {
    const [data, setData] = useState<any>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingCoordinates, setIsLoadingCoordinates] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string | undefined>("");
    const [endDate, setEndDate] = useState<string | undefined>("");

    const [inputValue, setInputValue] = useState<string>("");
    const [inputCoordinates, setInputCoordinates] = useState<Coordinates>({
        latitude: "",
        longitude: "",
    });

    const inputRef = useRef<HTMLInputElement>(null);

    // useEffect(() => {
    //     if (inputValue === "" && inputRef.current) inputRef.current.focus(); // Focus on text input as soon as component mounts, if input value is still empty
    // }, [inputValue]);


    // When <inputValue> changes, query Meteo API for an array of locations (including latitude and longitude) correspondent to the location string inputed
    useEffect(() => {
        if (inputValue === "" && inputRef.current) inputRef.current.focus(); // Focus on text input as soon as component mounts, if input value is still empty

        if (inputValue === "" || inputValue === " ") {
            setInputCoordinates({
                latitude: "",
                longitude: "",
            });
            setErrorMessage("");
            setIsLoadingCoordinates(false);
            return;
        }

        setIsLoadingCoordinates(true);

        const getCoordinates = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=8&language=en&format=json`
                );

                if (response.data.results) {
                    const locations: LocationItem[] = response.data.results;
                    setInputCoordinates({
                        latitude: locations[0].latitude.toString(),
                        longitude: locations[0].longitude.toString(),
                    });
                    console.log(locations);
                    setErrorMessage("");
                } else {
                    console.log("No locations found");
                    setInputCoordinates({
                        latitude: "",
                        longitude: "",
                    });
                    setErrorMessage("Not Locations Found");
                }
            } catch (err) {
                console.log("Error retrieving coordinates from Geocoding API");
                console.error(err);
                setInputCoordinates({
                    latitude: "",
                    longitude: "",
                });
                setErrorMessage("Error retrieving coordinates from Geocoding API");
            } finally {
                setIsLoadingCoordinates(false);
            }
        }, DEBOUNCE_TIME);

        // When a new "useEffect" call happens, clear the timeout so that the API request is cancelled
        return () => clearTimeout(getCoordinates);
    }, [inputValue, setInputCoordinates]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputValue) return;

        setIsLoading(true)

        try {
            const response = await axios.get(
                `http://localhost:3001/api/weather_entries?latitude=${inputCoordinates.latitude}&longitude=${inputCoordinates.longitude}&start_date=${startDate}&end_date=${endDate}`
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

    const handleChangeStartDate = (event: dayjs.Dayjs | null) => {
        if (!event) return;

        const newStartDate = event;
        const newStartDateString = newStartDate.format("YYYY-MM-DD");
        setStartDate(newStartDateString);

        // If new start date is more than <TIME_INTERVAL_DAYS> days away from the end date, set end date to the maximum allowed date
        if (Math.abs(newStartDate.diff(endDate, "day")) > TIME_INTERVAL_DAYS) {
            setEndDate(newStartDate.add(TIME_INTERVAL_DAYS, "day").format("YYYY-MM-DD"));
        }
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
                <DatePicker
                    label="Start Date"
                    value={dayjs(startDate)}
                    onChange={(e) => handleChangeStartDate(e)}
                    minDate={dayjs("1940-01-01")}
                    maxDate={dayjs(endDate)}
                />
                <DatePicker
                    label="End Date"
                    value={dayjs(endDate)}
                    // onChange={(e) => handleChangeDate(e, "end")}
                    onChange={(e) => setEndDate(e?.format("YYYY-MM-DD"))}
                    minDate={startDate ? dayjs(startDate) : dayjs("1940-01-01")}
                    maxDate={dayjs(startDate).add(TIME_INTERVAL_DAYS, "day")}
                />
                <button type="submit">
                    {isLoadingCoordinates ? "Loading..." : "Submit"}
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
