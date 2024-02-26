import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

import { Coordinates, LocationItem, WeatherEntry } from "../../models/model";
import Button from "../Button/Button";
import styles from "./WeatherHistory.module.scss";

const DEBOUNCE_TIME = 300;
const TIME_INTERVAL_DAYS = 7;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeatherHistory = () => {
    const [weatherEntries, setWeatherEntries] = useState<WeatherEntry[]>([]);

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
    const isFormSubmittable = inputValue && startDate && endDate && inputCoordinates.latitude && inputCoordinates.longitude;

    // When <inputValue> changes, query Meteo API for an array of locations (including latitude and longitude) correspondent to the location string inputed
    useEffect(() => {
        if (inputValue === "" && inputRef.current) inputRef.current.focus(); // Focus on text input as soon as component mounts, if input value is still empty

        if (inputValue === "" || inputValue === " ") {
            setInputCoordinates({
                latitude: "",
                longitude: "",
            });
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
                } else {
                    console.log("No locations found");
                    setInputCoordinates({
                        latitude: "",
                        longitude: "",
                    });
                }
            } catch (err) {
                console.log("Error retrieving coordinates from Geocoding API");
                console.error(err);
                setInputCoordinates({
                    latitude: "",
                    longitude: "",
                });
            } finally {
                setIsLoadingCoordinates(false);
            }
        }, DEBOUNCE_TIME);

        // When a new "useEffect" call happens, clear the timeout so that the API request is cancelled
        return () => clearTimeout(getCoordinates);
    }, [inputValue, setInputCoordinates]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormSubmittable) return;

        setIsLoading(true);

        try {
            const response = await axios.get(
                `http://localhost:3001/api/weather_entries?latitude=${inputCoordinates.latitude}&longitude=${inputCoordinates.longitude}&start_date=${startDate}&end_date=${endDate}`
            );
            console.log(response.data);
            setWeatherEntries(response.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 422) {
                    console.log("Incorrect query parameters");
                    console.log(err.response?.data.error);
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

    const backgroundColors = ["rgb(43, 105, 134)", "rgb(16, 41, 51)", "rgb(14, 100, 139)", "rgb(23, 174, 244)"];
    const chartData = {
        labels: weatherEntries.map((weather_entry: WeatherEntry) => weather_entry.date),
        datasets: [
            {
                label: "Max Temp",
                data: weatherEntries.map((weather_entry: WeatherEntry) => weather_entry.max_temp),
                backgroundColor: backgroundColors[0],
                hoverBackgroundColor: "rgb(150, 210, 195)",
                hoverBorderColor: "rgb(18, 18, 18)",
                borderWidth: 1,
            },
            {
                label: "Min Temp",
                data: weatherEntries.map((weather_entry: WeatherEntry) => weather_entry.min_temp),
                backgroundColor: backgroundColors[1],
                hoverBackgroundColor: "rgb(150, 210, 195)",
                hoverBorderColor: "rgb(18, 18, 18)",
                borderWidth: 1,
            },
            {
                label: "Precipitation",
                data: weatherEntries.map((weather_entry: WeatherEntry) => weather_entry.precipitation),
                backgroundColor: backgroundColors[2],
                hoverBackgroundColor: "rgb(150, 210, 195)",
                hoverBorderColor: "rgb(18, 18, 18)",
                borderWidth: 1,
            },
            {
                label: "Wind",
                data: weatherEntries.map((weather_entry: WeatherEntry) => weather_entry.wind_speed),
                backgroundColor: backgroundColors[3],
                hoverBackgroundColor: "rgb(150, 210, 195)",
                hoverBorderColor: "rgb(18, 18, 18)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: inputValue,
                padding: {
                    bottom: 10,
                },
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (data: any) {
                        return data.dataset.label + ": " + data.formattedValue;
                    },
                },
            },
            maintainAspectRatio: true,
        },
    };

    return (
        <main className={styles.main_container}>
            <form onSubmit={handleSubmit} className={styles.form_container}>
                <div className={styles.input_container}>
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
                <div className={styles.date_inputs_container}>
                    <div className={styles.start_date_container}>
                        <DatePicker
                            label="Start Date"
                            value={dayjs(startDate)}
                            onChange={(e) => handleChangeStartDate(e)}
                            minDate={dayjs("1940-01-01")}
                            maxDate={dayjs(endDate)}
                        />
                    </div>
                    <div className={styles.start_date_container}>
                        <DatePicker
                            label="End Date"
                            value={dayjs(endDate)}
                            onChange={(e) => setEndDate(e?.format("YYYY-MM-DD"))}
                            minDate={startDate ? dayjs(startDate) : dayjs("1940-01-01")}
                            maxDate={dayjs(startDate).add(TIME_INTERVAL_DAYS, "day")}
                        />
                    </div>
                </div>
                <div className={styles.button_container}>
                    <Button
                        buttonBgColor="rgb(38, 136, 188)"
                        buttonTitle={isLoadingCoordinates ? "Loading..." : "Submit"}
                        buttonType="submit"
                        isDisabled={!isFormSubmittable}
                    />
                </div>
            </form>

            <div className={styles.chart_container}>
                {weatherEntries.length > 0 && !isLoading ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : weatherEntries.length > 0 && isLoading ? (
                    <h4 style={{ fontSize: "1.8rem" }}>Loading...</h4>
                ) : (
                    <h4 style={{ fontSize: "1.5rem" }}>No entries</h4>
                )}
            </div>
        </main>
    );
};

export default WeatherHistory;
