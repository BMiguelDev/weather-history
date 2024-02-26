# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

weather_entries = WeatherEntry.create([
    {
        latitude: "12", 
        longitude:"10", 
        date: "2000-12-10", 
        max_temp: "20", 
        min_temp: "10", 
        precipitation: "4", 
        wind_speed: "3"
    }, 
    {
        latitude: "12", 
        longitude:"10", 
        date: "2000-12-11", 
        max_temp: "22", 
        min_temp: "12", 
        precipitation: "5", 
        wind_speed: "6"
    },
    {
        latitude: "12", 
        longitude:"10", 
        date: "2000-12-12", 
        max_temp: "16", 
        min_temp: "7", 
        precipitation: "2", 
        wind_speed: "1"
    },
    {
        latitude: "12", 
        longitude:"10", 
        date: "2000-12-13", 
        max_temp: "30", 
        min_temp: "20", 
        precipitation: "8", 
        wind_speed: "4"
    },
    {
        latitude: "112", 
        longitude:"110", 
        date: "2000-12-10", 
        max_temp: "25", 
        min_temp: "21", 
        precipitation: "1", 
        wind_speed: "1"
    },
    {
        latitude: "112", 
        longitude:"110", 
        date: "2000-12-13", 
        max_temp: "31", 
        min_temp: "22", 
        precipitation: "3", 
        wind_speed: "1"
    }
])
