class Api::WeatherEntriesController < ApplicationController
    def index

        if params[:latitude] && params[:longitude] && params[:start_date] && params[:end_date]

            @weather_entry = WeatherEntry.where("latitude = ? AND longitude = ? AND date BETWEEN ? AND ?", params[:latitude], params[:longitude], params[:start_date], params[:end_date])
            render json: @weather_entry, status: :ok

        else 
            # @weather_entries = WeatherEntry.all
            # render json: @weather_entries, status: :ok
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
