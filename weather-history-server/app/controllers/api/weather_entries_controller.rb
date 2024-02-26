class Api::WeatherEntriesController < ApplicationController
    def index
        @weather_entries = WeatherEntry.all
        render json: @weather_entries, status: :ok
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
