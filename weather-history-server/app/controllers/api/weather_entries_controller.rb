class Api::WeatherEntriesController < ApplicationController
    def index
        if params[:latitude] && params[:longitude] && params[:start_date] && params[:end_date]
            @weather_entry = WeatherEntry.where("latitude = ? AND longitude = ? AND date BETWEEN ? AND ?", params[:latitude], params[:longitude], params[:start_date], params[:end_date])

            date_start = Date.parse(params[:start_date])
            date_end = Date.parse(params[:end_date])
            number_of_days = (date_end - date_start + 1).to_i

            # If number of entries doens't match the number of days queried, access database to get missing information
            if number_of_days != @weather_entry.length()
                @api_weather_entries = RetrieveWeatherInfo.new(params[:latitude], params[:longitude], params[:start_date], params[:end_date]).query_api

                if @api_weather_entries.length == 0
                    render json: { error: "Unable to get data from Open-Meteo API for the parameters supplied" }, status: 500
                else 
                    render json: @api_weather_entries, status: :ok
                end
            else
                render json: @weather_entry, status: :ok
            end
        else 
            render json: { error: "Incorrect query parameters" }, status: 422
        end
    end

    def create
        @weather_entry = WeatherEntry.new(weather_entry_params)

        if @weather_entry.save
            render json: @weather_entry, status: :created
        else
            render json: { error: "Unable to create weather entry" }, status: 422
        end
    end

    private

    def weather_entry_params
        params.require(:weather_entry).permit(:latitude, :longitude, :date, :max_temp, :min_temp, :precipitation, :wind_speed)
    end
end
