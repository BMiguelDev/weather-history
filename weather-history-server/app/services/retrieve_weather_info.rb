require 'httparty'

# Queries weather API, stores new info in database, and returns it
class RetrieveWeatherInfo
    def initialize(latitude, longitude, start_date, end_date)
      @latitude = latitude
      @longitude = longitude
      @start_date = start_date
      @end_date = end_date
    end
  
    def query_api
        response = HTTParty.get("https://archive-api.open-meteo.com/v1/archive?latitude=#{@latitude}&longitude=#{@longitude}&start_date=#{@start_date}&end_date=#{@end_date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max")

        if response.code == 200
            weather_data = response.parsed_response
            weather_data_daily = weather_data["daily"]
            weather_dates_array = weather_data_daily["time"]
            weather_max_temp_array = weather_data_daily["temperature_2m_max"]
            weather_min_temp_array = weather_data_daily["temperature_2m_min"]
            weather_precipitation_array = weather_data_daily["precipitation_sum"]
            weather_wind_speed_array = weather_data_daily["wind_speed_10m_max"]

            results_array = [];

            for i in 0..weather_dates_array.length()-1 do                
                # Store entry in return array to avoid having to query database again after inserting new information
                weather_entry = WeatherEntry.new(
                    :latitude => @latitude, 
                    :longitude => @longitude,
                    :date => weather_dates_array[i],
                    :max_temp => weather_max_temp_array[i],
                    :min_temp => weather_min_temp_array[i],
                    :precipitation => weather_precipitation_array[i],
                    :wind_speed => weather_wind_speed_array[i]
                )

                results_array << weather_entry

                # Save entry to db is it doesn't already exist
                begin 
                    WeatherEntry.create!(
                        :latitude => @latitude,
                        :longitude => @longitude,
                        :date => weather_dates_array[i],
                        :max_temp => weather_max_temp_array[i],
                        :min_temp => weather_min_temp_array[i],
                        :precipitation => weather_precipitation_array[i],
                        :wind_speed => weather_wind_speed_array[i]
                    )
                rescue ActiveRecord:: RecordNotUnique
                    next
                end
            end

            return results_array
        else
            return []
        end

    end
  end
