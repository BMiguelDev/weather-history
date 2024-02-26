# Weather History API 

####  This is a REST API that provides access to weather information for specific locations and dates. The parameters "latitude", "longitude", "start_date" and "end_date" are necessary to obtain a valid response. This server stores the weather entries information in a SQLite3 database, and makes HTTP requests to the [Meteo-API](https://open-meteo.com/) when the database doesn't have the necessary information (and updates the database with the new entries). This API serves as a backend to the "weather-history-client" project, which allows the user to visualize weather information for a specific location and dates.

#### Developed using Ruby and Ruby on Rails

## Instructions to run application in development mode:
- Download/clone this repository's code
- Open command line and navigate to server's folder: "weather-history-server"
- Run command "bundle install && rails db:create && rails db:migrate"
- Run command "rails s -p 3001" to start the server
- It's now possible to run the "weather-history-client" frontend project and make calls to this backend

## Skills shown in this project:
- Ruby, Ruby on Rails
- Model View Controller (MVC) architectural pattern
- Gitflow Workflow
